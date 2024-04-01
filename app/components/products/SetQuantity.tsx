"use client"
//this component is used in cart component and in product details
import { CartProductType } from "@/app/product/[productid]/ProductDetails";

interface setQtyProps{

    cartCounter?:boolean // determine if we are at cart quantity or at product quantity
    cartProduct: CartProductType,
    handleQtyIncrease:() => void,
    handleQtyDecrease:() => void,

}
const btnStyle='border-[1.2px] border-slate-300 px-2 rounded'
const SetQuantity:React.FC<setQtyProps> = ({
    cartCounter, cartProduct, handleQtyIncrease, handleQtyDecrease

}) => {
    return ( <div className="flex gap-8 items-center">
              {cartCounter ? null : <div className="font-semibold">QUANTITY:</div>}
<div className="flex gap-4 items-center text-base">
    <button className={btnStyle} onClick={handleQtyDecrease}>-</button>
    <div>{cartProduct.qty}</div>
    <button className={btnStyle} onClick={handleQtyIncrease}>+</button>
</div>
            </div> );
}
 
export default SetQuantity;