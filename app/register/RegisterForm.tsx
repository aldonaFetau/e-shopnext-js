'use client'

import Heading from "@/app/components/Heading";
import Input from "../components/inputs/Input";
import { useEffect, useState } from "react";
import {FieldValues, useForm , SubmitHandler} from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";


interface RegisterFormProps {
    currentUser:SafeUser|null
}

const RegisterForm:React.FC<RegisterFormProps> = ({currentUser}) => {
    const[isLoading, setIsLoading]= useState(false)
    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
        defaultValues:{
            name:'',
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
       axios.post('/api/register', data).then(()=>{
        toast.success("Account created");
        //login the user
        signIn('credentials',{
            email:data.email,
            password: data.password,
            redirect:false
        }).then((callback)=>{
                if(callback?.ok){
                    router.push('/');
                    //router.refresh( );     
                    toast.success('Logged in')
                }
                if(callback?.error){
                    toast.error(callback.error)
                }


        })
//after this signin is called it goes ti [...nextauth] to make use of the credentials logic to login the user
       })
       .catch(()=>{

        toast.error("Something went wrong")
       })
       .finally(()=>{
        setIsLoading(false)
       })


   }
   
   if(currentUser){
    return <p className="text-center">Loged in. Redirecting...</p>
   }
    return ( <>
    <Heading title="Sign-up for E~shop"/>
    <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={()=>{signIn('google')}}/>
    <hr  className="bg-slate-300 w-full h-px"/>
    <Input
    id="name"
    label="Name"
   disabled={isLoading}    
    register={register}
    errors={errors}
    required
    />
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
    <Button label={isLoading?"Loading":"Sign Up"} onClick={handleSubmit(onSubmit)}/>
    <p className="text-sm">Already have an account? {""}<Link href="/login" className="underline">Login</Link></p>
    </> );
}
 
export default RegisterForm;