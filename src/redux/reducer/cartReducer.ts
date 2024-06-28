import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartReducerInitalState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState:CartReducerInitalState={
    cartItems:[],
    subTotal:0,
    tax:0,
    shippingCharges:0,
    discount:0,
    total:0,
    shippingInfo:{
        address:"",
        city:"",
        state:"",
        country:"",
        pinCode:""
    },
    loading:false,
    isRefetch:false,
}

export const cartReducer=createSlice({
    name:"cartReducer",
    initialState,
    reducers:{
        addToCart:(state,action:PayloadAction<CartItem>)=>{
            state.loading=true;
            const id=action.payload.productId;

            const isPresent=state.cartItems.findIndex((i)=>i.productId===id);

            if(isPresent!==-1){
                state.cartItems[isPresent]=action.payload;
            }
            else{
                state.cartItems.push(action.payload);
            }
            state.loading=false;
        },

        removeFromCart:(state, action:PayloadAction<string>)=>{
            state.loading=true;
            const id=action.payload;

            state.cartItems=state.cartItems.filter((i)=>i.productId!==id);

            state.loading=false;
        },

        calculatePrice:(state)=>{
            state.loading=true;
            state.subTotal=state.cartItems.reduce((acc,curr)=>acc+(curr.price*curr.quantity),0);
            state.shippingCharges=(state.subTotal<5000&&state.subTotal>0)?1000:0;
            state.tax=Math.round(0.18*state.subTotal)
            state.total=state.subTotal+state.tax+state.shippingCharges-state.discount;
            if(state.total<0) state.total=0;
            state.loading=false;
        },

        applyDiscount:(state, action:PayloadAction<number>)=>{
            state.loading=true;
            state.discount=action.payload;
            state.loading=false;
        },

        saveShippingInfo:(state, action:PayloadAction<ShippingInfo>)=>{
            state.loading=true;
            state.shippingInfo=action.payload;
            state.loading=false;
        },

        refetchProducts:(state,action:PayloadAction<boolean>)=>{
            state.isRefetch=action.payload;
        },

        resetCart:()=>initialState,
    }
})


export const {addToCart,removeFromCart,calculatePrice,applyDiscount,saveShippingInfo,resetCart,refetchProducts}=cartReducer.actions;