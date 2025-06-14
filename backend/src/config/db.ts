import { PrismaClient } from "@prisma/client";

const prismaSingletonClient = () =>{
    return new PrismaClient() ;
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaSingletonClient>;
  } & typeof global;
  
  const prismaClient = globalThis.prismaGlobal ?? prismaSingletonClient()

  export default prismaClient 

  if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismaClient