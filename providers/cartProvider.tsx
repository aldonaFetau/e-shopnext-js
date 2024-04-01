"use client"

import { CartContextProvider } from "@/hooks/useCart";

interface CartProviderProps{
    children:React.ReactNode //different components in our application that we wrap with CartProvider
}
const CartProvider:React.FC<CartProviderProps>= ({children}) => {
    return (<CartContextProvider >{children}</CartContextProvider> );
}
 
export default CartProvider; //wrap the app in layout.tsx with CartProvider so you can access the cart context all over the application