import React from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import { Button } from '@/components/ui/button';

function AI_Output({ openDialog, outputResult, closeDialog }) {
    return (
        <AlertDialog open={openDialog}>
            <AlertDialogContent
                className="max-w-[90vw] md:max-w-[60vw] max-h-[90vh] overflow-y-auto p-4 rounded-lg shadow-lg"
            >
                <AlertDialogHeader className='flex justify-between'>
                    <AlertDialogTitle>Result:</AlertDialogTitle>
                </AlertDialogHeader>

                {/* Before-After Image Slider */}
                <ReactBeforeSliderComponent
                    firstImage={{ imageUrl: outputResult?.aiImage }}
                    secondImage={{ imageUrl: outputResult?.orgImage }}
                    className="before-after-slider-actual"
                />
                <Button onClick={() => closeDialog(false)}>Close</Button>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default AI_Output;
