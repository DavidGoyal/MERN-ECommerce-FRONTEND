export type User={
    name:string,
    email:string,
    photo:string,
    gender:string,
    dob:string,
    _id:string,
    role:string
}


export type Product={
    name:string,
    price:number,
    stock:number,
    photo:string,
    _id:string,
    category:string
}


export type CustomError={
    status:number,
    data:{
        success:boolean,
        message:string
    }
}


export type ShippingInfo={
    address:string,
    city:string,
    state:string,
    country:string,
    pinCode:string
}


export type CartItem={
    productId:string,
    name:string,
    price:number,
    photo:string,
    quantity:number,
    stock:number
}


export type OrderItem={
    productId:string,
    name:string,
    price:number,
    photo:string,
    quantity:number,
    _id:string
}



export type Order={
    _id:string,
    subTotal:number,
    tax:number,
    shippingCharges:number,
    discount:number,
    total:number,
    orderItems:OrderItem[],
    status:string,
    user:{
        name:string,
        _id:string
    },
    shippingInfo:ShippingInfo
}


type LatestTransaction={
    _id:string,
    amount:number,
    discount:number,
    quantity:number,
    status:string
}


export type Stats={
    users:{
        count:number,
        percentage:number
    },
    products:{
        count:number,
        percentage:number
    },
    orders:{
        count:number,
        percentage:number
    },
    revenue:{
        count:number,
        percentage:number
    },
    chart:{
        order:number[],
        revenue:number[]
    },
    categoryCount:Record<string,number>[]
    userRatio:{
        male:number,
        female:number
    },
    latestTransactions:LatestTransaction[]
}


export type Pie={
    orderFullfillment: {
        processing: number;
        shipped: number;
        delivered: number;
    },
    productCategories: Record<string, number>[],
    stockAvailability: {
        inStock: number;
        outOfStock: number;
    },
    revenueDistribution: {
        netMargin: number;
        discount: number;
        productionCost: number;
        burnt: number;
        marketingCost: number;
    },
    usersAgeGroup: {
        teen: number;
        adult: number;
        old: number;
    },
    adminCustomers: {
        admin: number;
        customer: number;
    }
}


export type Bar={
    users:number[],
    products:number[],
    orders:number[]
}



export type Line={
    users:number[],
    products:number[],
    discount:number[],
    revenue:number[]
}