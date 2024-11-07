import React from "react";
import { useNavigate } from 'react-router-dom';
import CustomButton from "@/components/custom/Button";
import checkGIF from "@/assets/check.gif";
import { BookingCTX } from '@/contexts/BookingContext';

const BookingConfirmation = () => {
    const navigate = useNavigate();
    const { handleReset } = React.useContext(BookingCTX);

    React.useEffect(() => handleReset());

    return (
        <div className="min-h-[100dvh] flex justify-center items-center px-5 py-10">
            <div className="w-96 px-6 py-10 rounded-lg bg-white flex flex-col items-center mx-auto text-center">
                <div className="w-36 h-36">
                    <img src={checkGIF} alt="checkIcon" width={200} height={100} />
                </div>
                <h2 className="font-semibold text-lg mb-3">Payment Confirmed!</h2>
                <p className="text-gray-500 text-sm md:text-base">Thank you for choosing abitto.</p>
                <p className="text-gray-500 text-sm md:text-base">Please check your email for your ticket.</p>
                <CustomButton
                    className="w-full mt-10"
                    onClick={() => navigate("/booking")}
                >
                    Continue
                </CustomButton>
            </div>
        </div>
    )
}

export default BookingConfirmation
