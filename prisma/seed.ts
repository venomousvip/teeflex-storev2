import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();
async function main(){
 const products=[
 ["Obsidian Flame Tee","obsidian-flame-tee",899,1499,"Black graphic oversized tee"],
 ["Thalasi Varsity Tee","thalasi-varsity-tee",1099,1799,"Brown premium streetwear tee"],
 ["911 Motorsport Tee","911-motorsport-tee",999,1599,"White graphic streetwear tee"],
 ["Nova Script Tee","nova-script-tee",899,1499,"Black statement tee"],
 ["Aesthetic Motion Tee","aesthetic-motion-tee",1099,1799,"Premium oversized cotton tee"]
 ];
 for(let i=0;i<products.length;i++){
   const [name,slug,price,compareAtPrice,description]=products[i] as any;
   await prisma.product.upsert({where:{slug},update:{},create:{
    name,slug,price,compareAtPrice,description,featured:i<3,
    images:{create:{url:`/products/tee-${i+1}.webp`}},
    variants:{create:["S","M","L","XL","XXL"].map((size,j)=>({size,sku:`TEE-${i+1}-${size}`,stock:20+j*5,color:"Default"}))}
   }});
 }
}
main().finally(()=>prisma.$disconnect());
