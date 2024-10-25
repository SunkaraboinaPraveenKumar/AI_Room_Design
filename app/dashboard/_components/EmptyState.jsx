import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function EmptyState() {
    return (
        <div className='flex items-center mt-10 justify-center flex-col'>
            <Image src={"/placeholder.png"} height={200} width={200} alt='img' />
            <h2 className='text-lg font-medium text-gray-500'>Create New AI Interior Design for Your Room</h2>
            <Link href={"/dashboard/create-new"}>
                <Button className="mt-5">+ Design Room</Button>
            </Link>
        </div>
    )
}

export default EmptyState