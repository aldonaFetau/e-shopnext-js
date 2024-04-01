"use client"

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {StripeElementsOptions, loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import CheckoutForm from "./CheckoutForm";
import { dividerClasses } from "@mui/material";
import Button from "../components/Button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
const CheckoutClient = () => {
   
   const{cartProducts, paymentIntent, handleSetPaymentIntent}= useCart();
   const [error, setError]= useState(false);
   const [loading, setLoading]= useState(false);
   const[clientSecret, setClientSecret]=useState<string>("")
   const[paymentSucces, setPaymentSuccess] = useState(false)
   const router = useRouter();
   
   console.log("Payment intent", paymentIntent)
   console.log("client secret", clientSecret);
  // const paymentIntentRef = useRef(paymentIntent); // to avoid the infinite loop inside useEffect, and use it as a dependency
  
   useEffect(()=>{   
    if(cartProducts){
        setLoading(true);
        setError(false);
        
        fetch('/api/create-payment-intent',{

            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                items: cartProducts,
                payment_intent_id:paymentIntent
            })
        }).then(async(response)=>{
                setLoading(false);
       
              if (response.status === 401){

                return router.push('/login');
            }
            const responseData = await response.json();
           
         return responseData
          
        }).then((data)=> {
            
            console.log(data)
        
          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id)
          //paymentIntentRef.current = data.paymentIntent.id;



        }).catch((error:any)=>{
            setError(true);
            console.log(error)
            toast.error('Something went wrong')
        })

    }




   },[cartProducts] )
   
  const options: StripeElementsOptions ={

    clientSecret,
    appearance:{
        theme:"stripe",
        labels:"floating"
    }

  }
   
   const handleSetPaymentSuccess = useCallback((value:boolean)=>{

      setPaymentSuccess(value)

   },[])
   
   
    return <div className="w-full">
        {clientSecret && cartProducts &&(
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret= {clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess}/>
        </Elements>
      )}
      {loading && <div className="text-center">Loading Checkout...</div>}
        
        {error && <div className="text-center text-rose-500">Something went wrong...</div>}
        {paymentSucces && (
            <div className="flex items-center flex-col gap-4">
                <div className="text-teal-500 text-center">Payment Success</div>
                <div className="max-w-[220px] w-full">
                    <Button label="View Your Orders"  onClick={()=> router.push('/orders')}/>
                </div>
            </div>
        )}
    </div>;
}
 
export default CheckoutClient;