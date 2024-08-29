import React from "react";
import baseurl from "@/api";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate, useLoaderData } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Helmet } from "react-helmet-async";
import {
    CaretIcon,
} from "@/assets/icons";
import { toast } from "sonner";
import Logo from "@/assets/logo3.svg"
import { GlobalCTX } from "@/contexts/GlobalContext";

const LogisticsInvoice = () => {
    const navigate = useNavigate();
    const currentShipment = useLoaderData();
    const componentRef = React.useRef();
    const { adminProfile } = React.useContext(GlobalCTX);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Abitto Shipment - ${currentShipment?.shipment_id}`,
    });

    if (!currentShipment?.shipment_id) return <Navigate to={`/backend/${adminProfile.account_type}/pageNotFound`} />;

    return (
        <>
            <Helmet>
                <title>Logistics Invoice | Abitto Shipment</title>
            </Helmet>
            <div className="p-5  ">
                <div className=" w-full max-w-[1000px] flex flex-col mx-auto ">
                    <div className="flex gap-2 mb-5 justify-end ">
                        <Button
                            className=" bg-green-500 hover:bg-green-700 "
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            <span className="rotate-180 mr-2">
                                <CaretIcon />
                            </span>
                            Return
                        </Button>
                        <Button onClick={handlePrint}>Download</Button>
                    </div>
                    <div
                        ref={componentRef}
                        className="bg-white p-5 md:p-10 md:pb-20 space-y-5"
                    >
                        <img
                            alt="logo"
                            src={Logo}
                            width={176}
                            height={60}
                            className="w-32 md:w-40"
                        />

                        <div className="flex flex-wrap gap-5 justify-between items-center md:pb-5">
                            <div>
                                <h1 className="uppercase font-bold mt-3 text-sm md:text-base text-blue-500">
                                    Shipment Invoice
                                </h1>
                                <p className="text-xs md:text-base">
                                    Shipment ID:<span className="uppercase"> {currentShipment.shipment_id}</span>
                                </p>
                            </div>
                            <div className="text-right ml-auto">
                                <p className="text-xs md:text-sm font-bold text-gray-500 mb-1">
                                    Shipment total(NGN)
                                </p>
                                <p className="nowrap font-semibold text-4xl md:text-5xl ">
                                    <span className="text-2xl">₦</span>
                                    {formatValue({
                                        value: String(currentShipment?.total_cost),
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="[&_p]:text-xs md:[&_p]:text-sm  [&_h3]:font-semibold [&_h3]:text-[13px] md:[&_h3]:text-sm space-y-3 *:pb-3 [&>*:not(:last-of-type)]:border-b">
                            <div className=" w-full md:w-5/6 flex flex-col md:flex-row *:grow *:w-full">
                                <ul className="space-y-2">
                                    <li>
                                        <h3>Origin:</h3>
                                        <p>{currentShipment?.departure}</p>
                                    </li>
                                    <li>
                                        <h3>Arrival:</h3>
                                        <p>{currentShipment?.arrival}</p>
                                    </li>
                                    <li className="flex gap-10">
                                        <div>
                                            <h3>Nature of item:</h3>
                                            <p>{currentShipment?.category}</p>
                                        </div>
                                        <div>
                                            <h3>Number of items:</h3>
                                            <p>{currentShipment?.no_item}</p>
                                        </div>
                                    </li>

                                    {currentShipment?.category == "Others" && (
                                        <li>
                                            <h3>Item Name:</h3>
                                            <p>{currentShipment?.name}</p>
                                        </li>
                                    )}
                                    <li>
                                        <h3>Item Description:</h3>
                                        <p>{currentShipment?.description.length ? currentShipment?.description : 'None'}</p>
                                    </li>
                                    <li className="flex gap-10">
                                        <div>
                                            <h3>Weight(kg):</h3>
                                            <p>{currentShipment?.weight}</p>
                                        </div>
                                        <div>
                                            <h3>Value(NGN):</h3>
                                            <p>
                                                {formatValue({
                                                    value: String(currentShipment?.value),
                                                    prefix: "₦",
                                                })}
                                            </p>
                                        </div>
                                    </li>
                                    <li></li>
                                </ul>
                                <div className=" space-y-2 md:space-y-10 border-t pt-3 md:border-none md:pt-0">
                                    <div>
                                        <h3>Sender Details:</h3>
                                        <p>{currentShipment?.sender_name}</p>
                                        <p>{currentShipment?.sender_email}</p>
                                        <p>{currentShipment?.sender_phone_number}</p>
                                        <p>{currentShipment?.sender_alt_phone_number}</p>
                                        <p>{currentShipment?.sender_address}</p>
                                    </div>
                                    <div>
                                        <h3>Receiver Details:</h3>
                                        <p>{currentShipment?.receiver_name}</p>
                                        <p>{currentShipment?.receiver_email}</p>
                                        <p>{currentShipment?.receiver_phone_number}</p>
                                        <p>{currentShipment?.receiver_alt_phone_number}</p>
                                        <p>{currentShipment?.receiver_address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* payment info */}
                            <div>
                                <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                                    <li>
                                        <h3>Payment Method:</h3>
                                        <p>{currentShipment?.payment_method}</p>
                                    </li>
                                    <li>
                                        <h3>Trx Ref:</h3>
                                        <p>{currentShipment?.txRef}</p>
                                    </li>
                                    <li>
                                        <h3>Created on:</h3>
                                        <p>{format(new Date(currentShipment?.createdAt.split("T")[0]), "PPP")}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-y-2 border-dashed py-3 md:mt-5">
                            <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
                                <tbody>
                                    <tr>
                                        <td className="text-xs md:text-sm text-[#444444]">
                                            Cost/kg
                                        </td>
                                        <td className="text-xs md:text-sm text-[#444444]">
                                            {formatValue({
                                                value: String(currentShipment?.cost_per_kg),
                                                prefix: "₦",
                                            })}
                                            {" "}   x {currentShipment.weight}kg
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium text-base md:text-lg">Total</td>
                                        <td className="font-medium text-base md:text-lg">
                                            ₦
                                            {formatValue({
                                                value: String(currentShipment?.total_cost ?? 0),
                                            })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogisticsInvoice;

// Post: query booking detail by shipmentID
export const ShipmentLoader = async ({ params }) => {
    try {
        const response = await baseurl.post("/logistics/query", {
            shipment_id: params.shipmentID,
        });
        return response.data.logistics;
    } catch (error) {
        if (
            !error.code === "ERR_NETWORK" ||
            !error.code === "ERR_INTERNET_DISCONNECTED" ||
            !error.code === "ECONNABORTED"
        )
            toast.error("Error occurred while retrieving Shipment invoice.");
        return null;
    }
};
