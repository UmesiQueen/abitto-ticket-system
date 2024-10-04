import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api';
import { customError } from '@/lib/utils';
import Button from "@/components/custom/Button";
import checkGIF from "@/assets/check.gif";
import { Loader2 } from 'lucide-react';
import TicketInvoice from '@/components/TicketInvoice';
import { useReactToPrint } from 'react-to-print';

const BookingConfirmation = () => {
    const [valid, setValid] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState();
    const { search } = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(search.split("?")[1]);
    const searchObj = {}
    for (const [key, value] of searchParams.entries()) {
        searchObj[key] = value;
    }

    React.useEffect(() => {
        sessionStorage.removeItem("cus_info")
    }, [])

    const { isPending, data, isSuccess } = useQuery({
        queryKey: ["verify"],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get("/paystack/verify", { "reference": "c2ri1bevay" })
                const { status } = response.data;
                if (status) {
                    // get ticket id from verification response
                    const response = await axiosInstance.post("/booking/querynew", {
                        ticket_id: "cc348714",
                    });
                    setValid(true);
                    return response.data.booking;
                }

                setValid(false);
                setTimeout(() => {
                    navigate("/booking")
                }, 2000);
                return null;
            }
            catch (error) {
                customError(error, "'Confirmation failed.' { description: 'Please Contact us to verify your booking before your scheduled departure time.' }")
                return null;
            }
        }
    });

    React.useEffect(() => {
        if (isSuccess)
            setCurrentUser(data)
    }, [isSuccess, data])

    const componentRef = React.useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Abitto Ticket - ${currentUser?.ticket_id}`,
    });

    return (
        <div className='px-5 pt-32 pb-20 text-center'>
            {isPending ?
                <div className="h-36 text-sm md:text-base flex justify-center items-center">
                    <p>Please wait while we your verifying payment <Loader2 className="animate-spin inline-flex" size={18} /></p>
                </div>
                :
                <div className="font-poppins mx-auto p-5 md:p-10 w-full max-w-[450px] bg-white flex flex-col items-center rounded-lg">
                    {valid ? <>
                        <div className="mx-auto w-fit">
                            <img src={checkGIF} alt="checkIcon" width={200} height={100} />
                        </div>
                        <h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">
                            Your ferry seat has been successfully booked!
                        </h2>
                        <p className="font-normal text-xs md:text-sm text-[#454545] mb-5 md:mb-10">
                            Please check your email for important ticket details.
                        </p>
                        <Button
                            text="Download ticket"
                            className="md:py-5 w-full mb-5"
                            onClick={handlePrint}
                        />
                        <Button
                            text={"Continue"}
                            variant="outline"
                            className=" md:py-5 w-full"
                            onClick={() => navigate("/booking")}
                        />
                        {currentUser &&
                            <div className="hidden">
                                <TicketInvoice props={{ currentUser }} ref={componentRef} />
                            </div>}
                    </>
                        : <>
                            <h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">Invalid transaction reference</h2>
                            <p className="font-normal text-xs md:text-sm text-[#454545] mb-5 md:mb-10">If your payment was successful, Please contact us for verification before your scheduled departure time.</p>
                            <p className='inline-flex gap-2 items-center text-xs md:text-sm text-[#454545]'>Redirecting <Loader2 className="animate-spin" size={16} /></p>
                        </>
                    }

                </div>
            }
        </div>
    )
}

export default BookingConfirmation;
