import { Bar, CartItem, Line, Order, Pie, Product, ShippingInfo, Stats, User } from "./types"

export type MessageResponse={
    success:boolean,
    message:string
}

export type UserResponse={
    success:boolean,
    user:User
}

export type AllUsersResponse={
    success:boolean,
    users:User[]
}


export type ProductResponse={
    success:boolean,
    products:Product[]
}

export type ProductDetailsResponse={
    success:boolean,
    product:Product
}


export type CategoryResponse={
    success:boolean,
    categories:string[]
}


export type SearchResponse={
    success:boolean,
    products:Product[],
    totalPage:number
}

export type SearchInput={
    search?:string,
    category?:string,
    page?:number,
    sort?:string,
    price?:number
}

export type NewProductInput={
    id:string,
    formData:FormData
}


export type UpdateProductInput={
    id:string,
    formData:FormData,
    userId:string
}


export type NewOrderRequest={
    shippingInfo:ShippingInfo,
    orderItems:CartItem[],
    subTotal:number,
    tax:number,
    shippingCharges:number,
    discount:number,
    total:number,
    user:string
}



export type MyOrdersRequest={
    success:boolean,
    orders:Order[]
}

export type SingleOrderRequest={
    success:boolean,
    order:Order
}


export type DashboardResponse={
    success:boolean,
    stats:Stats
}


export type PieResponse={
    success:boolean,
    charts:Pie
}


export type BarResponse={
    success:boolean,
    charts:Bar
}


export type LineResponse={
    success:boolean,
    charts:Line
}