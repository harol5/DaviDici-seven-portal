const orderOptions = document.querySelectorAll(".order-options-menu-wrapper .options");
orderOptions.forEach(option=>{
    const anchor = option.querySelector("a");
    const path = anchor.getAttribute("href");
    if(location.pathname.includes(path)){
        option.classList.add("active-order-option");
    }
})

const flashMessage = document.querySelector("#flash-message");
if(flashMessage){
    setTimeout(()=>{
        flashMessage.remove();
    },3000);
}

