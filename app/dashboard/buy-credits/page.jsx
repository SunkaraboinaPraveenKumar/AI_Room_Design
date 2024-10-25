"use client";
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { db } from '@/config/db';
import { Users } from '@/config/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import React, { useState, useContext } from 'react';

function BuyCredits() {
    const router = useRouter();
    const Options = [
        { id: 1, price: 200, credits: 20 },
        { id: 2, price: 100, credits: 10 },
        { id: 3, price: 50, credits: 5 },
    ];

    const paymentOptions = [
        { id: 'upi', name: 'UPI', icon: '📱' },
        { id: 'paypal', name: 'PayPal', icon: '💳' },
        { id: 'credit-card', name: 'Mobile Banking', icon: '🏦' },
    ];

    const [selectedOption, setSelectedOption] = useState();
    const [selectedPayment, setSelectedPayment] = useState();
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext); // Access user details from context

    const handlePurchase = async () => {
        if (!selectedOption || !selectedPayment) {
            alert("Please select a credit and payment option.");
            return;
        }

        try {
            // Update user's credits in the database
            const selectedCredits = Options.find(option => option.id === selectedOption)?.credits || 0;
            const result = await db
                .update(Users)
                .set({ credits: Number(userDetail?.credits || 0) + selectedCredits })
                .where(eq(Users?.email, user?.primaryEmailAddress?.emailAddress))
                .returning({ credits: Users.credits });

            alert(`Successfully added ${selectedCredits} credits!`);
            router.replace("/dashboard")
        } catch (error) {
            alert("Failed to add credits. Please try again.");
            console.error("Credit update error:", error);
        }
    };

    return (
        <div className="min-h-screen p-5 sm:p-10 md:px-20 lg:px-40 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6">
                Add More Credits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 mb-10">
                {/* Credit Options */}
                <div className="space-y-5">
                    {Options.map((option) => (
                        <div
                            key={option.id}
                            className={`p-4 md:p-6 border text-center rounded-lg cursor-pointer transition-transform 
                                ${selectedOption === option.id ? 'bg-black text-white scale-105' : 'bg-primary text-white'}`}
                            onClick={() => setSelectedOption(option.id)}
                        >
                            <h2 className="text-lg sm:text-xl md:text-2xl">
                                Get {option.credits} Credits = {option.credits} Designs.
                            </h2>
                            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl">
                                ₹{option.price}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* Payment Options */}
                <div className="flex flex-col items-center">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
                        Select Payment Method
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {paymentOptions.map((payment) => (
                            <div
                                key={payment.id}
                                className={`p-4 w-28 h-28 flex flex-col items-center justify-center border rounded-lg cursor-pointer transition-transform
                                    ${selectedPayment === payment.id ? 'bg-blue-600 text-white scale-105' : 'bg-gray-200 text-black'}`}
                                onClick={() => setSelectedPayment(payment.id)}
                            >
                                <span className="text-3xl sm:text-4xl">{payment.icon}</span>
                                <h3 className="font-semibold mt-2 text-sm sm:text-base">
                                    {payment.name}
                                </h3>
                            </div>
                        ))}
                    </div>

                    {/* Show selected payment option */}
                    {selectedPayment && (
                        <div className="mt-4 text-lg">
                            <p className="font-semibold text-gray-700">
                                You selected: {selectedPayment.toUpperCase()}
                            </p>
                        </div>
                    )}

                    {/* Purchase Button */}
                    {selectedOption && selectedPayment && (
                        <button
                            className="mt-6 p-3 sm:p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            onClick={handlePurchase}
                        >
                            Confirm Purchase
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BuyCredits;
