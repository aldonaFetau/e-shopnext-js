'use client'

import { CartProductType } from "@/app/product/[productid]/ProductDetails";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type CartContextType= {

    cartTotalQty:number;
    cartTotalAmount:number;
    cartProducts: CartProductType[] | null;
    handleAddProductToCart:(product:CartProductType)=> void;
    handleRemoveProductFromCart:(product:CartProductType)=> void;
    handleQtyIncrease:(product:CartProductType)=> void;
    handleQtyDecrease: (product:CartProductType)=> void;
    handleClearCart:()=> void;
    paymentIntent:string|null;
    handleSetPaymentIntent: (val:string|null)=>void

}
interface Props{
    [propName:string]:any
}
export const CartContext = createContext<CartContextType|null>(null)


export const CartContextProvider =(props:Props)=>{
    
const[cartTotalQty, setCartTotalQty]= useState(0);
const[cartTotalAmount, setCartTotalAmount] = useState(0);
const [cartProducts, setCartProducts] = useState<CartProductType[]|null>(
    
    () => {

    const cartItems: any = localStorage.getItem('eShopCartItems');
    return cartItems ? JSON.parse(cartItems) : null;
  
}
);
const [paymentIntent, setPaymentIntent]=useState<string|null>(null);

useEffect(()=>{
  
const cartItems:any = localStorage.getItem('eShopCartItems');
const cProducts:CartProductType[]|null = JSON.parse(cartItems);
const eshopPaymentIntent:any = localStorage.getItem('eshopPaymentIntent')
const paymentIntent:string|null= JSON.parse(eshopPaymentIntent);

setCartProducts(cProducts);
setPaymentIntent(paymentIntent)

  //  }
},[])
useEffect(()=>{
 
const getTotals=()=>{
if(cartProducts){
        const {total, qty} = cartProducts?.reduce((acc,item)=>{
            const itemTotal = item.price * item.qty;
            acc.total =acc.total +itemTotal;
            acc.qty= acc.qty+ item.qty
            return acc
            },{total:0, qty:0}
            )
           setCartTotalQty(qty);
           setCartTotalAmount(total);
    }
}
    getTotals();

    
    },[cartProducts])
const handleAddProductToCart = useCallback((product:CartProductType)=>{
    
    setCartProducts((prev)=>{
    let updatedCart;
  
    if(prev){

    updatedCart=[...prev, product]

    }
    else  
    {
        updatedCart=[product]
    }
  
    localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));
return updatedCart;
    })
},[])

const handleRemoveProductFromCart = useCallback((product:CartProductType)=>{

if(cartProducts){
    const filteredProducts = cartProducts.filter((item)=>{
        return item.id != product.id
    })
    setCartProducts(filteredProducts)
    toast.success('Product Removed')
    localStorage.setItem('eShopCartItems', JSON.stringify(filteredProducts));

}


},[cartProducts])
const handleQtyIncrease = useCallback((product:CartProductType)=>{
    let updatedCart;
if(product.qty === 99){
    return toast.error("Oops Maximum reached")
}
if(cartProducts){
    updatedCart=[...cartProducts]
    const existingIndex = cartProducts.findIndex((item)=>item.id=== product.id);
    if (existingIndex >-1){
    updatedCart[existingIndex].qty = updatedCart[existingIndex].qty + 1
    }
    setCartProducts(updatedCart);
    localStorage.setItem('eShopCartItems',JSON.stringify(updatedCart))
}

},[cartProducts])
const handleQtyDecrease = useCallback((product:CartProductType)=>{
    let updatedCart;
if(product.qty === 1){
    return toast.error("Oops Minimum reached")
}
if(cartProducts){
    updatedCart=[...cartProducts]
    const existingIndex = cartProducts.findIndex((item)=>item.id=== product.id);
    if (existingIndex >-1){
    updatedCart[existingIndex].qty = --updatedCart[existingIndex].qty 
    }
    setCartProducts(updatedCart);
    localStorage.setItem('eShopCartItems',JSON.stringify(updatedCart))
}

},[cartProducts])

const handleClearCart = useCallback(()=>{
setCartProducts(null);
setCartTotalQty(0);
localStorage.setItem("eShopCartItems", JSON.stringify(null))

},[cartProducts])

const handleSetPaymentIntent = useCallback((val:string|null)=>{

setPaymentIntent(val);
localStorage.setItem('eshopPaymentIntent', JSON.stringify(val))


},[paymentIntent])

const value= {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleQtyIncrease,
    handleQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent


}
    return <CartContext.Provider value={value}  {...props}/>
}
// create useCart hook
export const useCart = ()=>{
const context = useContext(CartContext)
 
if(context===null){
    throw new Error("useCart must be used within a CartContextProvider")
}

return context
}