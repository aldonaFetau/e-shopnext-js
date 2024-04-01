import Stripe from 'stripe';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { CartProductType } from '@/app/product/[productid]/ProductDetails';
import { getCurrentUser } from '@/actions/getCurrentUser';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,{

    apiVersion:'2023-10-16'
})
//calcualte total order amount on the server (until now we did it only on the client)
const calculateOrderAmount = (items:CartProductType[])=>{
const totalPrice = items.reduce((acc, item)=>{

const itemTotal= item.price * item.qty
return acc + itemTotal
    
},0)
const price:any = Math.floor(totalPrice)
return price;
};

export async function POST(request:Request){
const currentUser = await getCurrentUser();

if (!currentUser){
    return NextResponse.error();
}
const body = await request.json();
const {items, payment_intent_id} = body
const total = calculateOrderAmount(items)*100;
const orderData={
    user: {connect:{id:currentUser.id}},
    amount:total,
    currency:"usd",
    status:"pending",
    deliveryStatus:"pending",
    payment_intent_id:payment_intent_id,
    products:items


}
if(payment_intent_id){
   
    const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
    if (current_intent){
        const updatedIntent = await stripe.paymentIntents.update(payment_intent_id,{
            amount:total
        })
        //update order
    const [existing_order, updated_order] = await Promise.all([
    prisma.order.findFirst({
        where:{payment_intent_id:payment_intent_id}
    }),
    prisma.order.update({
        where:{payment_intent_id:payment_intent_id},
        data:{
            amount:total,
            products:items
                  }
                 })
             ])


    if (!existing_order){
            return NextResponse.error();
        }
    
    return NextResponse.json({paymentIntent: updatedIntent})
    }
 
}else{
//create the intent
const paymentIntent = await stripe.paymentIntents.create({
    amount:total,
    currency:"usd",
    automatic_payment_methods:{enabled:true}
})
//create the order

orderData.payment_intent_id = paymentIntent.id;
await prisma.order.create({
    data:orderData
});

return NextResponse.json({paymentIntent})
}
return NextResponse.error();
}