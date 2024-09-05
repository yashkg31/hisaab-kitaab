'use client'

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TransactionSchema, TransactionSchemaType } from "@/schema/transaction";
import React, { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

interface Props{
    trigger: ReactNode;
    type: "income" | "expense"
}

export function TransactionDialog({ trigger, type}: Props) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const form = useForm<TransactionSchemaType>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            type,
            date: new Date()
        }
    })

    const handleCategoryChange = useCallback((value:string) => {
        form.setValue("category", value);
    }, [form])

    const {mutate, isPending} = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully!", {
                id: "create-transaction"
            })

            form.reset({
                type,
                description: "",
                amount: 0,
                date: new Date(),
                category: undefined
            })

            queryClient.invalidateQueries({
                queryKey: ["overview"]
            })
            setOpen(prev => !prev)
        }
    })

    const onSubmit = useCallback((values : TransactionSchemaType) => {
        toast.loading("Creating transaction...", {
            id: "create-transaction"
        })
        mutate({
            ...values,
            date: DateToUTCDate(values.date)
        })
    }, [mutate])

    return(
        <Dialog open = {open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="w-[90%] sm:w-full">
                <DialogHeader>
                    <DialogTitle>
                        Create a new{""}
                        <span className={cn(
                            "m-1",
                            type === "income" ? "text-[#28ff61]" : "text-[#ff4a4a]"
                        )}>
                            {type}
                        </span>{""}
                        transaction.
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name= "description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Description (optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>

                        <FormField
                            control={form.control}
                            name= "amount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Amount
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" defaultValue={0} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>

                        <div className="flex flex-col justify-between gap-2">
                            <FormField
                                control={form.control}
                                name= "category"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Category
                                        </FormLabel>
                                        <FormControl>
                                            <CategoryPicker type={type} onChange={handleCategoryChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            >
                            </FormField>

                            <FormField
                                control={form.control}
                                name= "date"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Transaction Date
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[180px] ml-5 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : (
                                                            <span> Pick a Date </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto">
                                                <Calendar 
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={
                                                        (value) => {
                                                            if(!value) return;
                                                            field.onChange(value);
                                                        }
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >
                            </FormField>
                        </div>
                    </form>
                </Form>

                <DialogFooter className='gap-2'>
                    <DialogClose asChild>
                        <Button type='button' variant={'secondary'} onClick={
                            () => {
                                form.resetField("description");
                                form.resetField("amount");
                                form.resetField("category");
                                form.resetField("date");
                            }
                        }>
                        Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                        {!isPending && "Create"}
                        {isPending && <Loader2 className=' animate-spin' />}
                    </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}