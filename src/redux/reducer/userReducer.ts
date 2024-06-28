import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserReducerInitalState } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState:UserReducerInitalState={
    user:null,
    loading:true
}

export const userReducer=createSlice({
    name:"userReducer",
    initialState,
    reducers:{
        userExists:(state,action:PayloadAction<User>)=>{
            state.user=action.payload;
            state.loading=false;
        },
        userNotExists:(state)=>{
            state.user=null;
            state.loading=false;
        }
    }
})


export const {userExists, userNotExists}=userReducer.actions;