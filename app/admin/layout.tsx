import { getCurrentUser } from "@/actions/getCurrentUser";
import AdminNav from "../components/admin/AdminNav";
import NullData from "../components/NullData";

//nested layout
export const metadata={

    title:'E~Shop Admin',
    description:'E~Shop Admin Dashboard',
}
const AdminLayout = async({children}:{children:React.ReactNode}) => {
    const currentUser = await getCurrentUser()
    if(!currentUser || currentUser.role!== 'ADMIN'){
        return <NullData title='Oops! Access Denied'/> ;
    }
    return ( <div>
       <AdminNav/>
        {children}
    </div> );
}
 
export default AdminLayout;

