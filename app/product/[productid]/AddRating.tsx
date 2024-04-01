"use client"

import Heading from "@/app/components/Heading";
import { SafeUser } from "@/types";
import { Order, Product, Review } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Rating } from "@mui/material";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import axios from "axios";

interface AddRatingsProps{
    product: Product & {
        reviews: Review[]
    }
    user:(SafeUser & {
        orders: Order[]
    }) | null
}
const AddRating:React.FC<AddRatingsProps> = ({product, user}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const{register, handleSubmit, setValue, reset, formState:{errors}} = useForm<FieldValues>({
      defaultValues:{
        comment:"",
        rating:0
      }


    })
    
    const setCustomValue =(id:string, value:any)=>{

        setValue(id, value, {
            shouldDirty:true,
            shouldTouch:true,
            shouldValidate:true
        })
    }

    const onSubmit:SubmitHandler<FieldValues> =async(data)=>{
     console.log(data,"rating");
     setIsLoading(true);
     if(data.rating===0) {
        setIsLoading(false);
        toast.error("No rating selected")}
     const ratingData = {...data, userId:user?.id, product:product };
     axios.post(`/api/rating`, ratingData).then(()=>{
        toast.success("Rating submited");
        router.refresh();
        reset();
    }).catch((error)=>{
      toast.error('Something went wrong');
    }).finally(()=>{
        setIsLoading(false)
    })
    
    }
    if(!user || !product) return null;
    const deliveredOrder = user?.orders.some(order=> order.products.find(item =>item.id===product.id)&& order.deliveryStatus==='delivered')

    const userReview = product?.reviews.find((review:Review)=>{
     return review.userId === user.id
    });
    if(userReview || !deliveredOrder) return null;
    return ( <div className="flex flex-col gap-2 max-w-[500px]">
        <Heading title="Rate this product"/>
        <Rating  onChange={(event, newValue)=>{
            setCustomValue('rating', newValue)
        }}/>
        <Input
        id='comment'
        label="Comment"
        disabled={isLoading}
        register={register}
        errors={errors}
        required     
    />
       <Button label={isLoading?'Loading...':'Rate Product'} onClick={handleSubmit(onSubmit)} disabled={isLoading}/>        
    </div> );
}
 
export default AddRating;