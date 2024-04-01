import prisma from '@/libs/prismadb';


export default async function getOrdersbyUserId(userId:string) {
    try {
        
        const orders = await prisma.order.findMany({

            include:{
                user:true,
            },
            orderBy:{
                createDate:'desc'
            },
            where:{userId:userId}
        })

        return orders
    } catch(err:any)  {
        
    }
}