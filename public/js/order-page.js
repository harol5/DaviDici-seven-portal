//get all orders (on first render);
const orders = document.querySelectorAll(".order-container");
const emptyOrdersMessage = document.querySelector("#empty-orders-message.search-result");

if(orders.length !== 0){
    const searchInput = document.querySelector(".search-order-input");
    searchInput.addEventListener("input",(e)=>{
        //get current value entered
        const searchedOrderNumber = e.target.value.toLowerCase();
        
        //number of orders currently displayed.
        let count = orders.length;
    
        orders.forEach(order => {
            const orderNumber = order.id.toLowerCase();
            if(!orderNumber.includes(searchedOrderNumber)){
                order.style.display = "none"
                count--;
            }else{
                order.style.display = "";
            }
        });
        
        if(count === 0){
            emptyOrdersMessage.style.display = "block";
        }else{
            emptyOrdersMessage.style.display = "none";
        }
    });
}
