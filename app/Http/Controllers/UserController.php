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


    // Show register form (admin only)------------------
    public function register(Request $request){
        $error = $request->session()->get('error');
        $query = $request->all();
        $isTokenValid = false;

        if(array_key_exists('token',$query)){
            $token = $query['token'];

            // TODO: check if token is still valid

            // if token is valid
            $isTokenValid = true;

            // else leave $isTokenValid = false
        }
        
        if(Gate::allows('create-user') || $isTokenValid){
            return Inertia::render('Users/Register',['message' => $error]);
            
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
        $formFields['lastName'] = $request->all()['lastName'];
        $formFields['businessPhone'] = $request->all()['businessPhone'];
        $formFields['einNumber'] = $request->all()['einNumber'];

        // we will only use this when creating sales people.
        // $formFields['companyCode'] = 'HAR';
        $formFields['companyCode'] = '';
        
        // Hash Password
        $formFields['password'] = bcrypt($formFields['password']);

        // Assigning role:
        // 1919 = users, admin = 3478
        $formFields['role'] === 'admin' ? $formFields['role'] = 3478 : $formFields['role'] = 1919;
        
        // 'Result' => 'New User Added' | 
        $foxproResponse = FoxproApi::call([
            'action' => 'SaveUserInfo',
            'params' => [
                $formFields['username'],
                $formFields['password'], 
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

        if($foxproResponse['status'] === 201 && $foxproResponse['Result'] === 'New User Added'){
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

        return redirect('/users/welcome')->with(['error' => 'something went wrong']);
    }

    // Shows welcome page
    public function welcome(Request $request){
        $name = $request->session()->get('name');
        $error = $request->session()->get('error');
        return Inertia::render('Welcome',['name' => $name, 'error' => $error]);
    }

}
