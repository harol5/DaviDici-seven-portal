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

    // Send invitation with signed url for register form-----------
    public function sendInvitation(Request $request){
        $formFields = $request->validate([
            'name' => ['required', 'min:3'],                      
            'email' => ['required', 'email'],            
        ]);

        //generate signed url        
        $url = URL::temporarySignedRoute(
          'user.register', now()->addMinutes(2)
        );
        
        //send email wit url on the body
        $recipient = 'hrcode95@gmail.com';

        // Mail::to($recipient)->send(new RegisterMail());
        // return redirect('/orders');            
    
        // $response = Http::post("https://api.mailgun.net/v3/mg.davidici.com/messages", [
        //     'auth' => ['api', env('MAILGUN_SECRET')],
        //     'form_params' => [
        //         'from' => 'postmaster@mg.davidici.com',
        //         'to' => $recipient,
        //         'subject' => 'Sample Email',
        //         'html' => view('emails.newUserRegistration')->render(),
        //     ],
        // ]);

        // $options = [
        //     [
        //         'name' => 'from',
        //         'contents' => 'postmaster@mg.davidici.com'
        //     ],
        //     [
        //         'name' => 'to',
        //         'contents' => $recipient
        //     ],
        //     [
        //         'name' => 'subject',
        //         'contents' => 'Sample Email'
        //     ],
        //     [
        //         'name' => 'html',
        //         'contents' => view('emails.newUserRegistration')->render(),
        //     ],
        // ];   
        
        // $options = [
        //     'from' => 'postmaster@mg.davidici.com',
        //     'to' => $recipient,
        //     'subject' => 'Sample Email',
        //     'html' => view('emails.newUserRegistration')->render(),
        // ];

        // $response = Http::withOptions(['form_params' => $options])->withHeaders([            
        //     'Authorization' => 'Basic ' . base64_encode('api' . ':' . env('MAILGUN_SECRET')),
        // ])->post('https://api.mailgun.net/v3/mg.davidici.com/messages');


        // $response = Http::post("https://api.mailgun.net/v3/mg.davidici.com/messages", [
        //     'auth' => ['api', env('MAILGUN_API_KEY')],
        //     'form_params' => [
        //         'from' => 'your-email@example.com',
        //         'to' => $recipient,
        //         'subject' => 'Sample Email',
        //         'html' => (new RegisterMail())->render(),
        //     ],
        // ]);

        $domainName = 'mg.davidici.com';
        $curl = curl_init();

        $payload = array(
        "from" => "postmaster@mg.davidici.com",
        "to" => $recipient,
        "subject" => "Sample Email",
        "html" => (new RegisterMail())->render(),
        );

        curl_setopt_array($curl, [
        CURLOPT_HTTPHEADER => [
            "Content-Type: multipart/form-data",
            "Authorization: Basic " . base64_encode('api' . ':' . env('MAILGUN_SECRET'))
        ],
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_PORT => "",
        CURLOPT_URL => "https://api.mailgun.net/v3/" . $domainName . "/messages",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => "POST",
        ]);

        $response = curl_exec($curl);
        $error = curl_error($curl);
        curl_close($curl);
    
        if ($error) {
            info($error);
            return redirect('/orders')->with(['message' => 'error!!']);        
        } else {
            info($response);
            return redirect('/orders')->with(['message' => 'email sent!']);           
        }
        
        //redirect user to dashboard with flashmessage stating if success or fail
        // info($response);
        // if ($response->successful()) {
        //     return redirect('/orders')->with(['message' => 'email sent!']);            
        // } else {
        //     return redirect('/orders')->with(['message' => 'error!!']);            
        // }        
        
    }

    // Show register form (signed url)------------------
    public function register(Request $request){                        
        if(Gate::allows('create-user') || $request->hasValidSignature()){
            return Inertia::render('Users/Register');            
        }
        abort(403);
    }

    // Create user (admin only)----------------------
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

    // Shows welcome page
    public function welcome(Request $request){
        $name = $request->session()->get('name');
        $error = $request->session()->get('error');
        return Inertia::render('Welcome',['name' => $name, 'error' => $error]);
    }    

    public function registerSalesPerson(Request $request){
        return Inertia::render('Users/SalesPersonRegister');
    }

    public function createSalesPerson(Request $request){
        $formFields = $request->validate([
            'firstName' => ['required', 'min:3'],                        
            'phone' => ['required', 'min:3'],                        
            'email' => ['required', 'email', Rule::unique('users', 'email')],
            'username' => 'required',             
            'role' => 'required',
            'password' => 'required|confirmed|min:6'
        ]);

        $formFields['lastName'] = $request->all()['lastName'] ?? '';
        $formFields['businessPhone'] = $request->all()['businessPhone'] ?? '';
        $formFields['password'] = bcrypt($formFields['password']);

        // Assigning role:
        // owner = 1919 , admin = 3478 
        $formFields['role'] === 'salesperson' ? $formFields['role'] = 1950 : $formFields['role'] = 1919;

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

        return redirect('/register/salesperson');
    }

}
