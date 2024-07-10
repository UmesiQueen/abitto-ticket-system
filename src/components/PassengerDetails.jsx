/* eslint-disable react/prop-types */
import React from "react";
import { passengerDetailsSchema } from "@/lib/validators/passengerSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import { useStepper } from "@/hooks/useStepper";
import InputField from "./custom/InputField";
import SeatSelection from "./SeatSelection";

const PassengerDetails = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [tab, setTab] = React.useState("departure");
  const { loading, setLoading } = React.useContext(GlobalCTX);
  const { setChecked, isChecked, formData, setFormData } =
    React.useContext(BookingCTX);
  const { onPrevClick, onNextClick } = useStepper();
  const adults_number = formData.bookingDetails?.adults_number;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(passengerDetailsSchema),
    context: { adultPassengers: adults_number, isChecked },
    defaultValues: {
      ...formData.passengerDetails,
    },
  });

  const onSubmit = handleSubmit((formData_) => {
    const formValues = {
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

    if (Object.keys(formData.passengerDetails).length) {
      setFormData((prev) => ({
        ...prev,
        passengerDetails: formValues,
      }));
      onNextClick();
    } else {
      setLoading(true);
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          passengerDetails: formValues,
        }));
        setLoading(false);
        onNextClick();
      }, 600);
    }
  });

  const handleSeatSelection = (e) => {
    setTab(e.target.name.split("_")[0]);
    setShowModal(true);
  };

  return (
    <section className="bg-white p-10 my-8">
      <hgroup>
        <h2 className="text-blue-500 text-base font-semibold">
          Customer Details
        </h2>
        <p className="text-sm">Please fill in passenger details</p>
      </hgroup>
      <form onSubmit={onSubmit}>
        <div className="space-y-8 gap-x-10 grid grid-col-2 py-8">
          <div className="space-y-5">
            <h3 className="font-semibold text-base">Passenger Details</h3>
            <div className="flex gap-3 md:gap-5">
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
              <InputField
                {...register("email")}
                label="Email Address"
                placeholder="Enter email address"
                type="email"
                maxLength={40}
                errors={errors}
              />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <InputField
                {...register("phone_number")}
                label="Phone Number"
                placeholder="(+234) XXXX XXX XXX"
                type="tel"
                errors={errors}
              />
              <InputField
                {...register("departure_seat")}
                label="Departure Seat"
                placeholder="Select departure seat(s)"
                type="text"
                readOnly="readonly"
                value={formData.seatDetails?.departure_seats ?? ""}
                onClick={handleSeatSelection}
              />
              {formData.bookingDetails.trip_type === "Round Trip" && (
                <InputField
                  {...register("return_seat")}
                  label="Return Seat"
                  placeholder="Select return seat(s)"
                  type="text"
                  readOnly="readonly"
                  value={formData.seatDetails?.return_seats ?? ""}
                  onClick={handleSeatSelection}
                />
              )}
            </div>
          </div>
          {adults_number > 1 && (
            <div className="space-y-8 ">
              <div className="rounded-lg flex gap-2 items-center p-3 bg-blue-500/60 border-2 border-blue-500 text-xs md:text-sm font-semibold">
                <Checkbox
                  id="checkbox"
                  className="border-white border-2 rounded-full w-6 h-6"
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
                          Passenger 0{i + 2} (Adult)
                        </h4>
                        <div className="flex gap-3 md:gap-5">
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
          <div className="flex gap-4">
            <Button
              text="Back"
              variant="outline"
              onClick={onPrevClick}
              className="px-5"
            />
            <Button
              text="Proceed"
              type="submit"
              loading={loading}
              className="col-start-1 w-40 "
            />
          </div>
        </div>
        {showModal && (
          <SeatSelection
            showModal={showModal}
            closeModal={() => {
              setShowModal(false);
            }}
            tab={tab}
            onSubmit={(value) => {
              setValue(`${tab}_seat`, value);
            }}
          />
        )}
      </form>
    </section>
  );
};

export default PassengerDetails;
