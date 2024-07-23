<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class OrdersController extends Controller
{
    // Show all orders.    
    public function all(Request $request){
        $username = auth()->user()->username;
        $message = $request->session()->get('message');        
        $orders = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);

        $commissionInfo = FoxproApi::call([
            'action' => 'GETCOMMINFO',
            'params' => ['jmo%40Kitchencabsdirect.com'],
            'keep_session' => false,
        ]);
        
        if($orders['status'] === 500){
            // assings an empty array so template can display proper message.
            $orders['rows'] = []; 
        }

        return Inertia::render('Orders/Orders',['orders' => $orders['rows'], 'message' => $message, 'commissionInfo' => $commissionInfo['rows']]);
    }

    // Show single order overview.
    public function orderOverview(Request $request){
        // throw 404 if order number does not exist

        $username = auth()->user()->username;
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

        $response = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        if($response['status'] === 201){            
            return Inertia::render('Orders/OrderOverview',
                [
                    'order' => $order, 
                    'products' => $response['rows'], 
                    'isPaymentSubmitted' => $this->isPaymentSubmitted($orderNumber), 
                    'isDeliveryInfoSave' => $this->isDeliveryInfoSave($orderNumber),
                ]
            );
        }
        
        logFoxproError('GetSoStatus','orderOverview', [$orderNumber], $response);
        return back()->with(['message' => 'Something went wrong. please contact support']);
        
    }

    // Get orders products.
    public function getProducts(Request $request){
        $orderNumber = getOrderNumberFromPath($request->path());
        $response = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        if($response['status'] === 201){
            return response(['products' => $response['rows'], 'status' => 201])->header('Content-Type', 'application/json');
        }

        logFoxproError('GetSoStatus','getProducts', [$orderNumber], $response);
        return response(['products' => "something went wrong, please contact support", 'status' => 500])->header('Content-Type', 'application/json');
    }

    // Show single order details. TODO: ADD ERROR LOGGING
    public function orderDetails(Request $request){
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
        
        return Inertia::render('Orders/OrderDetails',['rawOrder' => $order, 'rawProducts' => $products['rows'], 'isPaymentSubmitted' => $this->isPaymentSubmitted($orderNumber)]);
    }

    // Update quantity product. TODO: ADD ERROR LOGGING
    public function updateQuantity(Request $request){
        $product = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

        //"Result": "Can not update -- this Sales Order is in use" | 
        $res = FoxproApi::call([
            'action' => 'ChangeOrderQty',
            'params' => [$orderNumber,$product['uscode'],$product['linenum'],$product['qty']],
            'keep_session' => false, 
        ]);

        if($res['status'] === 500 || $res['Result'] !== 'Updated Info'){
            Log::error("=VVVVV===ERROR REQUESTING DATA FROM FOXPRO====VVVVV");
            Log::error($res);
        }

        return response($res)->header('Content-Type', 'application/json');
    }

    // Update product note. TODO: ADD ERROR LOGGING
    public function updateProductNote(Request $request){
        $info = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());        

        // "Result": "Updated Info" |
        $res = FoxproApi::call([
            'action' => 'ChangeOrderNote',
            'params' => [$orderNumber,$info['sku'],$info['lineNum'],$info['note']],
            'keep_session' => false,
        ]);

        if($res['status'] === 500 || $res['Result'] !== 'Updated Info'){
            Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: ChangeOrderNote ====VVVVV");
            Log::error($res);
        }

        return response($res)->header('Content-Type', 'application/json');
    } 

    // Delete product.
    public function deleteProduct(Request $request){
        $req = $request->all();        
        $product = $req['product'];
        $numOfProducts = $req['numOfProduct'];        
        $orderNumber = getOrderNumberFromPath($request->path());
        
        $res = FoxproApi::call([
            'action' => 'DELETELINE',
            'params' => [$orderNumber, $product['uscode'], $product['linenum'], $product['qty']],
            'keep_session' => false, 
        ]);

        if($res['status'] === 201 && $res['Result'] === 'Updated Info'){

            if($numOfProducts === 1 ){
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
    public function updateProductModel(Request $request){
        $info = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());        

        // "Result": "Updated Info" |
        $res = FoxproApi::call([
            'action' => 'ChangeOrderModel',
            'params' => [$orderNumber, $info['sku'], $info['lineNum'], $info['model']],
            'keep_session' => false,
        ]);

        if($res['status'] === 201 && $res['Result'] === 'Updated Model Info'){            
            return response(['status' => 201])->header('Content-Type', 'application/json');
        }

        Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: ChangeOrderModel ====VVVVV");
        Log::error($res);
        return response(['status' => 500])->header('Content-Type', 'application/json');
    }

    // Show single order delivery form. 
    public function orderDelivery(Request $request){
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
    public function saveDeliveryInfo(Request $request){
        $formFields = $request->validate([
            'date' => 'required',
            'address' => 'required',
            'cellphoneNumber' => 'required',
            'city' => 'required',
            'contactName' => 'required',
            'customerEmail' => ['required','email'],
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
        
        if($res['Result'] === 'Info Updated Successfully'){
            return response(['foxproRes' => $res, 'message' => 'delivery information saved!!', 'information' => $deliveryInfo])->header('Content-Type', 'application/json');        
        }
        
        return response(['foxproRes' => $res, 'message' => 'internal issue', 'information' => $deliveryInfo])->header('Content-Type', 'application/json');
    }

    // Show payment form.
    public function orderPayment(Request $request){
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
            'params' => [$userEmail,$orderNumber],
            'keep_session' => false,
        ]);

        if($deliveryInfo['status'] === 201 && $depositInfo['status'] === 201) {
            return Inertia::render('Orders/OrderPayment',[
                'order' => $order, 
                'deliveryInfo' => $deliveryInfo['rows'],                         
                'depositInfo' => $depositInfo['rows'][0],
            ]);
        }

        if($deliveryInfo['status'] === 500) {
            logFoxproError('GetDeliveryInfo','orderPayment', [$orderNumber], $deliveryInfo);
        }
        if($depositInfo['status'] === 500) {
            logFoxproError('getpercentdeposit','orderPayment', [$userEmail,$orderNumber], $depositInfo);
        }

        
        return redirect('/orders')->with(['message' => 'Something went wrong. please contact support']);
    }

    // Creates a transaction.
    public function createCharge(Request $request){
        $info = $request->all();
        $js_data = json_encode($info['info']);
        $uuidTransaction = (string) Str::uuid();
        $orderNumber = getOrderNumberFromPath($request->path());

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('INTUIT_AUTH_TOKEN'),                      
            'Content-Type' => 'application/json',
            'Request-Id' => $uuidTransaction,
        ])->withBody($js_data)->post('https://sandbox.api.intuit.com/quickbooks/v4/payments/charges');
        

        if($response->successful()){

            // "Result" : "Info Updated Successfully" |
            $cashReceiptRes = FoxproApi::call([
                'action' => 'SaveCR',
                // get amount without credit card fee.
                'params' => [$orderNumber,'CC',$info['foxproInfo']['amountPaid'],'05/22/2024','harol rojas','1234567890000','12/24','123'],
                'keep_session' => false,
            ]);

            return response(['intuitRes' => $response->json(), 'status' => $response->status(), 'cashRes' => $cashReceiptRes])->header('Content-Type', 'application/json');

        }else if($response->clientError()){           
            // 401 -> access token expired!!
            if($response->status() === 401){
                $this->getAccessToken();
            }        
            
            // 400 -> invalid information!!
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');
        }else {
            return response(['intuitRes' => "something else happened"])->header('Content-Type', 'application/json');
        }
    }

    // create bank transaction.
    public function createBankCharge(Request $request){        
        $info = $request->all();
        $js_data = json_encode($info);
        $uuidTransaction = (string) Str::uuid();
        $orderNumber = getOrderNumberFromPath($request->path());
        
        $response = Http::withHeaders([
            'Authorization' => env('INTUIT_AUTH_TOKEN'),                      
            'Content-Type' => 'application/json',
            'Request-Id' => $uuidTransaction,
        ])->withBody($js_data)->post('https://sandbox.api.intuit.com/quickbooks/v4/payments/echecks');
                        
        if($response->successful()){
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');

        }else if($response->clientError()){
            // 401 -> access token expired!!            
            // $this->getAccessToken();

            // 400 -> invalid information!!

            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');
        }else {
            return response(['intuitRes' => "something else happened"])->header('Content-Type', 'application/json');
        }
    }

    // get status of a eCheck.
    public function getStatusCheck(Request $request){
        $info = $request->all();        
        $uuidTransaction = (string) Str::uuid();
        $orderNumber = getOrderNumberFromPath($request->path());

        $response = Http::withHeaders([
            'Authorization' => env('INTUIT_AUTH_TOKEN'),            
            'Request-Id' => $uuidTransaction,
        ])->get('https://sandbox.api.intuit.com/quickbooks/v4/payments/echecks/' . $info['id']);        

        if($response->successful()){
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');

        }else if($response->clientError()){
            // 401 -> access token expired!!
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');
        }else {
            return response(['intuitRes' => "something else happened"])->header('Content-Type', 'application/json');
        }
    }

    // Create a order number for new order.
    public function createOrderNumber(Request $request){        
        $username = auth()->user()->username;        
        $products = $request->all();
        info($products);
        // Get all orders
        $orders = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);

        if($orders['status'] === 500){
            // TODO: log error.
            // assings an empty array so template can display proper message.
            $orders['rows'] = []; 
        }

        // get how many orders the client has.
        $numOfOrders = count($orders['rows']);

        // if there are orders.
        if($numOfOrders > 0){
            // get the last order number.
            $lastOrderNum = $orders['rows'][$numOfOrders - 1]['ordernum'];

            // get 3 first letters.
            $charsFromOrderNum = substr($lastOrderNum, 0, 3); 

            // get only int from order number and increment it by one.
            $NumsFromOrderNum = substr($lastOrderNum, 3);            
            $nextOrderNumber = (int)$NumsFromOrderNum + 1;

            $newOrderNumber = $charsFromOrderNum . $nextOrderNumber;

            return Inertia::render('Orders/OrderNumber', ['nextOrderNumber' => $newOrderNumber, 'products' => $products, 'orders' => $orders['rows'], 'message' => '']);             
        }else {
            
            // Gets user info.
            $response = FoxproApi::call([
                'action' => 'GETUSERINFO',
                'params' => [$username],
                'keep_session' => false, 
            ]);
            
            if($response['status'] === 500 || (array_key_exists('Result',$response) && $response['Result'] === 'no such user name found')){
                Log::error("=VVVVV===ERROR REQUESTING DATA FROM FOXPRO. function: GETUSERINFO ====VVVVV");
                Log::error($response);
                return Inertia::render('Orders/OrderNumber', ['nextOrderNumber' => 'none', 'products' => 'none', 'orders' => 'none', 'message' => 'error']);     
            }
            
            $companyCode = $response['rows'][0]['wholesaler'];            
            return Inertia::render('Orders/OrderNumber', ['nextOrderNumber' => $companyCode .'000001', 'products' => $products, 'orders' => $orders['rows'], 'message' => '']); 
        }                
    }

    // Create new order.
    public function createOrder(Request $request){
        $username = auth()->user()->username;
        $data = $request->all();
        
        // Result: "This sales order already exists" | "All items entered"
        $response = FoxproApi::call([
            'action' => 'OrderEnter',
            'params' => [$username, $data['newOrderNum'], $data['skus']],
            'keep_session' => false, 
        ]);
        
        if($response['status'] === 201 && $response['Result'] === 'All items entered'){
            return redirect('/orders')->with('message', 'Order Number ' . $data['newOrderNum'] . ' created!!');
        }

        if($response['status'] === 500 || $response['Result'] !== 'Updated Info'){
            Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: OrderEnter ====VVVVV");
            Log::error('order number: ' . $data['newOrderNum']);
            Log::error('skus: ' . $data['skus']);
            Log::error($response);
        }
                
        return redirect('/orders')->with('message', "something went wrong. Please contact support.");
    }

    public function testApi(){

        // hershel must include another field for the sales rep.
        // $response = FoxproApi::call([
        //     'action' => 'OrderEnter',
        //     'params' => ['HarolE$Davidici_com','HAR000014','71-VB-024-M03-V03**1~71-VB-024-M03-V15**2~71-TU-012-M03-V23**3~18-048-2S-T2!!ELORA**1~'],
        //     'keep_session' => false, 
        // ]);                

        // $response = FoxproApi::call([
        //     'action' => 'GETUSERINFO',
        //     'params' => ['wally%40atozkitchenandbath.com'],
        //     'keep_session' => false, 
        // ]);
        
        // $response = FoxproApi::call([
        //     'action' => 'GetProductPrice',
        //     'params' => ['HarolE$Davidici_com','18-048-2S-T2'],
        //     'keep_session' => false, 
        // ]);

        // $response = FoxproApi::call([
        //     'action' => 'SaveDeliveryInfo',
        //     'params' => ['HAR000001','05/20/2024','my vanities','john doe','1234567890','1234567890','wholesaler@email.com','customer@email.com','123 main st','brooklyn','ny','11223','pick up','','ALL'],
        //     'keep_session' => false, 
        // ]);

        // $response = FoxproApi::call([
        //     'action' => 'GetDeliveryInfo',
        //     'params' => ['HAR000001'],
        //     'keep_session' => false, 
        // ]);

        // $response = FoxproApi::call([
        //     'action' => 'getpercentdeposit',
        //     'params' => ['harole@davidici.com','HAR000011'],
        //     'keep_session' => false,
        // ]);        
        
        // $response = FoxproApi::call([
        //     'action' => 'SaveCR',
        //     'params' => ['HAR000011','CC','447.07','05/28/2024','harol rojas','1234567890000','12/24','123'],
        //     'keep_session' => false,
        // ]);

        // "Result": "Updated Info" |
        // $response = FoxproApi::call([
        //     'action' => 'ChangeOrderNote',
        //     'params' => ['HAR000012','71-VB-024-M03-V03','1','this is anote'],
        //     'keep_session' => false,
        // ]);

        
        // $response = FoxproApi::call([
        //     'action' => 'GETCOMMINFO',
        //     'params' => ['mia.ruzzo@alliedkitchenandbath.com'],
        //     'keep_session' => false,
        // ]);

        // return Inertia::render('Test',['response' => $response]);
        return response(['response' => $response])->header('Content-Type', 'application/json');
    }


    //=========HELPER FUNCTIONS=============//
    public function isPaymentSubmitted($orderNumber){

        // "Result": "There are no payments for this sales order number" |
        $paymentInfo = FoxproApi::call([
            'action' => 'GetCR',
            'params' => [$orderNumber],
            'keep_session' => false, 
        ]);        
        
        if(!array_key_exists('rows',$paymentInfo)) {
            return false;
        }else {
            return true;
        }
    }

    public function isDeliveryInfoSave($orderNumber){
        $deliveryInfo = FoxproApi::call([
            'action' => 'GetDeliveryInfo',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        if(array_key_exists('rows',$deliveryInfo) && $deliveryInfo['rows'][0]['deldate']) {
            return true;
        }else {
            return false;
        }
    }

    public function getAccessToken(){
        $clientId = env('INTUIT_CLIENT_ID');
        $clientSecret = env('INTUIT_CLIENT_SECRECT');
        $refreshToken = env('INTUIT_REFRESH_TOKEN');
        
        $auth = 'Basic ' . base64_encode($clientId . ':' . $clientSecret);
        $data = http_build_query(['grant_type' => 'refresh_token', 'refresh_token' => $refreshToken]);

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => $auth,                      
            'Content-Type' => 'application/x-www-form-urlencoded',            
        ])->withBody($data,'application/x-www-form-urlencoded')->post(env('INTUIT_REFRESH_URL'));

        info('--vvvvv-- response from access token request --vvvvv--');
        info($auth);
        info($data);
        info($response->status());
        info($response->collect());

        if($response->status() === 200){
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

