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
     <p>Greetings from the Davidici Family. 
     Seems like you request to change your password. If you did not make such request, ignore this email and please notify our team as soon as possible (harole@davidici.com).
     If you intended to change your password, Please click on the following link: <a href={{ $url }}>click here to change your password!!</a> 
     .This is a temporary link that only will be available for 20 minutes starting from the time this email was sent.</p>     
     <span>(DO NOT reply to this email. for any inconvenience, please contact support)</span>
     <br>
     <img
          class="logo"
          src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
     />
</body>
</html>