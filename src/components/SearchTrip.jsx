import React from "react";
import { BoatIcon } from "@/assets/icons";
import { formatValue } from "react-currency-input-field";
import Button from "./custom/Button";
import { BookingCTX } from "@/contexts/BookingContext";

const SearchTrip = () => {
  const { formData } = React.useContext(BookingCTX);
  const {
    trip_type,
    // travel_from,
    // travel_to,
    // total_passengers,
    // departure_date,
    // return_date,
  } = formData.bookingDetails;

  return (
    <section className="space-y-10">
      <div className="flex gap-5 justify-between items-center">
        <hgroup>
          <h2 className="font-semibold text-lg">Select Departure Time</h2>
          <p className="text-sm">Choose an option to continue</p>
        </hgroup>
        <div className="text-xs text-gray-500 bg-gray-200 h-12 p-1 flex gap-2 rounded-lg *:inline-flex *:items-center *:px-2 [&>*.active]:border-blue-500 [&>*.active]:border-2 [&>*.active]:font-semibold [&>*.active]:text-blue-500 [&>*.active]:rounded-lg">
          <p className={trip_type == "One-Way Trip" ? "active" : ""}>One-Way</p>
          <p className={trip_type == "Round Trip" ? "active" : ""}>
            Round Trip
          </p>
        </div>
      </div>

      {/* Departure Time */}
      <div className="space-y-3">
        {/* 1 */}
        <div className="flex h-32 *:rounded-lg *:bg-white ">
          <ul className=" px-8 flex-grow flex justify-between items-center">
            <li className="space-y-1">
              <p className="font-bold">08:00 AM</p>
              <p className="text-gray-500 text-sm">Marina Terminal, Calabar</p>
              <p className="text-gray-500 text-sm">21 April, 2024</p>
            </li>
            <li className="text-gray-500 space-y-1">
              <p className="text-xs text-center">1 hour</p>
              <div className="inline-flex items-center">
                ---
                <span className="rounded-full border border-gray-200 w-9 h-9 inline-flex justify-center items-center">
                  <BoatIcon />
                </span>
                ---
              </div>
            </li>
            <li className="space-y-1">
              <p className="font-bold">08:00 AM</p>
              <p className="text-gray-500 text-sm">Marina Terminal, Calabar</p>
              <p className="text-gray-500 text-sm">21 April, 2024</p>
            </li>
          </ul>
          <div className=" px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
            <p className="text-sm">Price(NGN)</p>
            <p className="md:text-lg font-semibold">
              {formatValue({
                value: String(8000),
                prefix: "₦",
              })}
            </p>
          </div>
          <div className=" px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
            <p className="text-sm">Status</p>
            <p className="font-semibold uppercase">Available</p>
          </div>
          <div className=" px-6 min-w-36 flex items-center justify-center border-l-2 border-gray-400 border-dashed">
            <Button text="Select" className="p-5" />
          </div>
        </div>
        {/* 2 */}
        <div className="flex h-32 *:rounded-lg *:bg-white ">
          <ul className=" px-8 flex-grow flex justify-between items-center">
            <li className="space-y-1">
              <p className="font-bold">08:00 AM</p>
              <p className="text-gray-500 text-sm">Marina Terminal, Calabar</p>
              <p className="text-gray-500 text-sm">21 April, 2024</p>
            </li>
            <li className="text-gray-500 space-y-1">
              <p className="text-xs text-center">1 hour</p>
              <div className="inline-flex items-center">
                ---
                <span className="rounded-full border border-gray-200 w-9 h-9 inline-flex justify-center items-center">
                  <BoatIcon />
                </span>
                ---
              </div>
            </li>
            <li className="space-y-1">
              <p className="font-bold">08:00 AM</p>
              <p className="text-gray-500 text-sm">Marina Terminal, Calabar</p>
              <p className="text-gray-500 text-sm">21 April, 2024</p>
            </li>
          </ul>
          <div className=" px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
            <p className="text-sm">Price(NGN)</p>
            <p className="md:text-lg font-semibold">
              {formatValue({
                value: String(8000),
                prefix: "₦",
              })}
            </p>
          </div>
          <div className=" px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
            <p className="text-sm">Status</p>
            <p className="font-semibold uppercase">Available</p>
          </div>
          <div className=" px-6 min-w-36 flex items-center justify-center border-l-2 border-gray-400 border-dashed">
            <Button text="Select" className="p-5" />
          </div>
        </div>
      </div>

      {/* Return time */}
      {trip_type == "Round Trip" && (
        <div className="space-y-3">
          <hgroup className="mb-5">
            <h2 className="font-semibold text-lg">Select Return Time</h2>
            <p className="text-sm">Choose an option to continue</p>
          </hgroup>
          {/* 1 */}
          <div className="flex h-32 *:rounded-lg *:bg-white ">
            <ul className=" px-8 flex-grow flex justify-between items-center">
              <li className="space-y-1">
                <p className="font-bold">08:00 AM</p>
                <p className="text-gray-500 text-sm">
                  Marina Terminal, Calabar
                </p>
                <p className="text-gray-500 text-sm">21 April, 2024</p>
              </li>
              <li className="text-gray-500 space-y-1">
                <p className="text-xs text-center">1 hour</p>
                <div className="inline-flex items-center">
                  ---
                  <span className="rounded-full border border-gray-200 w-9 h-9 inline-flex justify-center items-center">
                    <BoatIcon />
                  </span>
                  ---
                </div>
              </li>
              <li className="space-y-1">
                <p className="font-bold">08:00 AM</p>
                <p className="text-gray-500 text-sm">
                  Marina Terminal, Calabar
                </p>
                <p className="text-gray-500 text-sm">21 April, 2024</p>
              </li>
            </ul>
            <div className=" px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
              <p className="text-sm">Price(NGN)</p>
              <p className="md:text-lg font-semibold">
                {formatValue({
                  value: String(8000),
                  prefix: "₦",
                })}
              </p>
            </div>
            <div className=" px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
              <p className="text-sm">Status</p>
              <p className="font-semibold uppercase">Available</p>
            </div>
            <div className=" px-6 min-w-36 flex items-center justify-center border-l-2 border-gray-400 border-dashed">
              <Button text="Select" className="p-5" />
            </div>
          </div>
          {/* 2 */}
          <div className="flex h-32 *:rounded-lg *:bg-white ">
            <ul className=" px-8 flex-grow flex justify-between items-center">
              <li className="space-y-1">
                <p className="font-bold">08:00 AM</p>
                <p className="text-gray-500 text-sm">
                  Marina Terminal, Calabar
                </p>
                <p className="text-gray-500 text-sm">21 April, 2024</p>
              </li>
              <li className="text-gray-500 space-y-1">
                <p className="text-xs text-center">1 hour</p>
                <div className="inline-flex items-center">
                  ---
                  <span className="rounded-full border border-gray-200 w-9 h-9 inline-flex justify-center items-center">
                    <BoatIcon />
                  </span>
                  ---
                </div>
              </li>
              <li className="space-y-1">
                <p className="font-bold">08:00 AM</p>
                <p className="text-gray-500 text-sm">
                  Marina Terminal, Calabar
                </p>
                <p className="text-gray-500 text-sm">21 April, 2024</p>
              </li>
            </ul>
            <div className=" px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
              <p className="text-sm">Price(NGN)</p>
              <p className="md:text-lg font-semibold">
                {formatValue({
                  value: String(8000),
                  prefix: "₦",
                })}
              </p>
            </div>
            <div className=" px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
              <p className="text-sm">Status</p>
              <p className="font-semibold uppercase">Available</p>
            </div>
            <div className=" px-6 min-w-36 flex items-center justify-center border-l-2 border-gray-400 border-dashed">
              <Button text="Select" className="p-5" />
            </div>
          </div>
        </div>
      )}

      <div className="flex h-28 *:rounded-lg *:bg-white *:px-8">
        <div className=" flex-grow flex justify-between items-center gap-5">
          <p className="font-semibold uppercase">Total Cost</p>
          <p className="text-right">
            <strong>N16,000</strong>
            <span className="block text-sm">(N16,000 x 1 Passenger)</span>
          </p>
        </div>
        <div className="flex items-center justify-center border-l-2 border-gray-400 border-dashed">
          <Button text="Continue" className="p-5 w-44" />
        </div>
      </div>
    </section>
  );
};

export default SearchTrip;
