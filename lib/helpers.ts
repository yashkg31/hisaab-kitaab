import { currencies } from "./currencies"

export function DateToUTCDate(date : Date){
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )
    )
}

export function GetFormatterForCurrency(currency: string){
    const local = currencies.find(c => c.value === currency)?.local;

    return new Intl.NumberFormat(local, {
        style: "currency",
        currency
    })
}