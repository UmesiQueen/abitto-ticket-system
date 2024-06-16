import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import Button from "../custom/Button";
import { BookingCTX } from "@/hooks/BookingContext";
import { useNavigate } from "react-router-dom";
import { GlobalCTX } from "@/hooks/GlobalContext";

const SeatSelection = () => {
  const [seatSelected, setSeatSelected] = React.useState([]);
  const [selectionExceeded, setSelectionExceeded] = React.useState(false);
  const { formData, setFormData } = React.useContext(BookingCTX);
  const { toggleModal } = React.useContext(GlobalCTX);
  const passengers = formData?.total_passengers;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (seatSelected.length >= passengers) setSelectionExceeded(true);
    else setSelectionExceeded(false);
  }, [seatSelected, passengers]);

  const handleSelection = (target, checked) => {
    if (!checked) return setSeatSelected((prev) => [...prev, target]);
    return setSeatSelected((prev) => prev.filter((seat) => seat !== target));
  };

  return (
    <div className=" w-full md:w-[950px] h-full md:h-[550px] rounded-lg bg-white p-5 grid gap-y-8 md:gap-0 md:grid-cols-2 md:grid-rows-2">
      <div className=" order-1 space-y-8 p-2 h-full md:h-fit [&_p]:text-[#5B5B5B]">
        <hgroup className="space-y-2">
          <h1 className="text-blue-500 font-semibold text-2xl">
            Choose your Seats (optional)
          </h1>
          <p className="text-sm">
            Select a seat that will enhance your experience
          </p>
        </hgroup>
        <div className="space-y-2">
          <h4 className="font-semibold mb-1 text-blue-500 uppercase">
            Departure Ferry
          </h4>
          <p>
            <b>From:</b> Calabar - <b>Destination:</b> Uyo
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold mb-1">Seat Options</h4>
          <ul className="grid grid-cols-2 gap-y-5 *:inline-flex *:gap-2 *:items-center [&_div]:w-6 [&_div]:h-6 [&_div]:rounded-sm [&_div]:inline-flex [&_div]:items-center [&_div]:justify-center [&_div]:cursor-pointer [&_div]:transition-all [&_div]:ease-in-out [&_div]:border-[2px] ">
            <li>
              <div className="bg-black border-black" />
              <p>Not a Seat</p>
            </li>
            <li>
              <div className="bg-blue-500 border-blue-400/50" />
              <p>Occupied</p>
            </li>
            <li>
              <div className="bg-[#E5E5E5] border-[#d0d0d0]" />
              <p>Available</p>
            </li>
            <li>
              <div className="bg-green-400 border-green-100 " />
              <p>Your Selection</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="order-3 gap-8 flex flex-col">
        <p className="mt-auto">{passengers} Passenger(s)</p>
        <input
          disabled
          value={seatSelected}
          className="w-full md:w-80 h-14 rounded-lg border-2 border-[#b6b6b6] px-5 placeholder:text-sm font-medium tracking-wider "
          type="text"
          placeholder="Selected seats will appear here"
        />
        <Button
          onClick={() => {
            // TODO: SELECTION OF SEAT SHOULD BE OPTIONAL
            if (selectionExceeded) {
              toggleModal();
              setFormData((prev) => ({
                ...prev,
                seats_selected: seatSelected,
              }));
              navigate("/booking/ticket-summary");
            }
          }}
          text={"Purchase ticket"}
          className="w-full md:w-56 rounded-lg"
        />
      </div>
      <div className="order-2 md:row-span-2 h-full">
        <div className="bg-[#1C1C1C0A] w-full md:w-4/5 h-full min-h-[500px] ml-auto rounded-lg px-5 py-10 flex flex-col justify-between">
          <ul className="flex *:text-center font-semibold text-gray-500 *:flex-1">
            <li>A</li>
            <li>B</li>
            <li></li>
            <li>C</li>
            <li>D</li>
          </ul>
          {seatDemo.map((seat, index) => (
            <ul key={index} className="flex">
              {seat.map((item, index) => (
                <li
                  key={index}
                  className={cn("flex justify-center flex-1 ", {
                    "order-1": index === 0,
                    "order-2": index === 1,
                    "order-3": index === 2,
                    "order-5": index === 3,
                  })}
                >
                  <SeatButton
                    status={item.status}
                    id={item.seat}
                    onClick={handleSelection}
                    disabled={
                      selectionExceeded && !seatSelected.includes(item.seat)
                        ? true
                        : false
                    }
                  />
                </li>
              ))}
              <li className="text-center flex-1 order-2">{index + 1}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

const seatDemo = [
  [
    { seat: "1A", status: "na" },
    { seat: "1B", status: "none" },
    { seat: "1C", status: "none" },
    { seat: "1D", status: "available" },
  ],
  [
    { seat: "2A", status: "available" },
    { seat: "2B", status: "available" },
    { seat: "2C", status: "available" },
    { seat: "2D", status: "available" },
  ],
  [
    { seat: "3A", status: "available" },
    { seat: "3B", status: "available" },
    { seat: "3C", status: "taken" },
    { seat: "3D", status: "available" },
  ],
  [
    { seat: "4A", status: "available" },
    { seat: "4B", status: "available" },
    { seat: "4C", status: "available" },
    { seat: "4D", status: "available" },
  ],
  [
    { seat: "5A", status: "available" },
    { seat: "5B", status: "available" },
    { seat: "5C", status: "available" },
    { seat: "5D", status: "available" },
  ],
  [
    { seat: "6A", status: "available" },
    { seat: "6B", status: "available" },
    { seat: "6C", status: "available" },
    { seat: "6D", status: "available" },
  ],
  [
    { seat: "7A", status: "available" },
    { seat: "7B", status: "available" },
    { seat: "7C", status: "taken" },
    { seat: "7D", status: "available" },
  ],
  [
    { seat: "8A", status: "available" },
    { seat: "8B", status: "available" },
    { seat: "8C", status: "available" },
    { seat: "8D", status: "available" },
  ],
];

const SeatButton = ({ id, status, onClick, disabled }) => {
  const [checked, isChecked] = React.useState(false);
  const [seatStatus, setSeatStatus] = React.useState(status);

  React.useEffect(() => {
    if (checked) return setSeatStatus("selected");
    return setSeatStatus("available");
  }, [checked]);

  return (
    <button
      type="button"
      disabled={disabled}
      id={id}
      onClick={(e) => {
        if (status === "available" || status === "selected") {
          isChecked(!checked);
          onClick(e.target.id, checked);
        }
      }}
      className={cn(
        "w-6 h-6 rounded-sm inline-flex items-center justify-center cursor-pointer transition-all ease-in-out border-[2px] ",
        {
          "bg-[#E5E5E5] border-[#d0d0d0] hover:bg-[#afadad]":
            status === "available",
        },
        { "bg-blue-500 border-blue-400/50": status === "taken" },
        {
          "bg-green-400 border-green-100 hover:bg-green-300":
            seatStatus === "selected",
        },
        { "bg-black border-black": status === "na" },
        { hidden: status === "none" }
      )}
    />
  );
};

SeatButton.propTypes = {
  id: PropTypes.string,
  status: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
