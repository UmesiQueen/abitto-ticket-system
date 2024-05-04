import React from "react";
import { BookingCTX } from "../context/BookingContext";
import {
  ChairIcon,
  InformationCircleIcon,
  CalendarIcon,
  BoatIcon,
  ClockIcon,
} from "../assets/icons/index";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";

const TicketSummary = () => {
  const { formData } = React.useContext(BookingCTX);

  return (
    <div className="bg-hero-pattern h-[750px] w-screen bg-cover bg-no-repeat bg-center relative ">
      <div className="bg-black/40 w-full h-full absolute z-0 md:flex justify-center ">
        <div className="mt-28 flex flex-col h-fit px-5">
          <h2 className="text-center text-white mb-10 text-base md:text-2xl font-medium">
            Ticket Summary
          </h2>
          <div className="h-fit w-full md:w-[700px] p-5 bg-white self-center border-[20px] border-white/92  ">
            <div className="space-y-2">
              <h3 className="text-blue-500 font-semibold  text-base md:text-xl ">
                Abiito Ferry Terminal
              </h3>
              <p className="text-[#8E98A8] text-sm">
                {formData?.travel_from} =={">"} {formData?.travel_to}
              </p>
              <p className="text-[#8E98A8] text-sm inline-flex items-center gap-1">
                Non-refundable <InformationCircleIcon />
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-1">Terminals</h4>
              <p className="text-xs">
                {formData?.travel_from.match("Calabar")
                  ? "Marina"
                  : "Nwaniba Timber Beach"}{" "}
                Terminal -{" "}
                {formData?.travel_to.match("Calabar")
                  ? "Marina"
                  : "Nwaniba Timber Beach"}{" "}
                Terminal
              </p>
            </div>

            <div className="mt-6 text-[#1E1E1E] text-xs md:text-sm font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                <p>
                  <CalendarIcon />
                  {format(new Date(formData?.departure_date), "PP")}
                </p>
                <p>
                  <ClockIcon /> {formData?.departure_time}
                </p>
                <p>
                  <ChairIcon /> Seats: L3 & B2
                </p>
              </div>
              <p>
                <BoatIcon /> Departure trip:{" "}
                {Number(formData?.adults_number) +
                  Number(formData?.children_number)}{" "}
                passenger(s)
              </p>
            </div>

            <div className="border-y-2 border-dashed py-2 mt-6">
              <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px]   ">
                <tbody>
                  <tr>
                    <td className="text-xs text-[#444444]">Ride Insurance</td>
                    <td className="text-xs text-[#444444]">₦0.00</td>
                  </tr>
                  <tr>
                    <td className="text-xs text-[#444444]">Ticket Price</td>
                    <td className="text-xs text-[#444444]">₦1,000</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-base">Ticket:</td>
                    <td className="font-medium text-base">
                      ₦
                      {formatValue({
                        value: String(
                          (Number(formData?.adults_number) +
                            Number(formData?.children_number)) *
                            1000
                        ),
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <button className=" bg-green-500 py-3 px-6 font-semibold text-sm  hover:bg-green-700 transition-all duration-100  ease-in-out text-white">
                Proceed to buy ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;
