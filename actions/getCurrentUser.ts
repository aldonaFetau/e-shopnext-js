import prisma from "@/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

//not using api, interacting with db directly using prisma
export async function getSession(){
    return await getServerSession(authOptions)
}
// we can use this function to get current user from everywhere in the application
export  async function getCurrentUser (){
try{

     const session = await getSession();
        if(!session?.user?.email){
            return null
        }
    const currentUser = await prisma.user.findUnique({
            where:{
                email:session?.user?.email,
            },
            include:{orders:true}
        })
    if(!currentUser){return null}
    
    return {...currentUser,
            createdAt:currentUser.createdAt.toISOString(), 
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser?.emailVerified?.toISOString()||null
         }
}
catch(error:any)
{
return null

}

}