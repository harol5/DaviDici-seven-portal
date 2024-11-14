<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Services\TestingServiceTwo;

class TestingService 
{           
     
     private $instanceId;

     public function __construct(private Request $request, private TestingServiceTwo $testingTwo)
     {          
     }

     // public function printTest()
     // {
     //      return $this->t;
     // }

     public function getRequestParams()
     {
          return $this->request->user();
     }

     public function getMessageFromS2()
     {
          return $this->testingTwo->getRandomStr();
     }

     public function setUniqueInstanceId(string $id)
     {
          $this->instanceId = $id;
     }

     public function getUniqueInstanceId()
     {
          return $this->instanceId;
     }
}
