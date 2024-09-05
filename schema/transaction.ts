import zod from "zod";

export const TransactionSchema = zod.object({
    amount: zod.coerce.number().positive().multipleOf(0.01),
    description : zod.string().optional(),
    date: zod.coerce.date(),
    category: zod.string(),
    type: zod.union([
        zod.literal("income"),
        zod.literal("expense")
    ])
})

export type TransactionSchemaType = zod.infer<typeof TransactionSchema>