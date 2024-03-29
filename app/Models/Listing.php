<?php
namespace App\Models;

class Listing {
    public static function all(){
        return [
            [
                'id' => 1,
                'title' => 'listing one',
                'description' => 'this is listing bla bla bla'
            ],
            [
                'id' => 2,
                'title' => 'listing two',
                'description' => 'this is listing bla bla bla'
            ]
        ];
    }
}