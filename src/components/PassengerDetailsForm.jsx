/* eslint-disable react/prop-types */
import React from "react";
import { passengerDetailsSchema } from "@/lib/validators/passengerSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { CircleArrowLeftIcon } from "@/assets/icons";
import { Button as IconButton } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { useStepper } from "@/hooks/useStepper";
import { format } from "date-fns";
import InputField from "./custom/InputField";

const PassengerDetails = () => {
  const { loading, setLoading } = React.useContext(GlobalCTX);
  const { setFormData, formData, setChecked, isChecked } =
    React.useContext(BookingCTX);
  const { onPrevClick, onNextClick } = useStepper();
  const adults_number = formData?.adults_number;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(passengerDetailsSchema),
    context: { adultPassengers: adults_number, isChecked },
    defaultValues: formData,
  });

  const onSubmit = handleSubmit((formData_) => {
    const formValues = {
      ticket_id: formData.ticket_id,
      trip_type: formData.trip_type,
      travel_from: formData.travel_from,
      travel_to: formData.travel_to,
      departure_date: formData.departure_date,
      departure_time: formData.departure_time,
      adults_number: formData.adults_number,
      children_number: formData.children_number,
      total_passengers: formData.total_passengers,
      amount: formData.amount,
      ...(formData.trip_type === "Round Trip" && {
        return_date: formData.return_date,
        return_time: formData.return_time,
      }),
      ...(isChecked
        ? {
            first_name: formData_.first_name,
            surname: formData_.surname,
            phone_number: formData_.phone_number,
            email: formData_.email,
          }
        : {
            ...formData_,
          }),
    };

    if (formData?.first_name) {
      setFormData(() => formValues);
      onNextClick();
    } else {
      setLoading(true);
      setTimeout(() => {
        setFormData(() => formValues);
        setLoading(false);
        onNextClick();
      }, 600);
    }
  });

  return (
    <>
      <div className="bg-blue-500/70 max-w-[1000px] mx-auto mb-5 min-h-20 p-2 flex items-center ">
        <ul className=" w-full [&_h4]:uppercase [&_h4]:text-[#BFBFBF] [&_h4]:text-xs [&_p]:text-white [&_p]:text-sm flex flex-wrap items-center gap-5 md:justify-around divide-x-2 h-full [&_li:not(:first-of-type)]:pl-5 *:space-y-1">
          <li>
            <h4>Trip type</h4>
            <p>{formData?.trip_type}</p>
          </li>
          <li>
            <h4>Route</h4>
            <p>
              {formData?.travel_from.includes("Calabar") ? "Calabar" : "Uyo"} ==
              {">"}{" "}
              {formData?.travel_to.includes("Calabar") ? "Calabar" : "Uyo"}
            </p>
          </li>
          <li>
            <h4> Departure Date & Time</h4>
            <p>
              {format(new Date(formData?.departure_date), "PP")} -{" "}
              {formData?.departure_time}
            </p>
          </li>
          {formData?.trip_type === "Round Trip" && (
            <li>
              <h4> Return Date & Time</h4>
              <p>
                {format(new Date(formData?.return_date), "PP")} -{" "}
                {formData?.return_time}
              </p>
            </li>
          )}
          <li>
            <h4>Adult</h4>
            <p>{formData?.adults_number}</p>
          </li>
          <li>
            <h4>Children</h4>
            <p>{formData?.children_number ?? 0}</p>
          </li>
        </ul>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white max-w-[1000px] mx-auto p-3 pb-8 md:p-7"
      >
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
        <div className="space-y-8 gap-x-10 grid grid-col-2 px-3">
          <div className="space-y-5">
            <h3 className="text-blue-500 font-semibold  text-base md:text-xl ">
              Passenger Details
            </h3>
            <div className="flex gap-5">
              <InputField
                {...register("first_name")}
                label="First Name"
                placeholder="Enter first name"
                type="text"
                maxLength={35}
                errors={errors}
              />
              <InputField
                {...register("surname")}
                label="Surname"
                placeholder="Enter surname"
                type="text"
                maxLength={35}
                errors={errors}
              />
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-5">
              <InputField
                {...register("email")}
                label="Email Address"
                placeholder="Enter email address"
                type="email"
                maxLength={40}
                errors={errors}
              />
              <InputField
                {...register("phone_number")}
                label="Phone Number"
                placeholder="(+234) XXXX XXX XXX"
                type="tel"
                errors={errors}
              />
            </div>
          </div>
          {adults_number > 1 && (
            <div className="space-y-8 ">
              <div className="rounded-lg flex gap-2 items-center p-3 bg-green-100 border border-green-500 text-xs md:text-sm font-semibold">
                <Checkbox
                  id="checkbox"
                  className="border-white rounded-full w-6 h-6"
                  checked={isChecked}
                  onCheckedChange={(state) => {
                    setChecked(state);
                  }}
                />
                <label htmlFor="checkbox">
                  Use same Information as above for all adult passengers.
                </label>
              </div>
              {!isChecked && (
                <div className="gap-8 flex flex-wrap">
                  {Array.from({ length: adults_number - 1 }).map((_, i) => {
                    const currentPassenger = `passenger${i + 2}`;
                    return (
                      <div
                        key={i}
                        className="space-y-5 flex-grow basis-[400px]"
                      >
                        <h4 className="font-medium text-sm ">
                          Passenger Details {i + 2} (Adult)
                        </h4>
                        <div className="flex gap-5">
                          <InputField
                            {...register(`${currentPassenger}_first_name`, {
                              required: "This field is required..",
                            })}
                            label="First Name"
                            placeholder="Enter first name"
                            type="text"
                            maxLength={35}
                            errors={errors}
                          />
                          <InputField
                            {...register(`${currentPassenger}_surname`)}
                            label="Surname"
                            placeholder="Enter surname"
                            type="text"
                            maxLength={35}
                            errors={errors}
                          />
                        </div>
                        <div className="flex flex-wrap md:flex-nowrap gap-5">
                          <InputField
                            {...register(`${currentPassenger}_email`)}
                            label="Email Address"
                            placeholder="Enter email address"
                            type="email"
                            maxLength={40}
                            errors={errors}
                          />
                          <InputField
                            {...register(`${currentPassenger}_phone_number`)}
                            label="Phone Number"
                            placeholder="(+234) XXXX XXX XXX"
                            type="tel"
                            errors={errors}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <Button
            text="Continue"
            type="submit"
            loading={loading}
            className="col-start-1 w-40 "
          />
        </div>
      </form>
    </>
  );
};

export default PassengerDetails;
