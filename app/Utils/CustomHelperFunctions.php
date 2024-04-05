<?php

if(! function_exists('getOrderNumberFromPath')) {
    function getOrderNumberFromPath($path){
        $pathSections = explode("/",$path);
        return $pathSections[1];
    }
}
