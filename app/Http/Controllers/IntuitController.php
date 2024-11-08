<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\OAuthToken;

class IntuitController extends Controller
{
     public function connectToIntuit()
     {
          $baseUrl = 'https://appcenter.intuit.com/connect/oauth2';
          $params = [
               'client_id' => env('INTUIT_CLIENT_ID'),
               'scope' => 'com.intuit.quickbooks.payment',
               'redirect_uri' => env('INTUIT_REDIRECT_URL'),
               'response_type' => 'code',
               'state' => env('INTUIT_AUTH_STATE'),
          ];

          $authorizationRequestUrl = $baseUrl . '?' . http_build_query($params, null, '&', PHP_QUERY_RFC1738);

          info('=== connectToIntuit ===');
          info($authorizationRequestUrl);

          return Inertia::render('Intuit/Connect', ['authUrl' => $authorizationRequestUrl]);
     }

     public function handleIntuitRedirect(Request $request)
     {
          info('==== handleIntuitRedirect ====');          
          $intuitInfo = $request->all();

          if (array_key_exists('code',$intuitInfo) && array_key_exists('state',$intuitInfo) && strcmp($intuitInfo['state'],env('INTUIT_AUTH_STATE')) === 0) {
               info('intuit auth info:');
               info($intuitInfo);

               $clientId = env('INTUIT_CLIENT_ID');
               $clientSecret = env('INTUIT_CLIENT_SECRECT');               

               $auth = 'Basic ' . base64_encode($clientId . ':' . $clientSecret);
               $data = http_build_query(['grant_type' => 'authorization_code', 'code' => $intuitInfo['code'], 'redirect_uri' => env('INTUIT_REDIRECT_URL')]);

               $response = Http::withHeaders([
                    'Accept' => 'application/json',
                    'Authorization' => $auth,
                    'Content-Type' => 'application/x-www-form-urlencoded',
               ])->withBody($data, 'application/x-www-form-urlencoded')->post(env('INTUIT_TOKEN_URL'));
               
               if ($response->successful()) {                    
                    $collection = $response->collect();
                    $tokens = $collection->all();

                    info('intuit token info:');
                    info($tokens);                    
                    info('current time:');
                    info(Carbon::now()); 
                    info('token expires at:');
                    info(Carbon::now()->addSeconds($tokens['expires_in'])); 
                    

                    // now save info to o_auth model
                    $authToken = OAuthToken::create([
                         'access_token' => $tokens['access_token'],
                         'refresh_token' => $tokens['refresh_token'],
                         'expires_at' => Carbon::now()->addSeconds($tokens['expires_in']),
                    ]);

                    info('auth token saved:');
                    info($authToken);
                     
               }                                             

          }          

          return redirect('/orders')->with(['message' => 'came from intuit auth']);
     }
}