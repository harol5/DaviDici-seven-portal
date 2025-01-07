<?php

namespace App\Http\Controllers;

use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use App\FoxproApi\FoxproApi;
use App\Models\ModelCompositionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;


class ExpressProgramController extends Controller
{
    public function all(Request $request){
        $message = $request->session()->get('message');
        $input = $request->all();

        /** @var mixed $listingType */
        $listingType;

        array_key_exists('listing-type',$input) ? $listingType = $input['listing-type'] : $listingType = 'fullInventory';

        return Inertia::render('ExpressProgram/ProductsAvailable',
                [
                    'message' => $message,
                    'listingType' => $listingType,
                ]
            );
    }

    public function getExpressProgramProducts()
    {
        $response = FoxproApi::call([
            'action' => 'GETINVSTOCK',
            'params' => ['','','','S'],
            'keep_session' => false,
        ]);

        if($response['status'] === 201){
            return response(['rawProducts' => $response['rows'], 'status' => 201])->header('Content-Type', 'application/json');
        }

        logFoxproError('GETINVSTOCK','getExpressProgramProducts', [], $response);
        return response(['rawProducts' => [], 'status' => 500])->header('Content-Type', 'application/json');
    }

    public function setProduct(Request $request){
        $composition = $request->all();
        return redirect()->route('expressProgram.product', ['product' => $composition['name']])->with(['data' => $composition]);
    }

    public function productConfigurator(Request $request){
        $composition = $request->session()->get('data');

        if(!$composition) {
            return redirect('/express-program')->with('message', 'Product expired!!!');
        }


        return Inertia::render('ExpressProgram/ProductConfigurator',
            [
                'composition' => $composition,
            ]
        );
    }

    public function getShoppingCart(Request $request) {

        /** @var mixed $shoppingCartProducts */
        $shoppingCartProducts;

        /** @var int $statusCode */
        $statusCode;

        if($request->user()) {
            // can this trow an error?
            $shoppingCart = DB::table('shopping_cart')->where('user_id', $request->user()->id)->first();

            $shoppingCartProducts = $shoppingCart ? json_decode($shoppingCart->products) : [];
            $statusCode = 201;
        }else {
            $shoppingCartProducts = "missing user";
            $statusCode = 401;
        }

        return response(['shoppingCartProducts' => $shoppingCartProducts], $statusCode)
        ->header('Content-Type', 'application/json');
    }

    public function updateShoppingCart(Request $request) {
        /** @var string $message*/
        $message;

        /** @var int $statusCode*/
        $statusCode;

        if($request->user()) {
            DB::table('shopping_cart')
            ->updateOrInsert(
                ['user_id' => $request->user()->id],
                ['products' => $request->getContent()]
            );
            $message = 'shopping cart updated';
            $statusCode = 201;
        }else {
            $message = 'missing user';
            $statusCode = 401;
        }

        return response(['message' => $message, 'status' => $statusCode], $statusCode)
        ->header('Content-Type', 'application/json');
    }

    public function fileForm(){
        return Inertia::render('Media');
    }

    public function storeImages(Request $request) {
        $request->validate([
            'model' => 'required|string',
            'images.*' => 'required|image|mimes:webp|max:2048',
        ]);

        // Handle the uploaded files
        $uploadedFiles = $request->file('images');
        $uploadedPaths = [];

        foreach ($uploadedFiles as $file) {
            $name = $file->getClientOriginalName();
            $path = $file->store('/images/express_program','public');
            // $path = $file->store('/images/resource', ['disk' => 'my_files']);

            ModelCompositionImage::create([
                'composition_name' => $name,
                'model' => $request->all()['model'],
                'image_url' => $path,
            ]);
            $uploadedPaths[] = $path;
        }

        // Return a response
        return response()->json([
            'message' => 'Files uploaded successfully',
            'uploadedPaths' => $uploadedPaths,
        ]);
    }

    public function getModelCompositionImages(Request $request) {
        $model = $request->all()['model'];
        $images = ModelCompositionImage::select('composition_name','image_url')->where('model', $model)->orderBy('composition_name')->get();

        return response()->json([
            'images' => $images,
        ]);
    }

    // get all images.
    public function getAllCompositionImages() {
        $images = ModelCompositionImage::all();

        return response()->json([
            'images' => $images,
        ]);
    }

    // delete image.
    public function deleteImages(Request $request) {
        $name = $request->all()['name'];
        $imageUrl = $request->all()['url'];

        $res = ModelCompositionImage::destroy($name);
        Storage::delete('public/' . $imageUrl);

        return response()->json([
            'deleted' => $res,
        ]);
    }

    public function generatePdf(Request $request) {
        $shoppingCartCompositions = $request->all();
        $shoppingCartGrandTotal = 0;

        foreach ($shoppingCartCompositions as &$composition) {
            $otherProductsValidItems = [];
            foreach ($composition['otherProducts'] as $item => $products) {
                if (count($products) > 0) $otherProductsValidItems[] = $products;
            }
            $composition['otherProductsValidItems'] = $otherProductsValidItems;

            // create actual description.
            $size = $composition['info']['size'] ?? '';
            $sinkPosition = $composition['info']['sinkPosition'] ?? '';
            $sinkDescription = $composition['washbasin'] ? 'SINK' . ' ' . $composition['washbasin']['productObj']['model']  : 'NOT SINK';
            $composition['description'] =  $composition['info']['model'] . " " . $size . " " . $sinkPosition . " " . $sinkDescription;

            // get actual image.
            $displayImage = '';
            if (count($composition['images']) > 0) {
                $displayImage = 'storage/' . $composition['images'][0];
            }else {
                $displayImage = ltrim(parse_url($composition['info']['compositionImage'], PHP_URL_PATH), '/');
            }
            $composition['displayImage'] = $displayImage;

            // Calculate Grand Total.
            $shoppingCartGrandTotal += $composition['grandTotal'];
        }
        unset($composition);

        $currencyFormatter = new \NumberFormatter('en_US', \NumberFormatter::CURRENCY);
        $formattedGrandTotal = $currencyFormatter->formatCurrency($shoppingCartGrandTotal, 'USD');

        $pdf = Pdf::loadView(
            'pdf.shopping-cart',
            [
                'compositions' => $shoppingCartCompositions,
                'grandTotal' => $formattedGrandTotal,
                'currencyFormatter' => $currencyFormatter
            ]
        );

        return response()->streamDownload(
            fn () => print($pdf->output()),
            'shopping_cart.pdf',
            ['Content-Type' => 'application/pdf']
        );
    }
}
