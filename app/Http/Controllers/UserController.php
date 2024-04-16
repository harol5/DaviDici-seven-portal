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

        return Inertia::render('Users/Login',['message' => $message]);

        //--- blade template
        // return view('users.login');
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

    // logout user ------------
    public function logout(Request $request){
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('message', 'You have been logged out!');
    }


    // Show register form (admin only)------------------
    public function register(){
        if(!Gate::allows('create-user')){
            abort(403);
        }
        return Inertia::render('Users/Register');
    }


    // Create user (admin only)----------------------
    public function create(Request $request){
        $formFields = $request->validate([
            'name' => ['required', 'min:3'],
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
        $user = User::create($formFields);

        return redirect('/register')->with('message', 'User created');
    }

}
