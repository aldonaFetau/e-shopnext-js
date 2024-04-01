import Container from "@/app/components/Container";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import getOrders from "@/actions/getOrders";
import ManageOrdersClient from "./ManageOrdersClient";

const ManageOrders = async() => {
    
    const currentUser = await getCurrentUser();
    const orders:any = await getOrders();
    if(!currentUser || currentUser.role!== 'ADMIN'){
        return <NullData title='Oops! Access Denied'/> ;
    }
    
    return ( 
        <div className="p-8">
            <Container>
                <ManageOrdersClient orders ={orders}/>
            </Container>
        </div>
     );
}
 
export default ManageOrders;