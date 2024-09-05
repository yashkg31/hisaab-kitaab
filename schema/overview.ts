import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import zod from "zod";

export const OverviewQuerySchema = zod.object({
    from: zod.coerce.date(),
    to: zod.coerce.date()
})
.refine((args) => {
    const {from, to} = args;
    const days = differenceInDays(to, from)

    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isValidRange
})