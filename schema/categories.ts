import zod from "zod";

export const categorySchema = zod.object({
    name: zod.string().min(3).max(20),
    icon: zod.string().max(20),
    type: zod.enum(["income", "expense"])
})

export type categorySchemaType = zod.infer<typeof categorySchema>

export const DeleteCategorySchema = zod.object({
    name: zod.string().min(3).max(20),
    type: zod.enum(["income", "expense"])
})

export type DeletecategorySchemaType = zod.infer<typeof DeleteCategorySchema>