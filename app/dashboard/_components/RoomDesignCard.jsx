"use client"
import React, { useState } from 'react';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import AI_Output from './AI_Output';

function RoomDesignCard({ room }) {
    const [openDialog, setOpenDialog] = useState(false);
    const onClickHandler = () => {
        setOpenDialog(true);
    }
    return (
        <>
            <div className='shadow-md rounded-md cursor-pointer' onClick={() => onClickHandler()}>
                <ReactBeforeSliderComponent
                    firstImage={{ imageUrl: room?.aiImage }}
                    secondImage={{ imageUrl: room?.orgImage }}
                    className="before-after-slider-actual"
                />
                <div className='p-4'>
                    {/* Room Type with Emoji */}
                    <h2 className='text-primary flex items-center space-x-2 text-lg font-semibold'>
                        <span>🛏️</span>
                        <span className='text-blue-600'>Room Type: {room.roomType}</span>
                    </h2>

                    {/* Design Type with Emoji */}
                    <h2 className='text-primary flex items-center space-x-2 text-lg font-semibold mt-2'>
                        <span>🎨</span>
                        <span className='text-purple-600'>Design Type: {room.designType}</span>
                    </h2>
                </div>
            </div>
            <AI_Output outputResult={room} openDialog={openDialog} closeDialog={() => setOpenDialog(false)} />
        </>
    );
}

export default RoomDesignCard;
