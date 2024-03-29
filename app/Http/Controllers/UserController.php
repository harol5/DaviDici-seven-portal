<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    // Show login form
    public function login(){
        return view('login');
    }
}
