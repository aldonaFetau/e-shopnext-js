"use client"

import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import SetColor from "@/app/components/products/SetColor";
import SetQuantity from "@/app/components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { Rating } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";

interface ProductDetailsProp{
product: any
}
export type CartProductType = {
id: string,
name:string,
description:string, 
category:string,
brand: string,
selectedImg:SelectedImgType,
qty:number, 
price:number,

}

export type SelectedImgType ={
    color:string, 
    colorCode: string, 
    image:string
}
const Horizontal= ()=>{
return <hr className="w-[30%] my-2"/>
}

const ProductDetails :React.FC<ProductDetailsProp> = ({product}) => {
    
    const {handleAddProductToCart, cartProducts} = useCart();
    const [isProductInCart, setIsProductInCart]=useState(() => {
        // Initialize isProductInCart based on whether cartProducts contain the current product
        if (cartProducts) {
            const existingIndex = cartProducts.findIndex((item)=>item.id=== product.id);
            if (existingIndex >-1){return true}
        
        }
        return false;
    });
    const [cartProduct, setCartProduct] = useState<CartProductType>({
        id: product?.id,
        name:product.name,
        description:product.description, 
        category:product.category,
        brand: product.brand,
        selectedImg: {...product.images[0]},
        qty:1, 
        price:product.price,
        
        })
    console.log("cart products",cartProducts );
    const router = useRouter();
    const ProductRating = product.reviews.reduce((acc:number, item:any)=> item.rating + acc, 0) / product.reviews.length;
   

    useEffect(()=>{

       setIsProductInCart(false);
         if(cartProducts){

    const existingIndex = cartProducts.findIndex((item)=>item.id=== product.id);
    if (existingIndex >-1){setIsProductInCart(true)}

}

    },[cartProducts])
    const handleColorSelect = useCallback((value:SelectedImgType)=>{

     setCartProduct((prev)=>{
        
        return{...prev, selectedImg: value}
     })
   
    }, [cartProduct.selectedImg])
   
    console.log("Cart Product",cartProduct)
    
    
    const handleQtyIncrease = useCallback(()=>{
        if(cartProduct.qty === 99 ){return}
        setCartProduct(prev=>{
            
             return {...prev, qty: prev.qty++}
      })
    },[cartProduct])

    const handleQtyDecrease = useCallback(()=>{

        //prevent negative values or 0
        if(cartProduct.qty ===1){return}
        setCartProduct((prev)=>{

             return {...prev, qty:prev.qty--}
      })
    },[cartProduct])

    return ( <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
    <ProductImage
    cartProduct={cartProduct}
    product={product}
    handleColorSelect={handleColorSelect}
    
    />
        <div className="flex flex-col gap-1 text-slate-500 text-sm">
            <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
            <div className="flex text-2xl font-semibold   text-slate-800 items-center gap-2">
            
            <div>{formatPrice(product.price)}</div>
        </div>
        <div className="flex items-center gap-2">
            <Rating  readOnly value={ProductRating} />
            <div>{product.reviews.length} reviews</div>
        </div>
        <Horizontal/>
        <div className="text-justify">{product.description}</div>
        <Horizontal/>
        <div><span className="font-semibold">CATEGORY</span> {product.category}</div>
        <div><span className="font-semibold">BRAND</span> {product.brand}</div>
        <div className={product.inStock ?'text-teal-400' :'text-rose-400'}>{ product.inStock ? 'In stock': 'Out of stock'}</div>
        <Horizontal/>
        {isProductInCart? <>
        <p className="mb-2 text-slate-500 flex item-center gap-1" >
            <MdCheckCircle size={20} className="text-teal-400"/>
            <span>Product Added To Cart</span></p>
            <div className="max-w-[300px]">
            <Button label="View Cart" outline onClick={()=>{router.push('/cart')}}/>
            </div></>:<>
            <SetColor 
                cartProduct={cartProduct}
                images={product.images}
                handleSelectedColor={handleColorSelect}
                />
                <Horizontal/>
                <SetQuantity
                cartProduct={cartProduct}
                handleQtyIncrease={handleQtyIncrease}
                handleQtyDecrease={handleQtyDecrease}/>
                <Horizontal/>
                <div className="max-w-[300px]">
                {product.inStock &&<Button
                label="Add To Cart"
                onClick={()=>handleAddProductToCart(cartProduct)}/>}
                </div>
                </>}
                <div>
                <Link href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
            <MdArrowBack/>
            <span>Continue Shopping</span>
            </Link></div>
   
        </div>
        </div> );
}
 
export default ProductDetails;