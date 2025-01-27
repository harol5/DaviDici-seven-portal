<?php

namespace App\Http\Controllers;

use Inertia\{ Inertia, Response as InertiaResponse};
use Illuminate\Support\Str;
use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Services\OAuthTokenService;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Gate;
use Barryvdh\DomPDF\Facade\Pdf;

use App\Services\TestingService;

/*
 * TODO:
 *  replace magic variable (foxpro program names) with CONSTANTS
 * */

class OrdersController extends Controller
{
    // Show all orders.
    public function all(Request $request): InertiaResponse
    {
        $username = auth()->user()->username;
        $message = $request->session()->get('message');

        $orders = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);

        $commissionInfo = FoxproApi::call([
            'action' => 'GETCOMMINFO',
            'params' => [$username],
            'keep_session' => false,
        ]);

        // get all orders if user is owner.
        $userRole = auth()->user()->role;
        $companyOrders = [];
        if ($userRole === 1919 || $userRole === 3478) {
            $foxproRes = FoxproApi::call([
                'action' => 'getordersbycompany',
                'params' => [$username],
                'keep_session' => false,
            ]);

            if ($foxproRes['status'] !== 500 && array_key_exists('rows', $foxproRes) && isset($foxproRes['rows'])) {
                $companyOrders = $foxproRes['rows'];
            } else {
                logFoxproError(
                    'getordersbycompany',
                    'OrdersController->all',
                    [$username],
                    $foxproRes
                );
            }
        }

        // assigns an empty array so template can display proper message.
        if ($orders['status'] === 500) $orders['rows'] = [];

        if ($commissionInfo['status'] === 500 || array_key_exists('Result', $commissionInfo) && $commissionInfo['Result'] === 'there are no sales orders for this wholesaler') {
            logFoxproError(
                'GETCOMMINFO',
                'OrdersController->all',
                [$username],
                $commissionInfo
            );
            $commissionInfo['rows'] = [];
        }

        return Inertia::render(
            'Orders/Orders',
            [
                'orders' => $orders['rows'],
                'message' => $message,
                'commissionInfo' => $commissionInfo['rows'],
                'allOrders' => $companyOrders
            ]
        );
    }

    // Show single order overview.
    public function orderOverview(Request $request, string $orderNumber)
    {
        // throw 404 if order number does not exist
        $order = $request->all();
        $response = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        if ($response['status'] === 201) {
            return Inertia::render(
                'Orders/OrderOverview',
                [
                    'order' => $order,
                    'products' => $response['rows'],
                    'isPaymentSubmitted' => $this->isPaymentSubmitted($orderNumber),
                    'isDeliveryInfoSave' => $this->isDeliveryInfoSave($orderNumber),
                ]
            );
        }

        logFoxproError('GetSoStatus', 'orderOverview', [$orderNumber], $response);
        return back()->with(['message' => 'Something went wrong. please contact support']);
    }

    // Get orders products.
    public function getProducts(Request $request)
    {
        $orderNumber = getOrderNumberFromPath($request->path());
        $response = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        if ($response['status'] === 201) {
            return response(['products' => $response['rows'], 'status' => 201])->header('Content-Type', 'application/json');
        }

        logFoxproError('GetSoStatus', 'getProducts', [$orderNumber], $response);
        return response(['products' => "something went wrong, please contact support", 'status' => 500])->header('Content-Type', 'application/json');
    }

    // Show single order details. TODO: ADD ERROR LOGGING
    public function orderDetails(Request $request)
    {
        // throw 404 if order number does not exist
        $username = auth()->user()->username;
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

        // Error: undefined rows?
        $products = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        return Inertia::render('Orders/OrderDetails', ['rawOrder' => $order, 'rawProducts' => $products['rows'], 'isPaymentSubmitted' => $this->isPaymentSubmitted($orderNumber)]);
    }

    // Update quantity product. TODO: ADD ERROR LOGGING
    public function updateQuantity(Request $request)
    {
        $product = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

        //"Result": "Can not update -- this Sales Order is in use" |
        $res = FoxproApi::call([
            'action' => 'ChangeOrderQty',
            'params' => [$orderNumber, $product['uscode'], $product['linenum'], $product['qty']],
            'keep_session' => false,
        ]);

        if ($res['status'] === 500 || $res['Result'] !== 'Updated Info') {
            Log::error("=VVVVV===ERROR REQUESTING DATA FROM FOXPRO====VVVVV");
            Log::error($res);
        }

        return response($res)->header('Content-Type', 'application/json');
    }

    // Update product note. TODO: ADD ERROR LOGGING
    public function updateProductNote(Request $request)
    {
        $info = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

        // "Result": "Updated Info" |
        $res = FoxproApi::call([
            'action' => 'ChangeOrderNote',
            'params' => [$orderNumber, $info['sku'], $info['lineNum'], $info['note']],
            'keep_session' => false,
        ]);

        if ($res['status'] === 500 || $res['Result'] !== 'Updated Info') {
            Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: ChangeOrderNote ====VVVVV");
            Log::error($res);
        }

        return response($res)->header('Content-Type', 'application/json');
    }

    // Delete product.
    public function deleteProduct(Request $request)
    {
        $req = $request->all();
        $product = $req['product'];
        $numOfProducts = $req['numOfProduct'];
        $orderNumber = getOrderNumberFromPath($request->path());

        $res = FoxproApi::call([
            'action' => 'DELETELINE',
            'params' => [$orderNumber, $product['uscode'], $product['linenum'], $product['qty']],
            'keep_session' => false,
        ]);

        if ($res['status'] === 201 && $res['Result'] === 'Updated Info') {

            if ($numOfProducts === 1) {
                return redirect('/orders')->with('message', 'Order Number ' . $orderNumber . ' deleted!!');
            }

            $products = FoxproApi::call([
                'action' => 'GetSoStatus',
                'params' => [$orderNumber],
                'keep_session' => false,
            ]);

            return response(['status' => 201, 'products' => $products['rows']])->header('Content-Type', 'application/json');
        }

        Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: DeleteLine ====VVVVV");
        Log::error($res);
        return response(['status' => 500])->header('Content-Type', 'application/json');
    }

    // Update product model.
    public function updateProductModel(Request $request)
    {
        $info = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

        // "Result": "Updated Info" |
        $res = FoxproApi::call([
            'action' => 'ChangeOrderModel',
            'params' => [$orderNumber, $info['sku'], $info['lineNum'], $info['model']],
            'keep_session' => false,
        ]);

        if ($res['status'] === 201 && $res['Result'] === 'Updated Model Info') {
            return response(['status' => 201])->header('Content-Type', 'application/json');
        }

        Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: ChangeOrderModel ====VVVVV");
        Log::error($res);
        return response(['status' => 500])->header('Content-Type', 'application/json');
    }

    // Show single order delivery form.
    public function orderDelivery(Request $request)
    {
        // throw 404 if order number does not exist
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

        // Error: undefined rows?
        $products = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        $deliveryInfo = FoxproApi::call([
            'action' => 'GetDeliveryInfo',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        return Inertia::render('Orders/OrderDelivery', ['rawOrder' => $order, 'rawProducts' => $products['rows'], 'deliveryInfoByProd' => $deliveryInfo['rows']]);
    }

    // Save delivery info into foxpro.
    public function saveDeliveryInfo(Request $request)
    {
        $deliveryInfo = $request->all();

        if ($deliveryInfo['deliveryType'] !== 'PICK UP') {
            $request->validate([
                'date' => 'required',
                'address' => 'required',
                'cellphoneNumber' => 'required',
                'city' => 'required',
                'contactName' => 'required',
                'customerEmail' => ['required', 'email'],
                'customerName' => 'required',
                'deliveryType' => 'required',
                'state' => 'required',
                'telephoneNumber' => 'required',
                'wholesalerEmail' => 'required',
                'zipCode' => 'required'
            ]);
        }else {
            foreach($deliveryInfo as $key => $value){
                if (!$value) $deliveryInfo[$key] = '';
            }
        }

        $orderNumber = getOrderNumberFromPath($request->path());
        $res = FoxproApi::call([
            'action' => 'SaveDeliveryInfo',
            'params' => [
                $orderNumber,
                $deliveryInfo['date'],
                $deliveryInfo['customerName'],
                $deliveryInfo['contactName'],
                $deliveryInfo['telephoneNumber'],
                $deliveryInfo['cellphoneNumber'],
                $deliveryInfo['wholesalerEmail'],
                $deliveryInfo['customerEmail'],
                $deliveryInfo['address'],
                $deliveryInfo['city'],
                $deliveryInfo['state'],
                $deliveryInfo['zipCode'],
                $deliveryInfo['deliveryType'],
                $deliveryInfo['deliveryInstruction'],
                'ALL',
                '0'
            ],
            'keep_session' => false,
        ]);

        if ($res['Result'] === 'Info Updated Successfully') {
            return response(['foxproRes' => $res, 'message' => 'delivery information saved!!', 'information' => $deliveryInfo])->header('Content-Type', 'application/json');
        }

        logFoxproError(
            'SaveDeliveryInfo',
            'OrdersController->saveDeliveryInfo',
            [
                $orderNumber,
                $deliveryInfo['date'],
                $deliveryInfo['customerName'],
                $deliveryInfo['contactName'],
                $deliveryInfo['telephoneNumber'],
                $deliveryInfo['cellphoneNumber'],
                $deliveryInfo['wholesalerEmail'],
                $deliveryInfo['customerEmail'],
                $deliveryInfo['address'],
                $deliveryInfo['city'],
                $deliveryInfo['state'],
                $deliveryInfo['zipCode'],
                $deliveryInfo['deliveryType'],
                $deliveryInfo['deliveryInstruction'],
                'ALL',
                '0'
            ],
            $res
        );

        return response(['foxproRes' => $res, 'message' => 'internal issue', 'information' => $deliveryInfo])->header('Content-Type', 'application/json');
    }

    // Show payment form.
    public function orderPayment(Request $request)
    {
        // throw 404 if order number does not exist
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());
        $userEmail = auth()->user()->attributesToArray()['email'];

        $deliveryInfo = FoxproApi::call([
            'action' => 'GetDeliveryInfo',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        // WARNING: sometimes will trow undefined key exception for 'rows'.
        $depositInfo = FoxproApi::call([
            'action' => 'getpercentdeposit',
            'params' => [$userEmail, $orderNumber],
            'keep_session' => false,
        ]);

        if ($deliveryInfo['status'] === 500 || $deliveryInfo['status'] !== 201 || !array_key_exists('rows', $deliveryInfo)) {
            logFoxproError('GetDeliveryInfo', 'orderPayment', [$orderNumber], $deliveryInfo);
            return redirect('/orders')->with(['message' => 'Something went wrong. please contact support']);
        }

        if ($depositInfo['status'] === 500 || $depositInfo['status'] !== 201 || !array_key_exists('rows', $depositInfo)) {
            logFoxproError('getpercentdeposit', 'orderPayment', [$userEmail, $orderNumber], $depositInfo);
            return redirect('/orders')->with(['message' => 'Something went wrong. please contact support']);
        }

        return Inertia::render('Orders/OrderPayment', [
            'order' => $order,
            'deliveryInfo' => $deliveryInfo['rows'],
            'depositInfo' => $depositInfo['rows'][0],
        ]);
    }

    // Creates a transaction.
    public function createCharge(Request $request)
    {
        $info = $request->all();
        $js_data = json_encode($info['info']);
        $uuidTransaction = (string) Str::uuid();
        $orderNumber = getOrderNumberFromPath($request->path());

        $accessToken = OAuthTokenService::getAccessToken();
        if (!$accessToken) {
            logErrorDetails('createCharge','OrdersController','empty access token','none', $request->user()->email);
            return response(['intuitRes' => 'empty access token. refresh failed.', 'status' => 501])->header('Content-Type', 'application/json');
        }

        $intuitApiUrl = App::environment('production') ? env('INTUIT_API_URL') : env('INTUIT_SANDBOX_API_URL');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
            'Content-Type' => 'application/json',
            'Request-Id' => $uuidTransaction,
        ])->withBody($js_data)->post($intuitApiUrl .'/quickbooks/v4/payments/charges');

        if ($response->successful()) {
            $foxproInfo = $info['foxproInfo'];

            // "Result" : "Info Updated Successfully" |
            $cashReceiptRes = FoxproApi::call([
                'action' => 'SaveCR',
                'params' => [
                    $orderNumber,
                    'CC',
                    $foxproInfo['amountPaid'],
                    $foxproInfo['date'],
                    $foxproInfo['nameOnCard'],
                    $foxproInfo['cc'],
                    $foxproInfo['expDate'],
                    $foxproInfo['cvc']
                ],
                'keep_session' => false,
            ]);

            if (!array_key_exists('Result', $cashReceiptRes) || $cashReceiptRes["Result"] !== 'Info Updated Successfully') {
                logFoxproError('SaveCR', 'OrdersController->createCharge', ['message' => 'params not logged for secury reasons', 'user' => $request->user()->email], $cashReceiptRes);
            }

            // $clientTransID = $response->collect()->all()['context']['clientTransID'];
            // $uuidTransaction2 = (string) Str::uuid();
            // $intuirReceipt = Http::withHeaders([
            //     'Authorization' => 'Bearer ' . $accessToken,
            //     'Accept' => 'application/pdf',
            //     'Content-Type' => 'application/json',
            //     'Request-Id' => $uuidTransaction2,
            // ])->get($intuitApiUrl .'/quickbooks/v4/payments/receipt/test123abc?clientTransID=test123abc');

            return response(['intuitRes' => $response->json(), 'status' => $response->status(), 'cashRes' => $cashReceiptRes])->header('Content-Type', 'application/json');
            // return response(['intuitRes' => $response->json(), 'status' => $response->status(), 'cashRes' => 'testing'])->header('Content-Type', 'application/json');

        } else {
            // 401 -> access token expired!!
            if ($response->status() === 401) {
                logErrorDetails('createCharge','OrdersController','intuit access token expired',$response->body(), $request->user()->email);
                return response(['intuitRes' => "the access token provided to charge endpoint is expired!! status: 401" , 'status' => $response->status()])->header('Content-Type', 'application/json');
            }

            logErrorDetails('createCharge','OrdersController','intuit charge request not successful',$response->body(), $request->user()->email);
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');
        }
    }

    // create bank transaction.
    public function createBankCharge(Request $request)
    {
        $info = $request->all();
        $intuitInfo = json_encode($info['intuitInfo']);
        $uuidTransaction = (string) Str::uuid();
        $orderNumber = getOrderNumberFromPath($request->path());

        $accessToken = OAuthTokenService::getAccessToken();
        if (!$accessToken) {
            logErrorDetails('createBankCharge','OrdersController','empty access token','none', $request->user()->email);
            return response(['intuitRes' => 'empty access token. refresh failed.', 'status' => 501])->header('Content-Type', 'application/json');
        }

        $intuitApiUrl = App::environment('production') ? env('INTUIT_API_URL') : env('INTUIT_SANDBOX_API_URL');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
            'Content-Type' => 'application/json',
            'Request-Id' => $uuidTransaction,
        ])->withBody($intuitInfo)->post($intuitApiUrl .'/quickbooks/v4/payments/echecks');

        if ($response->successful()) {
            $foxproInfo = $info['foxproInfo'];
            $cashReceiptRes = FoxproApi::call([
                'action' => 'SaveCR',
                'params' => [$orderNumber, 'CH', $foxproInfo['amountPaid'], $foxproInfo['date'], $foxproInfo['name'], $foxproInfo['checkNumber'], $foxproInfo['routingNumber'], $foxproInfo['accountNumber']],
                'keep_session' => false,
            ]);

            if (!array_key_exists('Result', $cashReceiptRes) || $cashReceiptRes["Result"] !== 'Info Updated Successfully') {
                logFoxproError('SaveCR', 'OrdersController->createBankCharge', ['message' => 'params not logged for secury reasons', 'user' => $request->user()->email], $cashReceiptRes);
            }

            return response(['intuitRes' => $response->json(), 'status' => $response->status(), 'cashRes' => $cashReceiptRes])->header('Content-Type', 'application/json');
        }else {
            if ($response->status() === 401) {
                logErrorDetails('createBankCharge','OrdersController','intuit access token expired',$response->body(), $request->user()->email);
                return response(['intuitRes' => "the access token provided to charge endpoint is expired!! status: 401" , 'status' => $response->status()])->header('Content-Type', 'application/json');
            }

            logErrorDetails('createBankCharge','OrdersController','intuit echeck request not successful',$response->body(), $request->user()->email);
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');
        }
    }

    // get status of a eCheck.
    public function getStatusCheck(Request $request)
    {
        $info = $request->all();
        $uuidTransaction = (string) Str::uuid();
        $accessToken = OAuthTokenService::getAccessToken();

        if (!$accessToken) {
            logErrorDetails('getStatusCheck','OrdersController','empty access token','none', $request->user()->email);
            return response(['intuitRes' => 'empty access token. refresh failed.', 'status' => 501])->header('Content-Type', 'application/json');
        }

        $intuitApiUrl = App::environment('production') ? env('INTUIT_API_URL') : env('INTUIT_SANDBOX_API_URL');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
            'Request-Id' => $uuidTransaction,
        ])->get($intuitApiUrl . '/quickbooks/v4/payments/echecks/' . $info['id']);


        if ($response->successful()) {
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');
        } else {
            if ($response->status() === 401) {
                logErrorDetails('getStatusCheck','OrdersController','intuit access token expired',$response->body(), $request->user()->email);
                return response(['intuitRes' => "the access token provided to charge endpoint is expired!! status: 401" , 'status' => $response->status()])->header('Content-Type', 'application/json');
            }

            logErrorDetails('getStatusCheck','OrdersController','intuit echeck status request not successful',$response->body(), $request->user()->email);
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');
        }
    }

    // Create an order number for new order.
    public function createOrderNumber(Request $request)
    {
        $username = auth()->user()->username;
        $userRole = auth()->user()->role;
        $products = $request->all();
        if (!array_key_exists('isShoppingCart', $products)) $products['isShoppingCart'] = 'false';

        $orders = FoxproApi::call([
            'action' => 'getordersbycompany',
            'params' => [$username],
            'keep_session' => false,
        ]);

        //this means there are no orders for this customer.
        if ($orders['status'] === 500 || $orders['status'] !== 201 || !array_key_exists('rows', $orders)) {
            logFoxproError(
                'getordersbycompany',
                'OrdersController->createOrderNumber',
                [$username],
                $orders
            );

            // assigns an empty array so template can display proper message.
            $orders['rows'] = [];
        }

        // get how many orders the client has.
        $numOfOrders = count($orders['rows']);

        // Get list of sales rep if owner acc created the order.
        $salesPersonsList = [];
        $companyCode = '';
        $userInfoRes = [];
        $salesPersonsRes = [];

        if ($userRole === 1919 || $userRole === 3478) {
            $userInfoRes = FoxproApi::call([
                'action' => 'GETUSERINFO',
                'params' => [$username],
                'keep_session' => false,
            ]);

            if ($userInfoRes['status'] === 201 || (array_key_exists('rows', $userInfoRes) && count($userInfoRes['rows']) > 0)) {
                $companyCode = $userInfoRes['rows'][0]['wholesaler'];

                // "Result": "no such salesman found",
                $salesPersonsRes = FoxproApi::call([
                    'action' => 'GETSLMNINFO',
                    'params' => ['',$companyCode],
                    'keep_session' => false,
                ]);

                if (array_key_exists('rows', $salesPersonsRes) && count($salesPersonsRes['rows']) > 0) {
                    $salesPersonsList = $salesPersonsRes['rows'];
                }
            }
        }

        // if there are orders.
        if ($numOfOrders > 0) {
            // get the last order number.
            $lastOrderNum = $orders['rows'][$numOfOrders - 1]['ordernum'];

            // get 3 first letters.
            $charsFromOrderNum = substr($lastOrderNum, 0, 3);

            // get only int from order number and increment it by one.
            $NumsFromOrderNum = substr($lastOrderNum, 3);
            $nextOrderNumber = (int)$NumsFromOrderNum + 1;

            $newOrderNumber = $charsFromOrderNum . $nextOrderNumber;

            return Inertia::render(
                'Orders/OrderNumber',
                [
                    'nextOrderNumber' => $newOrderNumber,
                    'products' => $products,
                    'orders' => $orders['rows'],
                    'message' => '',
                    'salesRepsList' => $salesPersonsList
                ]
            );
        } else {
            if (!$companyCode) {
                logFoxproError(
                    'GETSLMNINFO or GETUSERINFO',
                    'OrdersController->createOrderNumber',
                    ['message' => 'params not logged for secury reasons', 'user' => $request->user()->email],
                    ['userInfoRes' => $userInfoRes, 'salesPersonsRes' => $salesPersonsRes]
                );

                return Inertia::render(
                    'Orders/OrderNumber',
                    [
                        'nextOrderNumber' => 'none',
                        'products' => 'none',
                        'orders' => 'none',
                        'message' => 'error',
                        'salesRepsList' => $salesPersonsList
                    ]
                );
            }

            return Inertia::render('Orders/OrderNumber', ['nextOrderNumber' => $companyCode . '000001', 'products' => $products, 'orders' => $orders['rows'], 'message' => '']);
        }
    }

    // Create new order.
    public function createOrder(Request $request)
    {
        /**
         * The "OrderEnter" only can handle max 200 characters for the SKU param,
         * if the skus string is larger than that, we will have to make a call to
         * "addtoorder" to provide the rest of the skus.
         */
        $username = auth()->user()->username;
        $data = $request->all();

        if ($data["salesRepUsername"]) {
            $username = $data["salesRepUsername"];
        }

        if (strlen($data['skus']) <= 200) {
            // Result: "This sales order already exists" | "All items entered"
            $response = FoxproApi::call([
                'action' => 'OrderEnter',
                'params' => [$username, $data['newOrderNum'], $data['skus']],
                'keep_session' => false,
            ]);

            if ($response['status'] === 201 && $response['Result'] === 'All items entered') {
                DB::table('shopping_cart')
                    ->updateOrInsert(
                        ['user_id' => $request->user()->id],
                        ['products' => '[]']
                    );

                return redirect('/orders')->with('message', 'Order Number ' . $data['newOrderNum'] . ' created!!');
            }

            if ($response['status'] === 500 || $response['Result'] !== 'Updated Info') {
                Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: OrderEnter ====VVVVV");
                Log::error('order number: ' . $data['newOrderNum']);
                Log::error('skus: ' . $data['skus']);
                Log::error($response);
            }

            return redirect('/orders')->with('message', "something went wrong. Please contact support.");
        } else {
            // get the number of calls we will have to make to the "addtoorder", depending on the size of the sku string;
            $numberOfCalls = floor(strlen($data['skus']) / 200);
            $skusArr = explode('~', $data['skus']);

            $numOfSkusPerArray = count($skusArr) / ($numberOfCalls + 1);
            $splittedArray = array_chunk($skusArr, ceil($numOfSkusPerArray));

            for ($i = 0; $i < count($splittedArray); $i++) {
                $skus = implode('~', $splittedArray[$i]);

                // first skus array send to newOrderNum to create the order.
                if ($i === 0) {
                    $response = FoxproApi::call([
                        'action' => 'OrderEnter',
                        'params' => [$username, $data['newOrderNum'], $skus],
                        'keep_session' => false,
                    ]);

                    if ($response['status'] === 500 || $response['Result'] !== 'All items entered') {
                        Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: OrderEnter ====VVVVV");
                        Log::error('order number: ' . $data['newOrderNum']);
                        Log::error('number of addtoorder calls: ' . $numberOfCalls);
                        Log::error('skus array:');
                        Log::error($splittedArray);
                        Log::error('skus sent to this call: ' . $skus);
                        Log::error($response);

                        return redirect('/orders')->with('message', "something went wrong. Please contact support.");
                    }

                    continue;
                }

                $response = FoxproApi::call([
                    'action' => 'addtoorder',
                    'params' => [$username, $data['newOrderNum'], $skus],
                    'keep_session' => false,
                ]);

                if ($response['status'] === 500 || $response['Result'] !== 'All items entered') {
                    Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: addtoorder ====VVVVV");
                    Log::error('order number: ' . $data['newOrderNum']);
                    Log::error('number of addtoorder call: ' . $i);
                    Log::error('skus array:');
                    Log::error($splittedArray);
                    Log::error('skus sent to this call: ' . $skus);
                    Log::error($response);

                    return redirect('/orders')->with('message', "something went wrong. Please contact support.");
                }
            }

            DB::table('shopping_cart')
                ->updateOrInsert(
                    ['user_id' => $request->user()->id],
                    ['products' => '[]']
                );

            return redirect('/orders')->with('message', 'Order Number ' . $data['newOrderNum'] . ' created!!');
        }
    }

    // only use when user does not require a deposit.
    public function approveOrder(Request $request)
    {
        $info = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());
        $user = $request->user()->first_name;

        // 'Result' => 'you did not specify the amount' | 'Info Updated Successfully'
        $cashReceiptRes = FoxproApi::call([
            'action' => 'SaveCR',
            'params' => [$orderNumber, 'CC', $info['amountPaid'], $info['date'], $user, '0000000000000', '00/00', '000'],
            'keep_session' => false,
        ]);

        if (array_key_exists('Result', $cashReceiptRes) && $cashReceiptRes['Result'] === "Info Updated Successfully") {
            return response(['cashRes' => 'order approved', 'status' => 201])->header('Content-Type', 'application/json');
        }

        logFoxproError('foxprop:SaveCR controllerFunc:approveOrder','OrderController',[$orderNumber, 'CC', $info['amountPaid'], $info['date'], $user, '0000000000000', '00/00', '000'],$cashReceiptRes);
        return response(['cashRes' => 'could not approve order.', 'status' => 500])->header('Content-Type', 'application/json');
    }

    public function generatePdf(Request $request, string $orderNumber)
    {
        $orderInfo = $this->getOrderInfoPdf($orderNumber);
        $pdfData = view('pdf.order', compact('orderInfo'))->render();
        $pdf = Pdf::loadHTML($pdfData);
//        $pdf = Pdf::setOptions(['isPhpEnabled' => true])->loadHTML($pdfData);
        return $pdf->download('sample-document.pdf');
    }

    public function testApi(TestingService $testingService)
    {
        if (Gate::allows('admin-only')) {
            // return Inertia::render('Test',['response' => $response]);
            // return response(['response' => $response])->header('Content-Type', 'application/json');

            // is returning the pdf order? PENDING
            $printSo = FoxproApi::call([
                 'action' => 'PrintSo',
                 'params' => ['KJT004952'], //KJT002686 (outstading),  KJT002928 (-75), KJT003667 (-50), KJT003047 (-50), KJT003756 (0)
                 'keep_session' => false,
            ]);

            $adminUsername = auth()->user()->username;
            $getCompanyInforesponse = FoxproApi::call([
                'action' => 'GETUSERINFO',
                'params' => [env('TEST_USERNAME')],
                'keep_session' => false,
            ]);

            // is it returning the proper figures for each sales rep? TESTING
            $commissionInfo = FoxproApi::call([
                'action' => 'GETCOMMINFO',
                'params' => [env('TEST_USERNAME')],
                'keep_session' => false,
            ]);

            // is it returning all the orders of the company? YES!!
            $foxproRes = FoxproApi::call([
                'action' => 'getordersbycompany',
                'params' => [env('TEST_USERNAME')],
                'keep_session' => false,
            ]);

            // is it returning ONLY USER created orders? YES!!
            $orders = FoxproApi::call([
                'action' => 'getordersbyuser',
                'params' => [env('TEST_USERNAME')],
                'keep_session' => false,
            ]);

            // is it retuning all the sales rep for that company? TESTING
            // is it returning the username along with other information for each sales rep? YES!!
            // 'params' => ['TWO-LETTER SALESMAN CODE','THREE-LETTER COMPANY CODE'],
            $companyCode = $getCompanyInforesponse['rows'][0]['wholesaler'];
            $salesrepInfo = FoxproApi::call([
                'action' => 'GETSLMNINFO',
                'params' => ['',$companyCode],
                'keep_session' => false,
            ]);

            $deliveryInfo = FoxproApi::call([
                'action' => 'GetDeliveryInfo',
                'params' => ['KJT004952'],
                'keep_session' => false,
            ]);

            return response(
                [
                    'response' => $testingService->getUniqueInstanceId(),
                    'userInfo' => $getCompanyInforesponse,
                    'userCommisionInfo' => $commissionInfo,
                    'ordersByUser' => $orders,
                    'ordersByCompany' => $foxproRes,
                    'companySalesReps' => $salesrepInfo,
                    'printSo' => $printSo,
                    'deliveryInfo' => $deliveryInfo,
                ]
            )->header('Content-Type', 'application/json');
        }
        abort(403);
    }
    public function testApiTwo(TestingService $testingService)
    {
        if (Gate::allows('admin-only')) {
            // return Inertia::render('Test',['response' => $response]);
            // return response(['response' => $response])->header('Content-Type', 'application/json');

            $orders = FoxproApi::call([
                'action' => 'getordersbyuser',
                'params' => [env('TEST_USERNAME')],
                'keep_session' => false,
            ]);

            $companyOrders = FoxproApi::call([
                'action' => 'getordersbycompany',
                'params' => [env('TEST_USERNAME')],
                'keep_session' => false,
            ]);

            $GetSoStatus = FoxproApi::call([
                'action' => 'GetSoStatus',
                'params' => ['KJT004952'],
                'keep_session' => false,
            ]);

            return response(
                [
                    'ordersByUser' => $orders,
                    'ordersByCompany' => $companyOrders,
                    'GetSoStatus' => $GetSoStatus,
                ]
            )->header('Content-Type', 'application/json');
        }
        abort(403);
    }


    //=========HELPER FUNCTIONS=============//
    public function isPaymentSubmitted($orderNumber)
    {
        // "Result": "There are no payments for this sales order number" |
        $paymentInfo = FoxproApi::call([
            'action' => 'GetCR',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        // "rows" key will containes an associative array with each payment submmited for a given order.
        return array_key_exists('rows', $paymentInfo) && count($paymentInfo['rows']) !== 0;
    }

    public function isDeliveryInfoSave($orderNumber)
    {
        $deliveryInfo = FoxproApi::call([
            'action' => 'GetDeliveryInfo',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);
        return array_key_exists('rows', $deliveryInfo) && $deliveryInfo['rows'][0]['deldate'];
    }

    public function getOrderInfoPdf(string $orderNumber)
    {
        $formattedOrderInfo = [
            'date' => '',
            'orderNumber' => $orderNumber,
            'billTo' => '',
            'address' => '',
            'cityStateZip' => '',
            'products' => [],
            'grandTotal' => '',
            'balanceDetails' => [
                'shipped' => '',
                'inWarehouse' => '',
                'inTransit' => '',
                'open' => '',
                'balance' => '',
            ],
            'orderStockStatusByProduct' => [],
            'paymentDetails' => []
        ];

        // "Result": "this sales order number is not in system"
        $printSo = FoxproApi::call([
            'action' => 'PrintSo',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        if ($printSo['status'] !== 201 || !array_key_exists('rows', $printSo) || count($printSo['rows']) === 0) {
            logFoxproError('foxpro:PrintSo controllerFunc:getOrderInfoPdf','OrderController',[$orderNumber],$printSo);
            return  $formattedOrderInfo;
        }

        /*
         * I have a field RPMODE which tells you what info is on that line.

        When RPMODE is '0':
        Take the header from the HLINE field
        Take the Bill info  from the BILL field
        Take the Ship info  from the SHIP field

        When RPMODE IS '1'
        Take Line by Line info from the TYPE   QTY PRICE    TOTAL fields

        When RPMODE IS '2'
        Take the total credits info from the TYPE  AMT   TOTAL  fields

        When RPMODE IS '3'
        Take the net total  info from the TYPE  AMT   TOTAL  fields

        When RPMODE IS '4'
        Take the header info from the HLINE field 2 times
        Take the payment info from the PDATE    BANK     CKNUM  AMT   TOTAL   fields


        When RPMODE is '5'
        Take the header from the HLINE field
        Take the Shipped balance from the SHCHG field
        Take the in Warehouse balance from the  FPRICE field
        Take the In Transit balance from the FCOST field
        Take the Open Balance from the TOTAL field
        Take the Total Balance from the AMT field

        When RPMODE is '6'
        Take the header from the HLINE field
        Take the stock status info from the LN    PARTNUM   TYPE    CDETAIL fields
         * */

        foreach ($printSo['rows'] as $index => $row) {
            switch ($row['rpmode']) {
                case '0':
                    if ($row['hline']) {
                        $dateAndOrderNumber = explode(' ', $row['hline']);
                        $formattedOrderInfo['date'] = $dateAndOrderNumber[0];
                    }

                    // order is important, rpmode 0 MUST BE FIRST, index 0 will be the header, 1,2, and 3 following info.
                    if ($row['bill'] && $index === 1) {
                        $formattedOrderInfo['billTo'] = ltrim($row['bill']);
                    }
                    if ($row['bill'] && $index === 2) {
                        $formattedOrderInfo['address'] = $row['bill'];
                    }
                    if ($row['bill'] && $index === 3) {
                        $formattedOrderInfo['cityStateZip'] = $row['bill'];
                    }
                    break;

                case '1':
                    $formattedOrderInfo['products'][] = [
                        'product' => $row['type'],
                        'group' => $row['sgroup'],
                        'model' => $row['model'],
                        'sku' => $row['partnum'],
                        'finish' => $row['colr'],
                        'quantity' => $row['qty'],
                        'status' => $row['cdetail'],
                        'price' => $row['price'],
                        'total' => $row['total'],
                    ];
                    break;

                case '4':
                    if ($row['pdate']) {
                        $formattedOrderInfo['paymentDetails'][] = [
                            'date' => $row['pdate'],
                            'method' => $row['cknum'],
                            'amount' => $row['amt'],
                        ];
                    }
                    break;

                case '5':
                    if ($row['rpfirst'] === 'Y') {
                        $formattedOrderInfo['balanceDetails']['shipped'] = $row['shchg'];
                        $formattedOrderInfo['balanceDetails']['inWarehouse'] = $row['fprice'];
                        $formattedOrderInfo['balanceDetails']['inTransit'] = $row['fcost'];
                        $formattedOrderInfo['balanceDetails']['open'] = $row['total'];
                        $formattedOrderInfo['balanceDetails']['balance'] = $row['amt'];
                    }
                    break;

                case '6':
                    if ($row['partnum']) {
                        $formattedOrderInfo['orderStockStatusByProduct'][] = [
                            'sku' => $row['partnum'],
                            'product' => $row['type'],
                            'status' => $row['cdetail'],
                        ];
                    }
                    break;

                default:
                    break;
            }

        }

        $formattedOrderInfo['grandTotal'] = array_reduce($formattedOrderInfo['products'], function ($sum, $product) {
            return $sum + (isset($product['total']) ? floatval($product['total']) : 0);
        }, 0);

        // Sorting products by group, then by model.
        usort($formattedOrderInfo['products'], function ($a, $b) {
            // Compare by group first
            $groupComparison = strcmp($a['group'], $b['group']);
            // If groups are equal, compare by model
            if ($groupComparison === 0) {
                return strcmp($a['model'], $b['model']);
            }
            return $groupComparison;
        });

        return $formattedOrderInfo;
    }
}
