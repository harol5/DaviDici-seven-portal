import axios from "axios";
import { ShoppingCartComposition, ShoppingCartCustomError } from "../Models/ExpressProgramModels";

export async function getShoppingCartCompositions(){
    console.log("=== getShoppingCartCompostions ===");
    try{
        // 201 | 401 | 500
        const getShoppingCartCompositionsRes = await axios.get(
            "/express-program/shopping-cart/products"
        );        

        console.log('shopping cart compositions:', getShoppingCartCompositionsRes);

        return {
            compositions: getShoppingCartCompositionsRes.data.shoppingCartProducts,
            status: 201,
        };

    }catch(err:any){                
        console.log("error:",err);

        let error;
        if (err.response.status === 401) {
            error = new ShoppingCartCustomError("user no available",{status:401});  
        } else {
            error = new ShoppingCartCustomError("internal error",{status:err.response.status});  
        }
        
        console.log("error obj:", error);      
        throw error        
    }
}

export async function updateShoppingCartCompositions(shoppingCartComposition: ShoppingCartComposition ) {
    try{        
        console.log("====== updateShoppingCartCompositions ======");        
        const compositionsResObj = await getShoppingCartCompositions();                    
        const shoppingCartCompositionsServer: ShoppingCartComposition[] =
        compositionsResObj.compositions;

        console.log("shopping cart compostion result:",shoppingCartCompositionsServer);

        shoppingCartCompositionsServer.push(shoppingCartComposition);
        
        // 201 | 401 | 500
        await axios.post(
            "/express-program/shopping-cart/update",
            shoppingCartCompositionsServer
        );

        return {
            compositions: shoppingCartCompositionsServer,
            status: 201,
        };        

    }catch (err: any) {         
        throw err;
    }
    
}
