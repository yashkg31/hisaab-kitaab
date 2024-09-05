'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Category } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ReactNode } from "react"
import { toast } from "sonner"
import { DeleteCategory } from "../_actions/categories"

interface Props {
    trigger: ReactNode,
    category: Category
}

function DeleteCategoryDialogue({trigger, category} : Props) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success("Category deleted successfully!", {
                id: "delete-category"
            })
            await queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: "delete-category"
            })
        }
    })

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="flex-col justify-center w-auto px-10">
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you sure?
                </AlertDialogTitle>
                <AlertDialogFooter className="gap-2 pt-3">
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        toast.loading("Deleting Category...", {
                            id: "delete-category"
                        })
                        deleteMutation.mutate({
                            name: category.name,
                            type: category.type as "income" | "expense"
                        })
                    }}>
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogHeader>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCategoryDialogue 