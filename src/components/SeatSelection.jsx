import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import Button from "@/components/custom/Button";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { useStepper } from "@/hooks/useStepper";
import { CaretIcon, CircleArrowLeftIcon } from "@/assets/icons";
import { Button as IconButton } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

const SeatSelection = () => {
  const [tab, setTab] = React.useState("departure");
  const [selectionExceeded, setSelectionExceeded] = React.useState(false);
  const { setSeatSelected, seatSelected, formData, setFormData } =
    React.useContext(BookingCTX);
  const { loading, setLoading } = React.useContext(GlobalCTX);
  const passengers = formData.bookingDetails.total_passengers;
  const { onPrevClick, onNextClick } = useStepper();

  React.useEffect(() => {
    if (seatSelected[tab].length >= passengers) setSelectionExceeded(true);
    else setSelectionExceeded(false);
  }, [seatSelected, tab, passengers]);

  const handleSelection = (target, checked) => {
    if (!checked && !selectionExceeded)
      return setSeatSelected((prev) => ({
        ...prev,
        [tab]: [...prev[tab], target],
      }));
    return setSeatSelected((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((seat) => seat !== target),
    }));
  };

  const handleSubmit = () => {
    const formValues = {
      departure_seats: seatSelected.departure,
      ...(formData.bookingDetails.trip_type === "Round Trip" && {
        return_seats: seatSelected.return,
      }),
    };

    if (selectionExceeded) {
      if (Object.keys(formData.seatDetails).length) {
        setFormData((prev) => ({ ...prev, seatDetails: formValues }));
        onNextClick();
      } else {
        setLoading(true);
        setTimeout(() => {
          setFormData((prev) => ({
            ...prev,
            seatDetails: formValues,
          }));
          setLoading(false);
          onNextClick();
        }, 600);
      }
    }
  };

  const handlePrevClick = () => {
    setTab("departure");
  };

  const handleNextClick = () => {
    setTab("return");
  };

  return (
    <>
      <div className="bg-blue-500/70 max-w-[1000px] mx-auto mb-5 min-h-20 p-2 flex items-center ">
        <ul className=" w-full [&_h4]:uppercase [&_h4]:text-[#BFBFBF] [&_h4]:text-xs [&_p]:text-white [&_p]:text-sm flex flex-wrap items-center gap-5 md:justify-around divide-x-2 h-full [&_li:not(:first-of-type)]:pl-5 *:space-y-1">
          <li>
            <h4>Trip type</h4>
            <p>{formData.bookingDetails.trip_type}</p>
          </li>
          <li>
            <h4>Route</h4>
            <p>
              {formData.bookingDetails.travel_from.includes("Calabar")
                ? "Calabar"
                : "Uyo"}{" "}
              ==
              {">"}{" "}
              {formData.bookingDetails.travel_to.includes("Calabar")
                ? "Calabar"
                : "Uyo"}
            </p>
          </li>
          <li>
            <h4> Departure Date & Time</h4>
            <p>
              {format(new Date(formData.bookingDetails.departure_date), "PP")} -{" "}
              {formData.bookingDetails.departure_time}
            </p>
          </li>
          {formData.bookingDetails.trip_type === "Round Trip" && (
            <li>
              <h4> Return Date & Time</h4>
              <p>
                {format(new Date(formData.bookingDetails?.return_date), "PP")} -{" "}
                {formData.bookingDetails?.return_time}
              </p>
            </li>
          )}
          <li>
            <h4>Adult</h4>
            <p>{formData.bookingDetails.adults_number}</p>
          </li>
          <li>
            <h4>Children</h4>
            <p>{formData.bookingDetails.children_number ?? 0}</p>
          </li>
        </ul>
      </div>

      <div className=" w-full max-w-[1000px] h-full bg-white py-5 px-3 md:pl-5 md:pr-8 md:py-8 grid gap-y-8 md:gap-0 md:grid-cols-2 md:grid-rows-2 mx-auto">
        <div className=" order-1 md:col-start-1 md:row-start-1 [&_p]:text-[#5B5B5B] [&_p]:text-sm md:[&_p]:text-base">
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
          <div className="space-y-8 px-3 md:pr-0">
            <hgroup className="space-y-2">
              <h1 className="text-blue-500 font-semibold text-base md:text-xl ">
                Choose your Seats
              </h1>
              <p className="text-xs md:text-sm">
                Select a seat that will enhance your experience
              </p>
            </hgroup>
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
        </div>

        {/* input */}
        <div className="order-3 md:col-start-1 md:row-start-2 flex flex-col justify-between gap-y-8 px-3 md:pr-0 md:mt-8 pb-2 md:pb-0">
          <p className="first-letter:capitalize">{tab} seat(s) selected :</p>
          <input
            disabled
            value={seatSelected[tab]}
            className="w-full md:w-80 h-14 rounded-lg border-2 border-[#b6b6b6] px-5 placeholder:text-sm font-medium tracking-wider "
            type="text"
            placeholder="Selected seats will appear here"
          />
          {formData.bookingDetails.trip_type === "Round Trip" ? (
            <div className=" flex gap-3">
              <Button
                disabled={tab === "departure"}
                onClick={handlePrevClick}
                text={
                  <p className="flex items-center gap-2">
                    <span className="rotate-180">
                      <CaretIcon />
                    </span>
                    Prev
                  </p>
                }
                className="w-24 mt-auto"
              />
              <div
                onClick={() => {
                  if (!selectionExceeded)
                    toast.info(
                      `Please select all ${passengers} seat(s) to proceed.`
                    );
                }}
              >
                <Button
                  disabled={!selectionExceeded}
                  loading={loading}
                  onClick={tab == "departure" ? handleNextClick : handleSubmit}
                  text={
                    tab == "departure" ? (
                      <p className="flex items-center gap-2">
                        Next
                        <span>
                          <CaretIcon />
                        </span>
                      </p>
                    ) : (
                      "Purchase Ticket"
                    )
                  }
                  className="w-fit px-6 rounded-lg mt-auto"
                />
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                if (!selectionExceeded)
                  toast.info(
                    `Please select all ${passengers} seat(s) to proceed.`
                  );
              }}
            >
              <Button
                disabled={!selectionExceeded}
                loading={loading}
                onClick={handleSubmit}
                text={"Purchase Ticket"}
                className="w-full md:w-56 rounded-lg mt-auto"
              />
            </div>
          )}
        </div>

        <div className="px-3 md:px-0 order-2 md:col-start-2 md:row-start-1 md:row-span-2">
          <div className="bg-[#1C1C1C0A] w-full md:w-4/5 h-full min-h-[500px] ml-auto rounded-lg px-5 py-10 flex flex-col justify-between">
            <ul className="flex *:text-center font-semibold text-gray-500 *:flex-1">
              <li>A</li>
              <li>B</li>
              <li></li>
              <li>C</li>
              <li>D</li>
            </ul>
            {seatID.map((seats, index) => (
              <ul key={index} className="flex">
                {seats.map((seat, index) => (
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
                      id={seat}
                      currentTab={tab}
                      seatSelected={seatSelected}
                      onClick={handleSelection}
                      disabled={
                        selectionExceeded && !seatSelected[tab].includes(seat)
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
    </>
  );
};

export default SeatSelection;

const availableDepartureSeats = [
  // "1A",
  // "1B",
  // "1C",
  "1D",
  "2A",
  "2B",
  "2C",
  "2D",
  "3A",
  // "3B",
  "3C",
  "3D",
  "4A",
  "4B",
  "4C",
  "4D",
  "5A",
  "5B",
  // "5C",
  "5D",
  "6A",
  "6B",
  // "6C",
  "6D",
  // "7A",
  "7B",
  "7C",
  "7D",
  "8A",
  "8B",
  "8C",
  "8D",
];
const availableReturnSeats = [
  "1D",
  "2A",
  "2B",
  "2C",
  "2D",
  "3A",
  "3B",
  "3C",
  "3D",
  "4A",
  // "4B",
  // "4C",
  // "4D",
  "5A",
  "5B",
  // "5C",
  "5D",
  "6A",
  // "6B",
  "6C",
  "6D",
  // "7A",
  "7B",
  "7C",
  "7D",
  "8A",
  // "8B",
  // "8C",
  "8D",
];

const seatID = [
  ["1A", "1B", "1C", "1D"],
  ["2A", "2B", "2C", "2D"],
  ["3A", "3B", "3C", "3D"],
  ["4A", "4B", "4C", "4D"],
  ["5A", "5B", "5C", "5D"],
  ["6A", "6B", "6C", "6D"],
  ["7A", "7B", "7C", "7D"],
  ["8A", "8B", "8C", "8D"],
];

const SeatButton = ({ id, onClick, disabled, seatSelected, currentTab }) => {
  const [checked, isChecked] = React.useState(false);
  const isSeatAvailable = (
    currentTab == "departure" ? availableDepartureSeats : availableReturnSeats
  ).includes(id);

  const handleClick = () => {
    if (isSeatAvailable) {
      isChecked(!checked);
      onClick(id, checked);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "w-6 h-6 rounded-sm inline-flex items-center justify-center cursor-pointer transition-all ease-in-out border-[2px] bg-[#E5E5E5] border-[#d0d0d0] hover:bg-[#afadad]",
        {
          "!bg-blue-500 !border-blue-400/50 !hover:bg-blue-500 pointer-events-none":
            !isSeatAvailable,
        },
        {
          "bg-green-400 border-green-100 hover:bg-green-300":
            seatSelected[currentTab].includes(id),
        },
        { "!bg-black !border-black pointer-events-none": id == "1A" },
        { hidden: id == "1B" || id == "1C" }
      )}
    />
  );
};

SeatButton.propTypes = {
  id: PropTypes.string,
  status: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  seatSelected: PropTypes.object,
  currentTab: PropTypes.string,
};
