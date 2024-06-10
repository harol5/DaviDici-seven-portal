<!DOCTYPE html>
<html lang="en">
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Document</title>
     <style>
          .logo{
               width: 10%;
               margin: 1em 0;
          }
     </style>
</head>
<body>
     <h2>Hello {{ $name }}</h2>
     <p>I'm thrilled to extend a warm welcome to you as the newest member of our team at Davidici. 
     We're excited to have you on board and look forward to the contributions we will make together.
     Could you please fill out the requested information in the following link to get you onboard?</p>
     <a href={{ $url }}>click here to register!!</a>     
     <span>(DO NOT reply to this email. for any inconvenience, please contact support)</span>
     <br>
     <img
          class="logo"
          src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
     />
</body>
</html>