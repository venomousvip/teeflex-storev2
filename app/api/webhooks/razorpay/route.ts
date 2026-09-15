import {NextRequest,NextResponse} from "next/server";
import crypto from "crypto"; import {prisma} from "../../../../lib/prisma";
export async function POST(req:NextRequest){
 const raw=await req.text(); const sig=req.headers.get("x-razorpay-signature")||"";
 const expected=crypto.createHmac("sha256",process.env.RAZORPAY_WEBHOOK_SECRET||"").update(raw).digest("hex");
 if(sig!==expected)return NextResponse.json({error:"Invalid signature"},{status:400});
 const event=JSON.parse(raw);
 if(event.event==="payment.captured"){
  const payment=event.payload.payment.entity;
  const order=await prisma.order.findFirst({where:{razorpayOrderId:payment.order_id},include:{items:{include:{variant:true}}}});
  if(order&&order.paymentStatus!=="PAID"){
   await prisma.$transaction([prisma.order.update({where:{id:order.id},data:{paymentStatus:"PAID",status:"CONFIRMED",razorpayPaymentId:payment.id}}),...order.items.map(i=>prisma.variant.update({where:{id:i.variantId},data:{stock:{decrement:i.quantity}}}))]);
  }
 }
 return NextResponse.json({ok:true});
}