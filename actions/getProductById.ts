import prisma from "@/libs/prismadb";

interface IParams{
    productid?:string
}
export default async function getProductById(params:IParams) {
    try {
        const {productid} = params;
        const product = await prisma.product.findUnique({
            where:{id:productid},
            include:{
                reviews:{
                    include:{    
                        
                        user:true},
                   orderBy:{createdDate:"desc"}
                },
          
            }
         
        
        
        })
    
          if(!product){return null}
    
         return product;   



    } catch (error) {
        
    }
    
}