import React from "react";
import {
  InformationCircleIcon,
  CircleArrowLeftIcon,
} from "@/assets/icons/index";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { BookingCTX } from "@/hooks/BookingContext";
import Button from "@/components/custom/Button";
import { Button as IconButton } from "@/components/ui/button";
import { useStepper } from "@/hooks/useStepper";

const PaymentForm = () => {
  const { formData, ticketCost } = React.useContext(BookingCTX);
  const { onPrevClick } = useStepper();

  return (
    <div className="flex flex-col h-fit p-5 rounded-lg bg-blue-50 w-full max-w-[1000px] mx-auto">
      {/* <h2 className="text-center text-white mb-10 text-base md:text-2xl font-medium"></h2> */}
      <div className="p-5 bg-white rounded-lg ">
        <IconButton
          variant="ghost"
          type="button"
          size="sm"
          onClick={onPrevClick}
          className="flex items-center gap-1 mb-2"
        >
          <span>
            <CircleArrowLeftIcon />
          </span>
          <h3 className="font-medium text-sm md:text-base">Return</h3>
        </IconButton>

        <section className="px-3">
          <div className="space-y-2">
            <h3 className="text-blue-500 font-semibold  text-base md:text-xl ">
              Ticket Summary
            </h3>
            {/* <p className="text-[#8E98A8] text-sm">
                {formData?.travel_from.includes("Calabar") ? "Calabar" : "Uyo"} ==
                {">"}{" "}
                {formData?.travel_to.includes("Calabar") ? "Calabar" : "Uyo"}
              </p> */}
            <p className="text-[#8E98A8] text-sm inline-flex items-center gap-1">
              Non-refundable <InformationCircleIcon />
            </p>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-1">Terminals</h4>
            <p className="text-xs">
              {formData?.travel_from} - {formData?.travel_to}
            </p>
          </div>
          <div className="mt-5 mb-9 text-[#1E1E1E] space-y-5 text-xs md:text-sm font-normal [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1 [&_li]:font-medium">
            <div>
              <h5 className="font-semibold mb-1">Customer Info</h5>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                <li>
                  <span className="text-xs text-gray-500 font-normal">
                    Name:
                  </span>{" "}
                  {`${formData.first_name} ${formData.surname}`}
                </li>
                <li>
                  <span className="text-xs text-gray-500 font-normal">
                    Phone:{" "}
                  </span>
                  {formData.phone_number}
                </li>
                {formData.email && (
                  <li>
                    <span className="text-xs text-gray-500 font-normal">
                      Email:{" "}
                    </span>
                    {formData.email}
                  </li>
                )}
                <li>
                  <span className="text-xs text-gray-500 font-normal">
                    Type:{" "}
                  </span>
                  {formData.trip_type}
                </li>
                <li>
                  <span className="text-xs text-gray-500 font-normal">
                    Passenger(s):{" "}
                  </span>
                  {formData.total_passengers}
                </li>
                <li>
                  <span className="text-xs text-gray-500 font-normal">
                    Seats:
                  </span>{" "}
                  <span className="tracking-wider ">{`${formData.seats_selected}`}</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-1">Departure Details</h5>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                <li>
                  <span className="text-xs text-gray-500 font-normal">
                    Date:
                  </span>
                  {format(new Date(formData?.departure_date), "PP")}
                </li>
                <li>
                  <span className="text-xs text-gray-500 font-normal">
                    Time:
                  </span>{" "}
                  {formData?.departure_time}
                </li>
              </ul>
            </div>
            {formData.trip_type === "Round Trip" && (
              <div>
                <h5 className="font-semibold mb-1">Return Details</h5>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                  <li>
                    <span className="text-xs text-gray-500 font-normal">
                      Date:
                    </span>
                    {format(new Date(formData?.return_date), "PP")}
                  </li>
                  <li>
                    <span className="text-xs text-gray-500 font-normal">
                      Time:
                    </span>{" "}
                    {formData?.return_time}
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="border-y-2 border-dashed py-2 mt-6">
            <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px]   ">
              <tbody>
                <tr>
                  <td className="text-xs text-[#444444]">Ride Insurance</td>
                  <td className="text-xs text-[#444444]">₦0</td>
                </tr>
                <tr>
                  <td className="text-xs text-[#444444]">Ticket Price</td>
                  <td className="text-xs text-[#444444]">₦8,800</td>
                </tr>
                <tr>
                  <td className="font-medium text-base">Total</td>
                  <td className="font-medium text-base">
                    ₦
                    {formatValue({
                      value: String(
                        (Number(formData?.adults_number) +
                          Number(formData?.children_number)) *
                          (formData?.trip_type === "Round Trip"
                            ? ticketCost * 2
                            : ticketCost)
                      ),
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6">
            <Button
              //   onClick={openModal}
              //   loading={loading}
              text={"Purchase ticket"}
              className="w-56"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentForm;
