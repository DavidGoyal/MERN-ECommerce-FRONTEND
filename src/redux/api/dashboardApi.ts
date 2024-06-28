import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BarResponse, DashboardResponse, LineResponse, PieResponse } from "../../types/api-types";



export const dashboardApi=createApi({
    reducerPath:"dashboardApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/dashboard/`}),
    tagTypes:["Order"],
    endpoints:(builder)=>({
        getDashboard:builder.query<DashboardResponse,string>({
            query:(id)=>`stats?id=${id}`,
            keepUnusedDataFor:0
        }),
        getPie:builder.query<PieResponse,string>({
            query:(id)=>`pie?id=${id}`,
            keepUnusedDataFor:0
        }),
        getBar:builder.query<BarResponse,string>({
            query:(id)=>`bar?id=${id}`,
            keepUnusedDataFor:0
        }),
        getLine:builder.query<LineResponse,string>({
            query:(id)=>`line?id=${id}`,
            keepUnusedDataFor:0
        }),
    })
})


export const {useGetDashboardQuery,useGetPieQuery,useGetBarQuery,useGetLineQuery} = dashboardApi;