'use server'

import prisma from "@/lib/prisma";
import { categorySchema, categorySchemaType, DeleteCategorySchema, DeletecategorySchemaType } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form:categorySchemaType) {
    const parsedBody = categorySchema.safeParse(form);
    if(!parsedBody.success){
        throw new Error("bad request")
    }

    const user = await currentUser();
    if(!user){
        redirect("/sign-in")
    }

    const {name, icon, type} = parsedBody.data;
    return await prisma.category.create({
        data:{
            userId: user.id,
            name,
            type,
            icon
        }
    })
}

export async function DeleteCategory(form:DeletecategorySchemaType) {
    const parsedBody = DeleteCategorySchema.safeParse(form);
    if(!parsedBody.success){
        throw new Error("bad request")
    }

    const user = await currentUser();
    if(!user){
        redirect("/sign-in")
    }

    return await prisma.category.delete({
        where:{
            name_userId_type:{
                userId: user.id,
                name: parsedBody.data.name,
                type: parsedBody.data.type
            }
        }
    })
}

