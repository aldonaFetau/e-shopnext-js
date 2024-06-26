import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import {buffer} from "micro"
import prisma from "@/libs/prismadb";

export const config={
    api:{
        bodyParser:false
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,{
    apiVersion:"2023-10-16"
});
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const buf = await buffer(req) // buffer makes possible to read the data as raw
    const sig = req.headers['stripe-signature']

    if(!sig){
        return res.status(400).send("Missing the stripe signature")
    }
    let event:Stripe.Event
    try{

      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)


    }catch(err){


        return res.status(400).send("Webhook error" + err)

    }

switch (event.type){
case 'charge.succeeded':
 const charge:any = event.data.object as Stripe.Charge
 if(typeof charge.payment_intent==='string'){

    await prisma?.order.update({

        where:{payment_intent_id: charge.payment_intent},
        data:{status:'complete', address:charge.shipping?.address}
    })
    console.log("payment intent status update", charge.payment_intent)
 }
break;
default: console.log('Unhandled event type' + event.type)
}

res.json({received:true})
}