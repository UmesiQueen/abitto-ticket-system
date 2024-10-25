import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api';
import { Loader2 } from 'lucide-react';
import TicketInvoice from '@/components/TicketInvoice';
import { useReactToPrint } from "react-to-print";
import { BookingCTX } from '@/contexts/BookingContext';
import { useSearchParam } from '@/hooks/useSearchParam';
import PaystackPop from "@paystack/inline-js";

const Checkout = () => {
    const navigate = useNavigate();
    const { handleReset } = React.useContext(BookingCTX);
    const { getSearchParams } = useSearchParam();
    const searchParamValues = getSearchParams();
    const ticket_id = String(searchParamValues?.cid);
    const [popupState, setPopupState] = React.useState({ active: true, reason: "initial" });

    const redirect = () => {
        setTimeout(() => {
            navigate(`/booking/payment/?cid=${ticket_id.slice(0, 6)}`)
        }, 4500);
    }

    const resumeTransaction = async () => {
        const popup = new PaystackPop();
        const transaction = popup.resumeTransaction(searchParamValues?.access_code);

        return await new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                if (transaction.errors.length) {
                    clearInterval(intervalId);
                    popup.cancelTransaction(transaction.id);
                    setPopupState({ active: false, reason: "invalid" });
                    console.log("invalid transaction")
                    return reject(false);
                }
                if (!popup.isOpen) {
                    clearInterval(intervalId);
                    setPopupState({ active: false, reason: "verify" });
                    console.log("closed to verify")
                    return resolve(true);
                }
            }, 1000);

            // this transaction window only lasts for 10 mins
            const timeout = 60 * 1000 * 10; // 10 mins
            setTimeout(() => {
                if (popup.isOpen) {
                    clearInterval(intervalId);
                    popup.cancelTransaction(transaction.id);
                    setPopupState({ active: false, reason: "abandoned" });
                    console.log("abandoned")
                    return reject(false);
                }
            }, timeout);
        })

    }

    const verifyTransaction = async () => {
        try {
            const response = await axiosInstance.post("/booking/check", { ticket_id });
            if (response.status === 200) {
                const { data, status } = response.data;
                if (status) {
                    if (data.status === "success") {
                        const response = await axiosInstance.post("/booking/querynew", { ticket_id });
                        setPopupState({ active: false, reason: "valid" });
                        console.log("valid transaction")
                        // delete current session and states
                        sessionStorage.removeItem("cus_info");
                        handleReset();
                        return response.data.booking;
                    }
                    if (data.status === "failed") {
                        setPopupState({ active: false, reason: "failed" });
                        console.log("failed Transaction")
                        throw new Error("Transaction failed.")
                    }
                }
            }
            setPopupState({ active: false, reason: "invalid" });
            console.log("checkout unsuccessful")
            return false;
        }
        catch (error) {
            console.log(error, "verify error")
            redirect();
            return false;
        }
    }

    const { isLoading, data: currentUser } = useQuery({
        queryKey: ["checkout"],
        queryFn: async () => {
            try {
                const resume = await resumeTransaction();
                console.log(resume, "resume response")
                const response = await verifyTransaction();
                if (!response) throw new Error("Transaction failed.")
                console.log(response, "verify transaction")
                return response;
            } catch (error) {
                console.log(error, "checkout error")
                redirect();
                return false;
            }
        },
        // staleTime: 60 * 1000 * 10
    });

    const componentRef = React.useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Abitto Ticket - ${currentUser?.ticket_id}`,
        onAfterPrint: () => { navigate("/booking") }
    });

    React.useEffect(() => {
        if (currentUser && popupState.reason === "valid") {
            console.log("print")
            handlePrint();
        }
    }, [currentUser, popupState.reason, handlePrint])

    return (
        <div className='px-5 pt-32 pb-20 text-center'>
            {!popupState.active &&
                <React.Fragment>
                    {isLoading ?
                        <div className='checkout-card'>
                            <p className='mb-5 text-xs md:text-sm'>Please wait while we confirm your payment</p>
                            <Loader2 className="animate-spin" size={20} />
                        </div>
                        :
                        <React.Fragment>
                            {(currentUser && popupState.reason === "valid") ?
                                <div className='checkout-card'>
                                    <h2 className="font-semibold text-base md:text-lg mb-5">Hurray 🎉, We confirmed your booking</h2>
                                    <p className="font-normal text-xs md:text-sm">Please download your ticket.</p>
                                    <TicketInvoice props={{ currentUser }} ref={componentRef} />
                                </div>
                                : (popupState.reason === "abandoned") ?
                                    <div className='checkout-card'>
                                        <h2 className="font-semibold text-base md:text-lg mb-5">Session timed out</h2>
                                        <p className="font-normal text-xs md:text-sm mb-5 md:mb-10">Please initiate another transaction.</p>
                                        <p className='inline-flex gap-2 items-center text-xs md:text-sm'>Redirecting <Loader2 className="animate-spin" size={16} /></p>
                                    </div>
                                    : (popupState.reason === "failed") ?
                                        <div className='checkout-card'>
                                            <h2 className="font-semibold text-base md:text-lg mb-5">Payment declined</h2>
                                            <p className="font-normal text-xs md:text-sm mb-5 md:mb-10">
                                                Your payment was unsuccessful. Please try again to secure your seat on our ferry.
                                            </p>
                                            <p className='inline-flex gap-2 items-center text-xs md:text-sm'>Redirecting <Loader2 className="animate-spin" size={16} /></p>
                                        </div>
                                        : (popupState.reason === "invalid") ?
                                            <div className='checkout-card'>
                                                <h2 className="font-semibold text-base md:text-lg mb-5">Invalid or failed transaction</h2>
                                                <p className="font-normal text-xs md:text-sm mb-5 md:mb-10">Your payment was unsuccessful. Please try again to secure your seat on our ferry.</p>
                                                <p className='inline-flex gap-2 items-center text-xs md:text-sm'>Redirecting <Loader2 className="animate-spin" size={16} /></p>
                                            </div>
                                            : null
                            }
                        </React.Fragment>
                    }
                </React.Fragment>
            }
        </div >
    )
}

export default Checkout;
