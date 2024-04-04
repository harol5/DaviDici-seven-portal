@if(session()->has('message'))
<div id="flash-message" class="fixed top-0 left-1/2 transform -translate-x-1/2 bg-davidiciGold text-white px-48 py-3">
    <p>
      {{session('message')}}
    </p>
</div>
@endif