import {NextRequest,NextResponse} from "next/server";
import Razorpay from "razorpay";
import {prisma} from "../../../lib/prisma";
export async function POST(req:NextRequest){
 const {items,email,paymentMethod}=await req.json();
 if(!items?.length||!email)return NextResponse.json({error:"Invalid order"},{status:400});
 const ids=items.map((x:any)=>x.variantId);
 const variants=await prisma.variant.findMany({where:{id:{in:ids}},include:{product:true}});
 let total=0;
 for(const item of items){const v=variants.find(x=>x.id===item.variantId);if(!v||v.stock<item.quantity)return NextResponse.json({error:"Out of stock"},{status:400});total+=v.product.price*item.quantity}
 const orderNumber="TEE-"+Date.now();
 const order=await prisma.order.create({data:{orderNumber,email,paymentMethod,subtotal:total,total,...(paymentMethod==="COD"?{status:"CONFIRMED"}:{}),items:{create:items.map((i:any)=>{const v=variants.find(x=>x.id===i.variantId)!;return {variantId:v.id,productName:v.product.name,size:v.size,quantity:i.quantity,unitPrice:v.product.price}})}}});
 if(paymentMethod==="COD") return NextResponse.json({orderNumber:order.orderNumber,method:"COD"});
 const razorpay=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID!,key_secret:process.env.RAZORPAY_KEY_SECRET!});
 const rp=await razorpay.orders.create({amount:total*100,currency:"INR",receipt:orderNumber});
 await prisma.order.update({where:{id:order.id},data:{razorpayOrderId:rp.id}});
 return NextResponse.json({orderNumber,razorpayOrderId:rp.id,amount:total*100,key:process.env.RAZORPAY_KEY_ID});
}