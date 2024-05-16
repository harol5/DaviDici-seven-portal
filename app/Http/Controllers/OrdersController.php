<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class OrdersController extends Controller
{
    // Show all orders.    
    public function all(Request $request){
        $username = auth()->user()->username;
        $message = $request->session()->get('message');
        $data = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);
        
        if($data['status'] === 500){
            // assings an empty array so template can display proper message.
            $data['rows'] = []; 
        }
        return Inertia::render('Orders/Orders',['orders' => $data['rows'], 'message' => $message]);
    }

    // Show single order overview.
    public function orderOverview(Request $request){
        // throw 404 if order number does not exist

        $username = auth()->user()->username;
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());        
        $products = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        return Inertia::render('Orders/OrderOverview',['order' => $order, 'products' => $products['rows']]);
    }

    // Show single order details.
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

        return Inertia::render('Orders/OrderDetails',['rawOrder' => $order, 'rawProducts' => $products['rows']]);
    }

    // Update quantity product
    public function updateQuantity(Request $request){
        $product = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());
        $res = FoxproApi::call([
            'action' => 'ChangeOrderQty',
            'params' => [$orderNumber,$product['uscode'],$product['linenum'],$product['qty']],
            'keep_session' => false, 
        ]);

        return response($res)->header('Content-Type', 'application/json');
    }

    // Delete product
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

        if($numOfProducts === 1 ){
            return redirect('/orders')->with('message', 'Order Number ' . $orderNumber . ' deleted!!');
        }else{
            return response($res)->header('Content-Type', 'application/json');        
        }        
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
        
        return Inertia::render('Orders/OrderDelivery', ['rawOrder' => $order, 'products' => $products['rows'], 'deliveryInfoByProd' => $deliveryInfo['rows']]);
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
            ],
            'keep_session' => false,
        ]);

        if($res['Result'] === 'Info Updated Successfully'){
            return response(['foxproRes' => $res, 'message' => 'dalivery information saved!!', 'information' => $deliveryInfo])->header('Content-Type', 'application/json');        
        }
        
        return response(['foxproRes' => $res, 'message' => 'internal issue', 'information' => $deliveryInfo])->header('Content-Type', 'application/json');
    }

    // Show payment form.
    public function orderPayment(Request $request){
        // throw 404 if order number does not exist
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());
        return Inertia::render('Orders/OrderPayment',['order' => $order]);
    }

    // Creates a transaction.
    public function createCharge(Request $request){
        $info = $request->all();
        $js_data = json_encode($info);
        $uuidTransaction = (string) Str::uuid();
        

        $response = Http::withHeaders([
            'Authorization' => env('INTUIT_AUTH_TOKEN'),                      
            'Content-Type' => 'application/json',
            'Request-Id' => $uuidTransaction,
        ])->withBody($js_data)->post('https://sandbox.api.intuit.com/quickbooks/v4/payments/charges');
        

        if($response->successful()){
            return response(['intuitRes' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');
        }else if($response->clientError()){
            // 401 -> access token expired!!
            return response(['intuitRes' => "client error", 'status' => $response->status()])->header('Content-Type', 'application/json');
        }else {
            return response(['intuitRes' => "something else happened"])->header('Content-Type', 'application/json');
        }
    }

    // Create a order number for new order
    public function createOrderNumber(Request $request){        
        $username = auth()->user()->username;
        $message = $request->session()->get('message');
        $products = $request->all();

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

            return Inertia::render('Orders/OrderNumber', ['nextOrderNumber' => $newOrderNumber, 'products' => $products, 'orders' => $orders['rows'], 'message' => $message]);             
        }else {
            //TODO: somehow get the first letter for the new customer and start order nums from 1.
            return Inertia::render('Orders/OrderNumber', ['nextOrderNumber' => 'NEW000001', 'products' => $products, 'orders' => $orders['rows'], 'message' => $message]); 
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

        if($response['Result'] === 'All items entered'){
            return redirect('/orders')->with('message', 'Order Number ' . $data['newOrderNum'] . ' created!!');
        }

        // TODO: log error.
        // something went wrong. display the result from foxpro on a flash message.
        return redirect('/orders')->with('message', $response['Result']);
    }

    public function testApi(){
        $response = FoxproApi::call([
            'action' => 'OrderEnter',
            'params' => ['HarolE$Davidici_com','HAR000003','71-VB-024-M03-V03**1~71-VB-024-M03-V15**2~71-TU-012-M03-V23**3~18-048-2S-T2!!ELORA**1~'],
            'keep_session' => false, 
        ]);
        
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

        // return Inertia::render('Test',['response' => $response]);
        return response(['response' => $response])->header('Content-Type', 'application/json');
    }
}

