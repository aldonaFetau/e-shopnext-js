import prisma from "@/libs/prismadb";
interface IParams{
    orderid?:string
}
export default async function getOrderById(params:IParams) {

    try {

      const {orderid}=params;
      const order = await prisma.order.findUnique({
        where:{id:orderid}
      })

      if(!order){return null}

     return order;   
  
    } catch (error:any) {
        throw new Error(error)
    }
    
}