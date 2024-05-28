<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
        $message = $request->session()->get('message');

        if(!Gate::allows('create-user')){
            abort(403);
        }
        return Inertia::render('Users/Register',['message' => $message]);
    }


    // Create user (admin only)----------------------
    public function create(Request $request){
        $formFields = $request->validate([
            'firstName' => ['required', 'min:3'],            
            'phone' => ['required', 'min:3'],            
            'email' => ['required', 'email', Rule::unique('users', 'email')],
            'username' => ['required', 'min:3', Rule::unique('users', 'username')],
            'role' => 'required',
            'password' => 'required|confirmed|min:6'
        ]);

        // Hash Password
        $formFields['password'] = bcrypt($formFields['password']);

        // Assigning role:
        // 1919 = users, admin = 3478
        $formFields['role'] === 'admin' ? $formFields['role'] = 3478 : $formFields['role'] = 1919;
        
        // Create User
        $user = User::create([
            'first_name' => $formFields['firstName'],
            'last_name' => $request->all()['lastName'],
            'phone' => $formFields['phone'],
            'business_phone' => $request->all()['businessPhone'], 
            'email' => $formFields['email'],
            'username' => $formFields['username'],
            'role' => $formFields['role'],
            'password' => $formFields['password'],
        ]);

        return redirect('/register')->with('message', 'User created');
    }

}
