<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;
use App\Models\OAuthToken;

class OAuthTokenService
{
     public static function getAccessToken()
     {
          info('== getAccessToken called!! ==');

          $token = OAuthToken::latest()->first();

          info('token returned by database:');
          info($token);

          if ($token && Carbon::now()->lt(Carbon::parse($token->expires_at))) {
               info('prevoius token retrived valid!! returning...');

               return $token->access_token;
          }          

          info('prevoius token invalid!!');

          return self::refreshToken($token->refresh_token, $token->company_id);
     }

     public static function refreshToken($refreshToken, $companyId)
     {       
          info('== refreshToken called!! ==');

          $clientId = env('INTUIT_CLIENT_ID');
          $clientSecret = env('INTUIT_CLIENT_SECRECT');          

          $auth = 'Basic ' . base64_encode($clientId . ':' . $clientSecret);
          $data = http_build_query(['grant_type' => 'refresh_token', 'refresh_token' => $refreshToken]);

          $response = Http::withHeaders([
               'Accept' => 'application/json',
               'Authorization' => $auth,
               'Content-Type' => 'application/x-www-form-urlencoded',
          ])->withBody($data, 'application/x-www-form-urlencoded')->post(env('INTUIT_TOKEN_URL'));          

          if ($response->successful()) {                    
               $collection = $response->collect();
               $tokens = $collection->all();

               info('intuit refresh token info:');
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
                    'company_id' => $companyId,
               ]);

               info('auth token saved:');
               info($authToken);                

               return $tokens['access_token'];
          } else {
               info('intuit refresh token failed!!');
               return '';
          }                     
     }

     public static function getCompanyId()
     {
          info('== getCompanyId called!! ==');

          $token = OAuthToken::latest()->first();

          info('token returned by database:');
          info($token);

          return $token->company_id;
          
     }
}