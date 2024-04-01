import Container from "@/app/components/Container";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import getOrdersbyUserId from "@/actions/getOrdersByUserId";
import OrdersClient from "./OrderClient";

// user's orders
const Orders = async() => {
    
    const currentUser = await getCurrentUser();
    if(!currentUser){
        return <NullData title='Access Denied'/> ;
    }
   
    const orders = await getOrdersbyUserId(currentUser.id);
  
    if(!orders){
        return <NullData title='No orders found'/> ;
    }
    return ( 
        <div className="p-8">
            <Container>
                <OrdersClient orders ={orders}/>
            </Container>
        </div>
     );
}
 
export default Orders;