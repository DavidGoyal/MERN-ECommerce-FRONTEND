/* eslint-disable no-useless-catch */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { CategoryResponse, MessageResponse, NewProductInput, ProductDetailsResponse, ProductResponse, SearchInput, SearchResponse, UpdateProductInput } from "../../types/api-types"


export const productApi=createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/product/`}),
    tagTypes:["Product"],
    endpoints:(builder)=>({
        latestProducts:builder.query<ProductResponse,string>({
            query:()=>`latest`,
            providesTags:["Product"]
        }),
        allCategories:builder.query<CategoryResponse,void>({
            query:()=>`categories`,
            providesTags:["Product"]
        }),
        allProducts:builder.query<ProductResponse,string>({
            query:(id)=>`admin-products?id=${id}`,
            providesTags:["Product"]
        }),
        searchProducts:builder.query<SearchResponse,SearchInput>({
            query:({sort,page,category,price,search})=>{
                let url=`all?search=${search}&page=${page}&price=${price}`;

                if(category){
                    url+=`&category=${category}`
                }
                if(sort){
                    url+=`&sort=${sort}`
                }
                
                return url
            },
            providesTags:["Product"]
        }),
        productDetails:builder.query<ProductDetailsResponse,string>({
            query:(id)=>`${id}`,
            providesTags:["Product"]
        }),
        newProduct:builder.mutation<MessageResponse,NewProductInput>({
            query:({formData,id})=>({
                url:`new?id=${id}`,
                method:"POST",
                body:formData
            }),
            invalidatesTags:["Product"]
        }),
        updateProduct:builder.mutation<MessageResponse,UpdateProductInput>({
            query:({formData,id,userId})=>({
                url:`${id}?id=${userId}`,
                method:"PUT",
                body:formData
            }),
            invalidatesTags:["Product"]
        }),
        deleteProduct:builder.mutation<MessageResponse,{id:string,userId:string}>({
            query:({id,userId})=>({
                url:`${id}?id=${userId}`,
                method:"DELETE"
            }),
            invalidatesTags:["Product"]
        })
    })
})





export const {
	useLatestProductsQuery,
	useAllCategoriesQuery,
	useAllProductsQuery,
	useSearchProductsQuery,
	useNewProductMutation,
	useProductDetailsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productApi;