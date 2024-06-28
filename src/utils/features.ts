import moment from "moment"

export const getLastMonths=()=>{
    const currentDate=moment();

    currentDate.date(1);

    const lastSixMonths:string[]=[];
    const lastTwelveMonths:string[]=[];

    for (let index = 0; index < 6; index++) {
        const monthDate=currentDate.clone().subtract(index,"months");
        const monthName=monthDate.format("MMMM");

        lastSixMonths.unshift(monthName);
    }

    for (let index = 0; index < 12; index++) {
        const monthDate=currentDate.clone().subtract(index,"months");
        const monthName=monthDate.format("MMMM");

        lastTwelveMonths.unshift(monthName);
    }

    return{
        lastSixMonths,
        lastTwelveMonths
    }
}