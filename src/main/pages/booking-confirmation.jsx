import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api';
import { Loader2 } from 'lucide-react';
import TicketInvoice from '@/components/TicketInvoice';
import { useReactToPrint } from "react-to-print";
import { BookingCTX } from '@/contexts/BookingContext';

const BookingConfirmation = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(search.split("?")[1]);
    const searchObj = {}
    for (const [key, value] of searchParams.entries()) {
        searchObj[key] = value;
    }
    const { handleReset } = React.useContext(BookingCTX)

    const confirmBooking = async () => {
        sessionStorage.removeItem("cus_info")
        handleReset();
        try {
            const reference = searchObj.reference
            const response = await axiosInstance.post("/booking/trx", {
                trxRef: reference,
            });
            return response.data.booking;
        }
        catch {
            setTimeout(() => {
                navigate("/booking")
            }, 6000);
            return false;
        }
    }

    const { isPending, isSuccess, data: currentUser } = useQuery({
        queryKey: ["confirm"],
        queryFn: confirmBooking
    });

    const componentRef = React.useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Abitto Ticket - ${currentUser?.ticket_id}`,
    });

    React.useEffect(() => {
        if (isSuccess && currentUser) handlePrint();
    }, [isSuccess, currentUser, handlePrint])

    return (
        <div className='px-5 pt-32 pb-20 text-center'>
            {isPending ?
                <div className="h-36 text-sm md:text-base flex justify-center items-center">
                    <p>Please wait while we confirm your payment <Loader2 className="animate-spin inline-flex" size={18} /></p>
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
