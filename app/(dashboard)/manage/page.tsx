'use client'

import { CurrencyComboBox } from '@/components/CurrencyComboBox'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import CategoryDialog from '../_components/CategoryDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Category } from '@prisma/client'
import DeleteCategoryDialogue from '../_components/DeleteCategoryDialogue'

function ManagePage() {
  return (<>
    <div className="border-b bg-card">
        <div className='container flex flex-wrap justify-between items-center gap-6 py-8'>
            <div>
                <p className="text-3xl font-bold">
                    Manage
                </p>
                <p className="text-muted-foreground">
                    Manage your account settings and category
                </p>
            </div>
        </div>
    </div>

    <div className='container flex flex-col gap-4 p-4'>
        <Card>
            <CardHeader>
                <CardTitle>
                    Currency
                </CardTitle>
                <CardDescription>
                    Set your default currency for transaction
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CurrencyComboBox />
            </CardContent>
        </Card>
        <CategoryList type={"income"} />
        <CategoryList type={"expense"} />
    </div>
  </>
  )
}

export default ManagePage;

function CategoryList({type} : {type: "income" | "expense"}){
    const categoryQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then(res => res.json())
    })

    const dataAvailable = categoryQuery.data && categoryQuery.data.length > 0;

    return(
        <SkeletonWrapper isLoading={categoryQuery.isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between gap-2'>
                        <div className='flex items-center gap-2'>
                            {type === "expense" ? <TrendingDown className='h-12 w-12 items-center rounded-lg p-2 text-[#ff4a4a] bg-[#671b1b]' /> : <TrendingUp className='h-12 w-12 items-center rounded-lg p-2 text-[#28ff61] bg-[#165126]' />}
                            <div className='text-xl'>
                                {type === "income" ? "Income" : "Expense"} categories
                                <div className='text-sm text-muted-foreground'>
                                    Sorted by name
                                </div>
                            </div>
                        </div>

                        <CategoryDialog
                            type={type}
                            successCallback={() => categoryQuery.refetch()}
                            trigger={
                                <Button className='gap-2 text-sm'>
                                    <PlusSquare className='h-4 w-4' />
                                    Create Category
                                </Button>
                            }
                        />
                    </CardTitle>
                </CardHeader>
                <Separator />
                {!dataAvailable && (
                    <div className='flex h-40 w-full flex-col items-center justify-center'>
                        <p>
                            No
                            <span className={cn(
                                "m-1",
                                type === "income" ? "text-[#28ff61]" : "text-[#ff4a4a]"
                            )}>{type}</span>
                            categories yet
                        </p>
                        <p className='text-muted-foreground text-sm'>
                            Create one to get started
                        </p>
                    </div>
                )}
                {dataAvailable && (
                    <div className='grid grid-flow-row gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {categoryQuery.data.map((cat : Category) => (
                            <CategoryCard category={cat} key={cat.name} />
                        ))}
                    </div>
                )}
            </Card>
        </SkeletonWrapper>
    )
}

function CategoryCard({category}:{category:Category}){
    return(
        <div className='flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]'>
            <div className='flex flex-col items-center gap-2 p-4'>
                <span className='text-3xl' role='img'>
                    {category.icon}
                </span>
                <span className=''>
                    {category.name}
                </span>
            </div>
            <DeleteCategoryDialogue trigger={
                <Button className='flex w-full border-separate items-center rounded-t-none bg-secondary text-muted-foreground hover:bg-red-500/20 pb-0.5'>
                <TrashIcon className='h-4 mb-0.5' /> Remove
            </Button>
            } category={category} />
        </div>
    )
}