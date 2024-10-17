import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api';
import { customError } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import TicketInvoice from '@/components/TicketInvoice';
import { useReactToPrint } from "react-to-print";

const BookingConfirmation = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(search.split("?")[1]);
    const searchObj = {}
    for (const [key, value] of searchParams.entries()) {
        searchObj[key] = value;
    }

    const verifyPayment = async () => {
        sessionStorage.removeItem("cus_info")
        try {
            const reference = searchObj.reference
            const response = await axiosInstance.get("/paystack/verify", { reference })
            const { status } = response.data;
            if (status) {
                const response = await axiosInstance.post("/booking/trx", {
                    trxRef: reference,
                });
                handlePrint();
                return response.data.booking;
            }
            setTimeout(() => {
                navigate("/booking")
            }, 2000);
            return false;
        }
        catch (error) {
            customError(error, "'Confirmation failed.' { description: 'Please Contact us to verify your booking before your scheduled departure time.' }")
            return false;
        }
    }

    const { isPending, isSuccess, data: currentUser } = useQuery({
        queryKey: ["verify"],
        queryFn: verifyPayment
    });

    const componentRef = React.useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Abitto Ticket - ${currentUser?.ticket_id}`,
    });

    return (
        <div className='px-5 pt-32 pb-20 text-center'>
            {isPending ?
                <div className="h-36 text-sm md:text-base flex justify-center items-center">
                    <p>Please wait while we verify your payment <Loader2 className="animate-spin inline-flex" size={18} /></p>
                </div> :
                <>
                    {isSuccess && currentUser ?
                        <TicketInvoice props={{ currentUser }} ref={componentRef} />
                        :
                        <div className="font-poppins mx-auto p-5 md:p-10 w-full max-w-[450px] bg-white flex flex-col items-center rounded-lg">
                            <h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">Invalid transaction reference</h2>
                            <p className="font-normal text-xs md:text-sm text-[#454545] mb-5 md:mb-10">If your payment was successful, Please contact us for verification before your scheduled departure time.</p>
                            <p className='inline-flex gap-2 items-center text-xs md:text-sm text-[#454545]'>Redirecting <Loader2 className="animate-spin" size={16} /></p>
                        </div>}
                </>
            }
        </div >
    )
}

export default BookingConfirmation;
