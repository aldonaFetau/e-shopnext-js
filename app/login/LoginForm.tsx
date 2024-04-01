'use client'

import Heading from "@/app/components/Heading";
import Input from "../components/inputs/Input";
import { useEffect, useState } from "react";
import {FieldValues, useForm , SubmitHandler} from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";


interface LoginFormProps {
    currentUser:SafeUser|null
}
const LoginForm:React.FC<LoginFormProps> = ({currentUser}) => {
    
    
    const[isLoading, setIsLoading]= useState(false);  
    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
        defaultValues:{
            email:'',
           password:'',
        }
    })

    const router = useRouter();
    
    useEffect(()=>{
        //when the page first loads check if we are already logged in and redirect to home page
        if(currentUser){
            router.push("/")
            router.refresh();
        }



    },[])

   const onSubmit:SubmitHandler<FieldValues>= (data)=>{

            setIsLoading(true); 
          signIn('credentials',{
            ...data, 
            redirect:false}
            ).then((callback)=>{
                if(callback?.ok){
                    router.push('/');
                    router.refresh( );     
                    toast.success('Logged in')
                }
                if(callback?.error){
                    toast.error(callback.error);
                    setIsLoading(false)
                }


        })

   }
  
  
   if(currentUser){
    return <p className="text-center">Loged in. Redirecting...</p>
   }
    return ( <>
    <Heading title="Sign-in to E~shop"/>
    <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={()=>{signIn('google')}}/>
    <hr  className="bg-slate-300 w-full h-px"/>
       <Input
    id="email"
    label="Email"
    disabled={isLoading}    
    register={register}//register will make use of id to register the input field
    errors={errors}
    required
    />
       <Input
    id="password"
    label="Password"
    disabled={isLoading}    
    register={register}
    errors={errors}
    required
    type="password"
    />
    <Button label={isLoading?"Loading":"Login"} onClick={handleSubmit(onSubmit)}/>
    <p className="text-sm">Do not have an account? {""}<Link href="/register" className="underline">Sign Up</Link></p>
    </> );
}
 
export default LoginForm;