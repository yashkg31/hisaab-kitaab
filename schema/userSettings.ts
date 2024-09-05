import { currencies } from "@/lib/currencies";
import  zod  from "zod";

export const updateUserCurrencySchema = zod.object({
    currency: zod.custom((value) => {
        const found = currencies.some(c => c.value === value);
        if(!found){
            throw new Error(`invalid currency: ${value}`);
        }
        return value;
    })
})