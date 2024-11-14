<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\TestingService;

class TestMiddleware
{    
    public function __construct(private TestingService $testingSerice)
    {        
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $this->testingSerice->setUniqueInstanceId('instance one');

        $response = $next($request);

        $data = json_decode($response->getContent(), true);        

        // Add your additional key-value pair
        $data['addedLater'] = $this->testingSerice->getUniqueInstanceId();

        // Update the response data
        $response->setContent(json_encode($data));

        return $response;
    }
}
