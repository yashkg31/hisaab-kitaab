'use server'

import prisma from "@/lib/prisma";
import { TransactionSchema, TransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form:TransactionSchemaType) {
    const parsedBody = TransactionSchema.safeParse(form);
    if(! parsedBody.success){
        throw new Error;
    }

    const user = await currentUser();
    if(!user) redirect("/sign-in");

    const {amount, category, date, description, type} = parsedBody.data;
    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category
        }
    })

    if(!categoryRow){
        throw new Error;
    }

    await prisma.$transaction([
        prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                date,
                type,
                description: description || "",
                category: categoryRow.name,
                categoryIcon: categoryRow.icon
            }
        }),

        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },

            create: {
                userId :user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },

            update: {
                expense:{
                    increment: type === "expense" ? amount : 0
                },
                income:{
                    increment: type === "income" ? amount : 0
                }
            }
        }),

        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },

            create: {
                userId :user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },

            update: {
                expense:{
                    increment: type === "expense" ? amount : 0
                },
                income:{
                    increment: type === "income" ? amount : 0
                }
            }
        })
    ])
}

export async function DeleteTransaction(id: string){
    const user = await currentUser();
    if(!user){
        redirect("/sign-in");
    }

    const transaction = await prisma.transaction.findUnique({
        where:{
            id,
            userId: user.id
        }
    })

    if(!transaction){
        throw new Error("bad request");
    }

    const {date, type, amount} = transaction;

    await prisma.$transaction([
        prisma.transaction.delete({
            where: {
                id,
                userId: user.id
            }
        }),

        prisma.monthHistory.update({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },
            data: {
                ...(type === "expense" && {
                    expense: {
                        decrement: amount
                    }
                }),
                ...(type === "income" && {
                    income: {
                        decrement: amount
                    }
                }),
            }
        }),

        prisma.yearHistory.update({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },
            data:{
                ...(type === "expense" && {
                    expense: {
                        decrement: amount
                    }
                }),
                ...(type === "income" && {
                    income: {
                        decrement: amount
                    }
                }),
            }
        })
    ])
}