import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, MyOrdersRequest, NewOrderRequest, SingleOrderRequest } from "../../types/api-types";


export const orderApi=createApi({
    reducerPath:"orderApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/order/`}),
    tagTypes:["Order"],
    endpoints:(builder)=>({
        newOrder:builder.mutation<MessageResponse,NewOrderRequest>({
            query:(order)=>({
                url:"new",
                method:"POST",
                body:order
            }),
            invalidatesTags:["Order"]
        }),
        updateOrder:builder.mutation<MessageResponse,{id:string,userId:string}>({
            query:({id,userId})=>({
                url:`${id}?id=${userId}`,
                method:"PUT",
            }),
            invalidatesTags:["Order"]
        }),
        deleteOrder:builder.mutation<MessageResponse,{id:string,userId:string}>({
            query:({id,userId})=>({
                url:`${id}?id=${userId}`,
                method:"DELETE",
            }),
            invalidatesTags:["Order"]
        }),
        myOrders:builder.query<MyOrdersRequest,string>({
            query:(id)=>`my?id=${id}`,
            providesTags:["Order"]
        }),
        allOrders:builder.query<MyOrdersRequest,string>({
            query:(id)=>`all?id=${id}`,
            providesTags:["Order"]
        }),
        singleOrder:builder.query<SingleOrderRequest,string>({
            query:(id)=>`${id}`,
            providesTags:["Order"]
        })
    })
})


export const {
	useNewOrderMutation,
	useUpdateOrderMutation,
	useDeleteOrderMutation,
	useMyOrdersQuery,
	useAllOrdersQuery,
	useSingleOrderQuery,
} = orderApi;