import { prisma } from "../lib/prisma";
import { Storefront } from "../components/Storefront";
export default async function Home(){
 const products=await prisma.product.findMany({where:{active:true},include:{images:true,variants:true},orderBy:{createdAt:"desc"}});
 return <Storefront products={products.map(p=>({...p,createdAt:p.createdAt.toISOString()}))}/>;
}