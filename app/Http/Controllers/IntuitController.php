<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;
use App\Models\OAuthToken;
use Illuminate\Support\Facades\Crypt;


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

          $authorizationRequestUrl = $baseUrl . '?' . http_build_query($params, "null", '&', PHP_QUERY_RFC1738);          

          return Inertia::render('Intuit/Connect', ['authUrl' => $authorizationRequestUrl]);
     }

     public function handleIntuitRedirect(Request $request)
     {                
          $intuitInfo = $request->all();

          if (array_key_exists('code',$intuitInfo) && array_key_exists('state',$intuitInfo) && strcmp($intuitInfo['state'],env('INTUIT_AUTH_STATE')) === 0) {               
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
                    
                    OAuthToken::create([
                         'access_token' => Crypt::encryptString($tokens['access_token']),
                         'refresh_token' => Crypt::encryptString($tokens['refresh_token']),
                         'expires_at' => Carbon::now()->addSeconds($tokens['expires_in']),
                         'company_id' => Crypt::encryptString($intuitInfo['realmId']),
                    ]);       
                    
                    return redirect('/orders')->with(['message' => 'access token was successfully stored']);
               }else {
                    logErrorDetails("handleIntuitRedirect","IntuitController",'exchanging code to get access token failed.',$response->body(),'admin');
                    return redirect('/orders')->with(['message' => 'error exchanging code']);
               }                                             
          } else {
               logErrorDetails("handleIntuitRedirect","IntuitController",'redirect responds from intuit did not include code, state or state was tampered.',$intuitInfo,'admin');
               return redirect('/orders')->with(['message' => 'redirect responds from intuit did not include code, state or state was tampered.']);
          }                    
     }
}