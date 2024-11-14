<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Services\OAuthTokenService;
use Illuminate\Support\Facades\App;

use App\Services\TestingService;

class OrdersController extends Controller
{
    // Show all orders.    
    public function all(Request $request)
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

        // assings an empty array so template can display proper message.
        if ($orders['status'] === 500) $orders['rows'] = [];

        if (array_key_exists('Result', $commissionInfo) && $commissionInfo['Result'] === 'there are no sales orders for this wholesaler') {
            $commissionInfo['rows'] = [];
        }

        return Inertia::render('Orders/Orders', ['orders' => $orders['rows'], 'message' => $message, 'commissionInfo' => $commissionInfo['rows']]);
    }

    // Show single order overview.
    public function orderOverview(Request $request)
    {
        // throw 404 if order number does not exist

        $username = auth()->user()->username;
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

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
        $formFields = $request->validate([
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

        $orderNumber = getOrderNumberFromPath($request->path());
        $deliveryInfo = $request->all();

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

        if ($deliveryInfo['status'] === 201 && $depositInfo['status'] === 201) {
            return Inertia::render('Orders/OrderPayment', [
                'order' => $order,
                'deliveryInfo' => $deliveryInfo['rows'],
                'depositInfo' => $depositInfo['rows'][0],
            ]);
        }

        if ($deliveryInfo['status'] === 500) {
            logFoxproError('GetDeliveryInfo', 'orderPayment', [$orderNumber], $deliveryInfo);
        }

        if ($depositInfo['status'] === 500) {
            logFoxproError('getpercentdeposit', 'orderPayment', [$userEmail, $orderNumber], $depositInfo);
        }


        return redirect('/orders')->with(['message' => 'Something went wrong. please contact support']);
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
            info("foxproInfo:");
            info($foxproInfo);            

            // "Result" : "Info Updated Successfully" |
            $cashReceiptRes = FoxproApi::call([
                'action' => 'SaveCR',                
                'params' => [$orderNumber, 'CC', $foxproInfo['amountPaid'], $foxproInfo['date'], $foxproInfo['nameOnCard'], $foxproInfo['cc'], $foxproInfo['expDate'], $foxproInfo['cvc']],
                'keep_session' => false,
            ]);

            info("foxpro cash receipt res:");
            info($cashReceiptRes);            
            
            return response(['intuitRes' => $response->json(), 'status' => $response->status(), 'cashRes' => $cashReceiptRes])->header('Content-Type', 'application/json');

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

    // Create a order number for new order.
    public function createOrderNumber(Request $request)
    {
        $username = auth()->user()->username;
        $products = $request->all();
        if (!array_key_exists('isShoppingCart', $products)) $products['isShoppingCart'] = 'false';

        // Get all orders
        $orders = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);

        if ($orders['status'] === 500) {
            // TODO: log error.
            // assings an empty array so template can display proper message.
            $orders['rows'] = [];
        }

        // get how many orders the client has.
        $numOfOrders = count($orders['rows']);

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

            return Inertia::render('Orders/OrderNumber', ['nextOrderNumber' => $newOrderNumber, 'products' => $products, 'orders' => $orders['rows'], 'message' => '']);
        } else {

            // Gets user info.
            $response = FoxproApi::call([
                'action' => 'GETUSERINFO',
                'params' => [$username],
                'keep_session' => false,
            ]);

            if ($response['status'] === 500 || (array_key_exists('Result', $response) && $response['Result'] === 'no such user name found')) {
                Log::error("=VVVVV===ERROR REQUESTING DATA FROM FOXPRO. function: GETUSERINFO ====VVVVV");
                Log::error($response);
                return Inertia::render('Orders/OrderNumber', ['nextOrderNumber' => 'none', 'products' => 'none', 'orders' => 'none', 'message' => 'error']);
            }

            $companyCode = $response['rows'][0]['wholesaler'];
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

    public function testApi(TestingService $testingService)
    {                            
        // return Inertia::render('Test',['response' => $response]);
        // return response(['response' => $response])->header('Content-Type', 'application/json');

        return response(['response' => $testingService->getUniqueInstanceId()])->header('Content-Type', 'application/json');
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

        return !array_key_exists('rows', $paymentInfo);        
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

    public function getAccessToken()
    {
        $clientId = env('INTUIT_CLIENT_ID');
        $clientSecret = env('INTUIT_CLIENT_SECRECT');
        $refreshToken = env('INTUIT_REFRESH_TOKEN');

        $auth = 'Basic ' . base64_encode($clientId . ':' . $clientSecret);
        $data = http_build_query(['grant_type' => 'refresh_token', 'refresh_token' => $refreshToken]);

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => $auth,
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])->withBody($data, 'application/x-www-form-urlencoded')->post(env('INTUIT_TOKEN_URL'));

        info('--vvvvv-- response from access token request --vvvvv--');
        info($auth);
        info($data);
        info($response->status());
        info($response->collect());

        if ($response->status() === 200) {
            // get access token and refresh token from response.
            $collection = $response->collect();
            $tokens = $collection->all();
            info($tokens['access_token']);
            info($tokens['expires_in']);
            info($tokens['refresh_token']);
            info($tokens['x_refresh_token_expires_in']);
            info($tokens['token_type']);
            // set new tokens.
        }
    }
}
