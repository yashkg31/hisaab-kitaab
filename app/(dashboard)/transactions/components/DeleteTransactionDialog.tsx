import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DeleteTransaction } from '../../_actions/transactions';

interface Props {
    open: boolean,
    setOpen: (open: boolean) => void,
    transactionId: string
}

function DeleteTransactionDialog({ open, setOpen, transactionId }: Props) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteTransaction,
        onSuccess: async () => {
            toast.success("Transaction deleted successfully!", {
                id: "delete-transaction"
            })
            await queryClient.invalidateQueries({
                queryKey: ["transactions"]
            })
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: "delete-transaction"
            })
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
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
                            toast.loading("Deleting Transaction...", {
                                id: "delete-transaction"
                            })
                            deleteMutation.mutate(transactionId)
                        }}>
                            Yes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteTransactionDialog