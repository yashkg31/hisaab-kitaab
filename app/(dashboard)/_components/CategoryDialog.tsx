import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { categorySchema, categorySchemaType } from '@/schema/categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleOff, Loader2, PlusSquare } from 'lucide-react'
import React, { ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Picker, {} from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateCategory } from '../_actions/categories'
import { Category } from "@prisma/client";
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

interface Props{
    type: "income" | "expense";
    successCallback : (category: Category) => void,
    trigger?: ReactNode
}

function CategoryDialog({type, successCallback, trigger} : Props) {
    const theme = useTheme();
    const [open, setOpen] = useState(false)
    const form = useForm<categorySchemaType>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            type,
        }
    })

    const queryClient = useQueryClient();

    const {mutate , isPending} = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data: Category) => {
            form.reset({
                name:"",
                icon: "",
                type
            });

            toast.success(`Category ${data.name} created successfully!`, {
                id: 'createCategory'
            })

            successCallback(data);

            await queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: 'createCategory'
            })
        }
    })

    const onSubmit = useCallback((values : categorySchemaType) => {
        toast.loading("Creating category...", {
            id: 'createCategory'
        })
        mutate(values)
    }, [mutate])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {trigger ? trigger : (
                  <Button
                      variant={"ghost"}
                      className='flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground'
                  >
                      <PlusSquare className='mr-2 h-4 w-4'></PlusSquare>
                      Create New
                  </Button>
            )}
        </DialogTrigger>
        <DialogContent className='w-[90%] sm:w-full'>
            <DialogHeader>
                <DialogTitle>
                      Create
                      <span className={cn(
                          "m-1",
                          type === "income" ? "text-[#28ff61]" : "text-[#ff4a4a]"
                      )}>
                          {type}
                      </span>category
                </DialogTitle>
                <DialogDescription>
                    Categories are used to group your transactions
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                      <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>
                                      Name
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
                          name="icon"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>
                                      Select Icon
                                  </FormLabel>
                                  <FormControl>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className='w-full h-[80px]'
                                            >
                                                {form.watch('icon') ? (
                                                    <div className='flex felx-col items-center gap-2'>
                                                        <span className='text-4xl' role='img'>
                                                            {field.value}
                                                        </span>
                                                        <p className='text-muted-foreground'>
                                                            Click to change
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className='flex felx-col items-center gap-2'>
                                                        <CircleOff className='h-[80%] w-[45px]' />
                                                        <p className='text-muted-foreground'>
                                                            Click to select
                                                        </p>
                                                    </div>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-full'>
                                            <Picker data={data} theme={theme.resolvedTheme}
                                                onEmojiSelect={( e : {native: string} )=> {
                                                    field.onChange(e.native)
                                                }}
                                                autoFocus= "true"
                                                previewPosition='none'
                                                navPosition='bottom'
                                            ></Picker>
                                        </PopoverContent>
                                      </Popover>
                                  </FormControl>
                              </FormItem>
                          )}
                      >
                      </FormField>
                </form>
            </Form>
            <DialogFooter className='gap-2'>
                <DialogClose asChild>
                    <Button type='button' variant={'secondary'} onClick={
                        () => {
                            form.resetField("icon");
                            form.resetField("name");
                            form.resetField("type");
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

export default CategoryDialog