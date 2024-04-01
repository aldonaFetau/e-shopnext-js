// import { PrismaClient } from "@prisma/client";

// declare global{
//     var prisma: PrismaClient | undefined
// }
// //load client
// const client = globalThis.prisma | new PrismaClient()

// if (process.env.NODE_ENV !== "production") globalThis.prisma= client
// export default client
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export default prisma

