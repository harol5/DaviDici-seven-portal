<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;
use App\Models\OAuthToken;
use Illuminate\Support\Facades\Crypt;

class OAuthTokenService
{
     public static function getAccessToken()
     {          
          $token = OAuthToken::latest()->first();          
          if ($token && Carbon::now()->lt(Carbon::parse($token->expires_at))) {                              
               return Crypt::decryptString($token->access_token);               
          }                    

          return self::refreshToken(Crypt::decryptString($token->refresh_token), $token->company_id);
     }

     public static function refreshToken($refreshToken, $companyId)
     {                 
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
                  
               OAuthToken::create([
                    'access_token' => Crypt::encryptString($tokens['access_token']),
                    'refresh_token' => Crypt::encryptString($tokens['refresh_token']),
                    'expires_at' => Carbon::now()->addSeconds($tokens['expires_in']),
                    'company_id' => $companyId,
               ]);                                                    

               return $tokens['access_token'];
          } else {
               logErrorDetails('refreshToken', 'OAuthTokenService','refresh token request not successful.',$response->body(),'admin');
               return '';
          }                     
     }

     public static function getCompanyId()
     {          
          $token = OAuthToken::latest()->first();          
          return Crypt::decryptString($token->company_id);                    
     }
}