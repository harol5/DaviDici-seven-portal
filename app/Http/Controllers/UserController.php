<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegisterMail;

class UserController extends Controller
{
    // Show login form ----------
    public function login(Request $request){
        $message = $request->session()->get('message');
        $username = auth()->user();
        if($username) {
            return redirect('/orders');
        }

        return Inertia::render('Users/Login',['message' => $message]);
    }

    // Authenticate user ------------
    public function authenticate(Request $request){
        $formFields = $request->validate([
            'email' => ['required','email'],
            'password' => 'required',
        ]);

        if(auth()->attempt($formFields)) {
            $request->session()->regenerate();
            return redirect()->intended('/orders')->with('message', 'You are now logged in!');
        }

        return back()->withErrors(['email' => 'Invalid Credentials'])->onlyInput('email');
    }

    // Logout user ------------
    public function logout(Request $request){
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('message', 'You have been logged out!');
    }

    // Send invitation with signed url for register form -----------
    public function sendInvitation(Request $request){
        $data = $request->all();
        
        //generate signed url.
        $url = URL::temporarySignedRoute(
          'user.register', now()->addMinutes(1440)
        );
        
        //send email with url on the body.
        $options = [
            'from' => 'not-reply@mg.davidici.com',
            'to' => $data['email'],
            'subject' => 'Davidici Registration',
            'html' => view('emails.newUserRegistration', ['name' => $data['name'], 'url' => $url])->render(),
        ];

        $response = Http::withHeaders([          
            'Authorization' => 'Basic ' . base64_encode('api' . ':' . env('MAILGUN_SECRET')),
        ])->asMultipart()->post(env('MAILGUN_ENDPOINT'), $options);
                
        return response(['mailgunResponse' => $response->json(), 'status' => $response->status()])->header('Content-Type', 'application/json');                            
    }

    // Show register form (signed url or admins) ------------------
    public function register(Request $request){                        
        if(Gate::allows('create-user') || $request->hasValidSignature()){
            return Inertia::render('Users/Register');            
        }
        abort(403);
    }

    // Create user (admin only) ----------------------
    public function create(Request $request){
        $formFields = $request->validate([
            'firstName' => ['required', 'min:3'],            
            'companyName' => ['required', 'min:3'],            
            'phone' => ['required', 'min:3'],            
            'address' => ['required', 'min:3'],
            'city' => ['required', 'min:3'],
            'state' => 'required',
            'zipCode' => ['required', 'min:5'],       
            'isTaxExempt' => 'required',         
            'ownerType' => 'required',
            'stateIncorporated' => 'required',
            'email' => ['required', 'email', Rule::unique('users', 'email')],            
            'role' => 'required',
            'password' => 'required|confirmed|min:6'
        ]);
        
        $formFields['username'] = urlencode($formFields['email']);
        $formFields['dateStarted'] = date("Y/m/d");            
        $formFields['lastName'] = $request->all()['lastName'] ?? '';
        $formFields['businessPhone'] = $request->all()['businessPhone'] ?? '';
        $formFields['einNumber'] = $request->all()['einNumber'] ?? '';

        // we will only use this when creating sales people.
        // $formFields['companyCode'] = 'HAR';
        $formFields['companyCode'] = '';
        
        // Hash Password
        $formFields['password'] = bcrypt($formFields['password']);

        // Assigning role:
        // owner = 1919 , admin = 3478 
        $formFields['role'] === 'admin' ? $formFields['role'] = 3478 : $formFields['role'] = 1919;
        
        // 'Result' => 'New User Added' | 
        $foxproResponse = FoxproApi::call([
            'action' => 'SaveUserInfo',
            'params' => [
                $formFields['username'],
                $request->all()['password'], 
                $formFields['email'], 
                $formFields['phone'],  
                $formFields['businessPhone'], 
                $formFields['address'],
                $formFields['city'],
                $formFields['state'], // 2 letters
                $formFields['zipCode'],
                $formFields['firstName'],
                $formFields['lastName'],
                $formFields['companyName'],
                $formFields['dateStarted'],
                $formFields['isTaxExempt'], // Y | N
                $formFields['einNumber'],
                $formFields['ownerType'], // "PROP" | "PART" | "CORP"
                $formFields['stateIncorporated'], // 2 letters
                $formFields['companyCode'], 
            ],
            'keep_session' => false,
        ]);                        

        if($foxproResponse['status'] === 201 && $foxproResponse['Result'] === 'New User Added') {
            // Create User
            $user = User::create([
                'first_name' => $formFields['firstName'],
                'last_name' => $formFields['lastName'],
                'companyName' => $formFields['companyName'],
                'phone' => $formFields['phone'],
                'business_phone' => $formFields['businessPhone'],
                'email' => $formFields['email'],
                'username' => $formFields['username'],
                'role' => $formFields['role'],
                'password' => $formFields['password'],
            ]);            

            return redirect('/users/welcome')->with(['name' => $formFields['firstName']]);
        }        

        Log::error("=VVVVV===ERROR REQUESTING DATA FROM FOXPRO. function: SaveUserInfo ====VVVVV");
        Log::error($foxproResponse);
        return redirect('/users/welcome')->with(['error' => 'something went wrong']);
    }

    // Shows welcome page ----------------------
    public function welcome(Request $request){
        $name = $request->session()->get('name');
        $error = $request->session()->get('error');
        return Inertia::render('Welcome',['name' => $name, 'error' => $error]);
    }

    // Show register form for sales person (owner accounts only) ---------
    public function registerSalesPerson(Request $request){
        return Inertia::render('Users/SalesPersonRegister');
    }

    public function createSalesPerson(Request $request){
        //---- Validate data.
        $formFields = $request->validate([
            'firstName' => ['required', 'min:3'],                        
            'phone' => ['required', 'min:3'],                        
            'email' => ['required', 'email', Rule::unique('users', 'email')],                                     
            'password' => 'required|confirmed|min:6'
        ]);

        //---- Add additional info.
        $formFields['username'] = urlencode($formFields['email']);
        $formFields['dateStarted'] = date("Y/m/d");            
        $formFields['lastName'] = $request->all()['lastName'] ?? '';
        $formFields['businessPhone'] = $request->all()['businessPhone'] ?? '';
        $formFields['password'] = bcrypt($formFields['password']);                
        $formFields['role'] = 1950;

        //---- Get company code.
        $username = auth()->user()->username;
        $response = FoxproApi::call([
            'action' => 'GETUSERINFO',
            'params' => [$username],
            'keep_session' => false, 
        ]);

        if($response['status'] === 500 || (array_key_exists('Result',$response) && $response['Result'] === 'no such user name found')){
            Log::error("=VVVVV===ERROR REQUESTING DATA FROM FOXPRO. function: GETUSERINFO ====VVVVV");
            Log::error($response);
            return redirect('/orders')->with(['message' => 'something went wrong. Please contact support']);
        }

        $formFields['companyCode'] = $response['rows'][0]['wholesaler'];

        //---- Save sales person into foxpro.        
        $foxproResponse = FoxproApi::call([
            'action' => 'SaveUserInfo',
            'params' => [
                $formFields['username'],
                $request->all()['password'], 
                $formFields['email'],
                $formFields['phone'],
                $formFields['businessPhone'],
                '', // address
                '', // city
                '', // state - 2 letters
                '', // zipCode
                $formFields['firstName'],
                $formFields['lastName'],
                '', // companyName
                $formFields['dateStarted'],
                '', // isTaxExempt - Y | N
                '', // einNumber
                '', // ownerType - "PROP" | "PART" | "CORP"
                '', // stateIncorporated - 2 letters
                $formFields['companyCode'], 
            ],
            'keep_session' => false,
        ]);
        
        /**
         * Save user into portal for login if user was created successfully into foxpro.
         * then sends email confirmation.
         */
        if($foxproResponse['status'] === 201 && $foxproResponse['Result'] === 'New User Added') {            
            $user = User::create([
                'first_name' => $formFields['firstName'],
                'last_name' => $formFields['lastName'],            
                'phone' => $formFields['phone'],
                'business_phone' => $formFields['businessPhone'],
                'email' => $formFields['email'],
                'username' => $formFields['username'],
                'role' => $formFields['role'],
                'password' => $formFields['password'],
            ]);
            
            //send email to sales person with login info.
            $options = [
                'from' => 'not-reply@mg.davidici.com',
                'to' => $formFields['email'],
                'subject' => 'Welcome to Davidici',
                'html' => view(
                    'emails.salesPersonConfirmation', 
                    [
                        'name' => $formFields['firstName'], 
                        'companyName' => $response['rows'][0]['companynam'],
                        'admin' => $response['rows'][0]['fname'],
                        'email' => $formFields['email'],
                        'pwd' => $request->all()['password'],
                    ],
                )->render(),
            ];

            $MailgunResponse = Http::withHeaders([          
                'Authorization' => 'Basic ' . base64_encode('api' . ':' . env('MAILGUN_SECRET')),
            ])->asMultipart()->post(env('MAILGUN_ENDPOINT'), $options);

            if($MailgunResponse->ok()){
                return redirect('/orders')->with(['message' => 'Sales person created!!']);
            }else{
                $options = [
                    'from' => 'not-reply@mg.davidici.com',
                    'to' => $response['rows'][0]['email'],
                    'subject' => 'Welcome to Davidici',
                    'html' => view(
                        'emails.salesPersonConfirmation', 
                        [
                            'name' => $formFields['firstName'], 
                            'companyName' => $response['rows'][0]['companynam'],
                            'admin' => $response['rows'][0]['fname'],
                            'email' => $formFields['email'],
                            'pwd' => $request->all()['password'],
                        ],
                    )->render(),
                ];

                $MailgunSecondResponse = Http::withHeaders([          
                    'Authorization' => 'Basic ' . base64_encode('api' . ':' . env('MAILGUN_SECRET')),
                ])->asMultipart()->post(env('MAILGUN_ENDPOINT'), $options);

                if($MailgunSecondResponse->ok()){
                    return redirect('/orders')->with(['message' => 'Sales person created!!']);
                }

                Log::error("=VVVVV=== MAILGUN ERROR. SALES PERSON EMAIL ===VVVVV=");
                Log::error($MailgunSecondResponse);                                
                return redirect('/orders')->with(['message' => 'Sales person created!!']);
            }             
        }        
                
        Log::error("=VVVVV===ERROR REQUESTING DATA FROM FOXPRO. function: SaveUserInfo ====VVVVV");
        Log::error($foxproResponse);
        return redirect('/orders')->with(['message' => 'something went wrong. Please contact support']);;            
    }
}
