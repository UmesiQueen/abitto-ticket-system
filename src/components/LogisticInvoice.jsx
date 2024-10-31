/* eslint-disable react/prop-types */
import React from "react";
import axiosInstance from "@/api";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import Logo from "@/assets/logo3.svg"
import { customError } from "@/lib/utils";

const LogisticsInvoice = React.forwardRef(({ props: { currentShipment } }, ref) => {
    return (
        <div className="hidden">
            <div
                ref={ref}
                className="bg-white p-5 md:p-10 md:pb-20 space-y-5 "
            >
                <img
                    alt="logo"
                    src={Logo}
                    width={176}
                    height={60}
                    className="w-32 md:w-40"
                />
                <div className="flex flex-wrap gap-5 justify-between items-end md:pb-5">
                    <div>
                        <h1 className="uppercase font-bold mt-3 text-sm md:text-base text-blue-500">
                            Shipment Invoice
                        </h1>
                        <p className="text-xs md:text-base">
                            ID:<span className="uppercase font-medium"> {currentShipment.shipment_id}</span>
                        </p>
                    </div>
                    <div className="text-right ml-auto">
                        <p className="text-xs md:text-sm font-bold text-gray-500 mb-1">
                            Shipment total(NGN)
                        </p>
                        <p className="font-semibold text-4xl md:text-5xl ">
                            <span className="text-2xl">₦</span>
                            {formatValue({
                                value: String(currentShipment?.total_cost),
                            })}
                        </p>
                    </div>
                </div>
                <div className="[&_p]:text-xs md:[&_p]:text-sm [&_h3]:font-semibold [&_h3]:text-[13px] md:[&_h3]:text-sm space-y-3 *:pb-3 [&>*:not(:last-of-type)]:border-b  [&>*:not(:last-of-type)]:border-stone-400">
                    <div>
                        <ul className="grid grid-cols-2 gap-y-5 gap-x-10">
                            <li>
                                <h3>Origin</h3>
                                <p>{currentShipment?.departure}</p>
                            </li>
                            <li>
                                <h3>Arrival</h3>
                                <p>{currentShipment?.arrival}</p>
                            </li>
                            <li>
                                <h3>Nature of item</h3>
                                <p>{currentShipment?.category}</p>
                            </li>
                            <li>
                                <h3>Number of items</h3>
                                <p>{currentShipment?.no_item}</p>
                            </li>
                            {currentShipment?.category === "Others" && (
                                <li>
                                    <h3>Item Name</h3>
                                    <p>{currentShipment?.name}</p>
                                </li>
                            )}
                            <li>
                                <h3>Weight(kg)</h3>
                                <p>{currentShipment?.weight}</p>
                            </li>
                            <li>
                                <h3>Est. Item Value(NGN)</h3>
                                <p>
                                    {formatValue({
                                        value: String(currentShipment?.value),
                                        prefix: "₦",
                                    })}
                                </p>
                            </li>
                            <li>
                                <h3>Item Description</h3>
                                <p>{currentShipment?.description.length ? currentShipment?.description : 'None'}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-y-5 gap-x-10">
                        <div>
                            <h3>Sender Details</h3>
                            <p>{currentShipment?.sender_name}</p>
                            <p>{currentShipment?.sender_email}</p>
                            <p>{currentShipment?.sender_phone_number}</p>
                            <p>{currentShipment?.sender_alt_phone_number}</p>
                            <p>{currentShipment?.sender_address}</p>
                        </div>
                        <div>
                            <h3>Receiver Details</h3>
                            <p>{currentShipment?.receiver_name}</p>
                            <p>{currentShipment?.receiver_email}</p>
                            <p>{currentShipment?.receiver_phone_number}</p>
                            <p>{currentShipment?.receiver_alt_phone_number}</p>
                            <p>{currentShipment?.receiver_address}</p>
                        </div>
                    </div>
                    {/* payment info */}
                    <div>
                        <ul className="grid grid-cols-2 gap-y-5 gap-x-10">
                            <li>
                                <h3>Payment Method</h3>
                                <p>{currentShipment?.payment_method}</p>
                            </li>
                            <li>
                                <h3>Created on</h3>
                                <p>{format(new Date(currentShipment?.createdAt.split("T")[0]), "PPP")}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-y border-dashed border-stone-400  py-3 md:mt-5">
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
    );
});

LogisticsInvoice.displayName = LogisticsInvoice;

export default LogisticsInvoice;

// Post: query booking detail by shipmentID
export const ShipmentLoader = async ({ params }) => {
    try {
        const response = await axiosInstance.post("/logistics/query", {
            shipment_id: params.shipmentID,
        });
        return response.data.logistics;
    } catch (error) {
        customError(error, "Error occurred while retrieving Shipment invoice.");
        return null;
    }
};
