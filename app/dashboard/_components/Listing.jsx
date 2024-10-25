"use client";
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import EmptyState from './EmptyState';
import Link from 'next/link';
import { db } from '@/config/db';
import { AIGeneratedImage } from '@/config/schema';
import { eq } from 'drizzle-orm';
import RoomDesignCard from './RoomDesignCard';

function Listing() {
    const { user } = useUser();
    const [userRoomList, setUserRoomList] = useState([]);

    useEffect(() => {
        if (user) GetUserRoomList();
    }, [user]);

    const GetUserRoomList = async () => {
        const result = await db
            .select()
            .from(AIGeneratedImage)
            .where(eq(AIGeneratedImage.userEmail, user?.primaryEmailAddress?.emailAddress));
        console.log(result);
        setUserRoomList(result);
    };

    return (
        <div className="p-4">
            <div className="flex sm: flex-col md:flex-col items-center justify-between mb-5">
                <h2 className="font-bold text-3xl">Hello, {user?.fullName}</h2>
                <Link href="/dashboard/create-new">
                    <Button>+ Design Interior</Button>
                </Link>
            </div>

            {!userRoomList?.length ? (
                <EmptyState />
            ) : (
                <div className='mt-10'>
                    <h2 className='font-medium text-lg text-primary mb-10'>AI Room Studio</h2>
                    {/* Responsive grid for room listings */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-5">
                        {userRoomList?.map((room, index) => (
                            <RoomDesignCard key={index} room={room} />
                        ))}
                    
                    </div>
                </div>
            )}
        </div>
    );
}

export default Listing;
