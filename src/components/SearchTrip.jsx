import React from "react";
import { BoatIcon } from "@/assets/icons";
import { formatValue } from "react-currency-input-field";
import Button from "./custom/Button";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { useStepper } from "@/hooks/useStepper";
import { addHours, format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const SearchTrip = () => {
  const {
    formData,
    availableTrips,
    selectedTrip,
    setSelectedTrip,
    setFormData,
  } = React.useContext(BookingCTX);
  const { setLoading } = React.useContext(GlobalCTX);
  const [totalCost, setTotalCost] = React.useState(0);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const { onPrevClick, onNextClick } = useStepper();

  const trip_type = formData.bookingDetails.trip_type;
  const total_passengers =
    Number(formData.bookingDetails?.children_number ?? 0) +
    Number(formData.bookingDetails.adults_number);

  const getArrivalDateTime = (time, date) => {
    const dateTime = new Date(`${date} ${time}`);
    return addHours(dateTime, 1);
  };

  React.useEffect(() => {
    if (Object.keys(selectedTrip?.departure).length) {
      const departureCost =
        Number(selectedTrip.departure?.ticket_cost ?? 0) * total_passengers;

      if (trip_type === "Round Trip") {
        if (Object.keys(selectedTrip?.return).length) {
          setTotalCost(
            Number(selectedTrip.return?.ticket_cost ?? 0) * total_passengers +
              departureCost
          );
          return setIsDisabled(false);
        } else {
          setTotalCost(0);
          return setIsDisabled(true);
        }
      }
      setTotalCost(departureCost);
      return setIsDisabled(false);
    } else {
      setTotalCost(0);
      return setIsDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip]);

  const handleCheck = (name, state, tripDetails) => {
    setSelectedTrip((prev) => ({
      ...prev,
      [name]: state ? tripDetails : {},
    }));
  };

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        bookingDetails: {
          ...prev.bookingDetails,
          total_passengers,
          amount: totalCost,
        },
      }));
      onNextClick();
      setLoading(false);
    }, 650);
  };

  return (
    <section className="space-y-10 min-h-56">
      <div className="flex gap-5 justify-between items-center">
        <hgroup>
          <h2 className="font-semibold text-lg">Select Departure Trip</h2>
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
        {availableTrips?.departure_trip.length ? (
          availableTrips.departure_trip.map((item) => {
            const isActive =
              selectedTrip?.departure?.trip_code === item.trip_code;
            return (
              <div
                key={item.trip_code}
                data-state={isActive ? "active" : ""}
                className=" relative flex h-32 *:rounded-lg *:bg-white [&>*]:data-[state=active]:bg-blue-50 [&>*]:data-[state=active]:shadow-sm "
              >
                <button
                  className="absolute top-0 left-0 w-full h-full !bg-transparent"
                  onClick={() => {
                    handleCheck("departure", !isActive, item);
                  }}
                />
                <ul className="px-8 flex-grow flex justify-between items-center">
                  <li className="space-y-1">
                    <p className="font-bold">{item.time}</p>
                    <p className="text-gray-500 text-sm">{item.departure}</p>
                    <p className="text-gray-500 text-sm">{item.date}</p>
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
                    <p className="font-bold">
                      {format(getArrivalDateTime(item.time, item.date), "p")}
                    </p>
                    <p className="text-gray-500 text-sm">{item.arrival}</p>
                    <p className="text-gray-500 text-sm">
                      {format(getArrivalDateTime(item.time, item.date), "PP")}
                    </p>
                  </li>
                </ul>
                <div className="px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
                  <p className="text-sm">Price(NGN)</p>
                  <p className="md:text-lg font-semibold">
                    {formatValue({
                      value: String(item.ticket_cost),
                      prefix: "₦",
                    })}
                  </p>
                </div>
                <div className="px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
                  <p className="text-sm">Status</p>
                  <p className="font-semibold uppercase">Available</p>
                </div>
                <div className="px-6 min-w-36 flex items-center justify-center border-l-2 border-gray-400 border-dashed">
                  <Checkbox
                    tabIndex={-1}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    checked={isActive}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col justify-center items-center min-h-40">
            <p>There are no available departure trips for this date.</p>
          </div>
        )}
      </div>
      {/* Return time */}
      {trip_type == "Round Trip" && (
        <div className="space-y-3">
          <hgroup className="mb-5">
            <h2 className="font-semibold text-lg">Select Return Time</h2>
            <p className="text-sm">Choose an option to continue</p>
          </hgroup>
          {availableTrips?.return_trip.length ? (
            availableTrips.return_trip.map((item) => {
              const isActive =
                selectedTrip?.return?.trip_code === item.trip_code;
              return (
                <div
                  key={item.trip_code}
                  data-state={isActive ? "active" : ""}
                  className=" relative flex h-32 *:rounded-lg *:bg-white [&>*]:data-[state=active]:bg-blue-50 [&>*]:data-[state=active]:shadow-sm "
                >
                  <button
                    className="absolute top-0 left-0 w-full h-full !bg-transparent"
                    onClick={() => {
                      handleCheck("return", !isActive, item);
                    }}
                  />
                  <ul className="px-8 flex-grow flex justify-between items-center">
                    <li className="space-y-1">
                      <p className="font-bold">{item.time}</p>
                      <p className="text-gray-500 text-sm">{item.departure}</p>
                      <p className="text-gray-500 text-sm">{item.date}</p>
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
                      <p className="font-bold">
                        {format(getArrivalDateTime(item.time, item.date), "p")}
                      </p>
                      <p className="text-gray-500 text-sm">{item.arrival}</p>
                      <p className="text-gray-500 text-sm">
                        {format(getArrivalDateTime(item.time, item.date), "PP")}
                      </p>
                    </li>
                  </ul>
                  <div className="px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
                    <p className="text-sm">Price(NGN)</p>
                    <p className="md:text-lg font-semibold">
                      {formatValue({
                        value: String(item.ticket_cost),
                        prefix: "₦",
                      })}
                    </p>
                  </div>
                  <div className="px-6 min-w-36 flex flex-col justify-center border-l-2 border-gray-400 border-dashed">
                    <p className="text-sm">Status</p>
                    <p className="font-semibold uppercase">Available</p>
                  </div>
                  <div className="px-6 min-w-36 flex items-center justify-center border-l-2 border-gray-400 border-dashed">
                    <Checkbox
                      tabIndex={-1}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      checked={isActive}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col justify-center items-center gap-3 min-h-40">
              <p>There are no available return trips for this date.</p>
            </div>
          )}
        </div>
      )}

      <div className="flex h-28 *:rounded-lg *:bg-white *:px-8">
        <div className=" flex-grow flex justify-between items-center gap-5">
          <p className="font-semibold uppercase">Total Cost</p>
          <p className="text-right">
            <strong>
              {formatValue({
                value: String(totalCost),
                prefix: "₦",
              })}
            </strong>
            <span className="block text-sm">
              {trip_type === "Round Trip" && (
                <>
                  {formatValue({
                    value: String(selectedTrip.return?.ticket_cost ?? 0),
                    prefix: "₦",
                  })}
                  {" + "}
                </>
              )}
              {formatValue({
                value: String(selectedTrip.departure?.ticket_cost ?? 0),
                prefix: "₦",
              })}{" "}
              x {total_passengers} Passenger(s)
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 border-l-2 border-gray-400 border-dashed">
          <Button
            text="Back"
            variant="outline"
            className="p-5 w-44"
            onClick={() => {
              onPrevClick();
              setSelectedTrip({
                departure: {},
                return: {},
              });
            }}
          />
          <div
            onClick={() => {
              if (isDisabled)
                toast.info("Please select preferred trip(s) to proceed.");
            }}
          >
            <Button
              text="Continue"
              className="p-5 w-44"
              disabled={isDisabled}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchTrip;
