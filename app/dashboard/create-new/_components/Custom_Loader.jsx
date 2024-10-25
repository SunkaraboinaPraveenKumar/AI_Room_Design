import React, { useEffect } from 'react'
import Image from 'next/image';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function Custom_Loader({ isLoading }) {
    return (
        <AlertDialog open={isLoading}>
            <AlertDialogContent>
                <div className='bg-white flex flex-col items-center my-10 justify-center'>
                    <Image src={'/progress.gif'} alt='loading' width={100} height={100}/>
                </div>
                <h2 className='text-center'>Designing Your Room ... Donot Refresh!!</h2>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Custom_Loader