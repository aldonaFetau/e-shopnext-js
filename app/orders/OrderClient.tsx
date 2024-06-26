'use client'

import { Order, User } from "@prisma/client";
import {DataGrid, GridColDef} from "@mui/x-data-grid"
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { MdAccessTimeFilled, MdArrowBack, MdCached, MdClose, MdDelete, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import  { useRouter } from "next/navigation";
import moment from "moment";
import NullData from "../components/NullData";
import Link from "next/link";



interface OrdersClientProps{
    orders : ExtendedOrder[]
}
type ExtendedOrder = Order & {
    user:User
}

const OrdersClient:React.FC<OrdersClientProps> = ({orders}) => {

  
    let rows:any = []
    if(orders){
    rows=orders.map((order)=>{
    return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount/100),
        paymentStatus: order.status,
        date: moment(order.createDate).fromNow(),
        deliveryStatus: order.deliveryStatus
    }
})

    }
    const router = useRouter();
  
  const columns:GridColDef[] =[
    {field:'id', headerName:'ID', width: 220, headerClassName: 'background-color: red' },
    {field:'customer', headerName:'Customer Name', width: 130},
    {field:'amount', headerName:'Amount', width: 130,
    renderCell:(params)=>{
     return (<div className="font-bold text-slate-800">{params.row.amount}</div>)
    }
    },
    {field:'paymentStatus', headerName:'Payment Status', width: 120,
    renderCell:(params)=>{
        return (<div className="h-full flex items-center">{params.row.paymentStatus ==='pending'?
        (<Status text="pending" icon={MdAccessTimeFilled} bg="bg-slate-200" color="text-slate-700"/>):
        params.row.paymentStatus ==='complete'?
        (<Status text="completed" icon={MdDone} bg="bg-green-200" color="text-green-700"/>):
        <></>}</div>)
       }
    },
    {field:'deliveryStatus', headerName:'Delivery Status', width: 120,
    renderCell:(params)=>{
        return (<div className="h-full flex items-center">{params.row.deliveryStatus ==='pending'?
        (<Status text="pending" icon={MdAccessTimeFilled} bg="bg-slate-200" color="text-slate-700"/>):
        params.row.deliveryStatus ==='dispatched'?
        (<Status text="dispatched" icon={MdDeliveryDining} bg="bg-purple-200" color="text-purple-700"/>):
        params.row.deliveryStatus ==='delivered'?  
        (<Status text="delivered" icon={MdDone} bg="bg-green-200" color="text-green-700"/>):
        
        <></>}</div>)
       }
    },
 
    {field:'date', headerName:'Date', width: 130},
    {field:'action', headerName:'Actions', width: 80,  sortable: false,filterable:false,
    renderCell:(params)=>{
        return <div className="h-full flex items-center gap-4 w-full">
            <ActionBtn title="Order details" icon={MdRemoveRedEye} onClick={()=>{router.push(`/order/${params.row.id}`)}}/>
        </div>
       }
    },

  ]
  if(orders.length===0){
    return (<div className="flex flex-col items-center ">
            <div className="text-2xl">No orders yet</div>
            <div>
                <Link href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
            <MdArrowBack/>
            <span>Start Shopping</span>
            </Link></div>
        </div>)
  }

    return ( 
 

        

        <div className="max-w-[1150px] m-auto text-xl">
                <div className="mb-4 mt-8">
                    <Heading title="Manage Orders" center/>
                </div>
                <div style={{height:'600', width:'100%'}}>
                <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                initialState={{
                    pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[10, 20]}
        
                checkboxSelection
                />
                </div>



     </div> );
}
 
export default OrdersClient;