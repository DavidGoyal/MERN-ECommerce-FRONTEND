import { CartItem, ShippingInfo, User } from "./types";

export interface UserReducerInitalState{
    user:User|null,
    loading:boolean,
}


export interface CartReducerInitalState{
    loading:boolean,
    cartItems:CartItem[],
    subTotal:number,
    tax:number,
    shippingCharges:number,
    discount:number,
    total:number,
    shippingInfo:ShippingInfo|null,
    isRefetch:boolean
}