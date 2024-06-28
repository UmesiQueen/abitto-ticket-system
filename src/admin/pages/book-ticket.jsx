/* eslint-disable react/prop-types */
import React from "react";
import Modal from "@mui/material/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuid } from "uuid";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
// import PropTypes from "prop-types";
import { formatValue } from "react-currency-input-field";
import { cn, humanize } from "@/lib/utils";
import {
  BoatIcon,
  CalendarIcon,
  // CaretIcon,
  InformationCircleIcon,
  ClockIcon,
  ChairIcon,
  UsersIcon,
  Boat2Icon,
} from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import { toast } from "sonner";
import { useStepper } from "@/hooks/useStepper";
import { bookingDetailsSchema } from "@/lib/validators/bookingSchema";
import { passengerDetailsSchema } from "@/lib/validators/passengerSchema";
import SelectField from "@/components/custom/SelectField";
import InputField from "@/components/custom/InputField";
import { usePayment } from "@/hooks/usePayment";

const BookTicket = () => {
  const { activeStep } = useStepper();
  return (
    <div>
      <h1 className="text-lg font-semibold">Salespoint Terminal</h1>
      {activeStep === 0 ? (
        <BookingDetails />
      ) : activeStep === 1 ? (
        <CustomerDetails />
      ) : (
        <Payment />
      )}
    </div>
  );
};

export default BookTicket;

const BookingDetails = () => {
  const { formData } = React.useContext(BookingCTX);
  const StyledTabsTrigger = ({ children, value, ...props }) => {
    return (
      <TabsTrigger
        value={value}
        className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-lg py-3 transition-all duration-200 ease-in-out"
        {...props}
      >
        {children}
      </TabsTrigger>
    );
  };

  return (
    <section className="bg-white p-10 my-8 rounded-lg">
      <Tabs
        defaultValue={formData.bookingDetails?.trip_type ?? "One-Way Trip"}
        className="w-full"
      >
        <div className="flex justify-between">
          <hgroup>
            <h2 className="text-blue-500 text-base font-semibold">
              Booking Details
            </h2>
            <p className="text-sm">Please fill in customers trip details</p>
          </hgroup>
          <TabsList className="h-14 gap-2 w-fit">
            <StyledTabsTrigger value="One-Way Trip">
              One-Way Trip
            </StyledTabsTrigger>
            <StyledTabsTrigger value="Round Trip">Round Trip</StyledTabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="One-Way Trip">
          <BookingForm tab="One-Way Trip" />
        </TabsContent>
        <TabsContent value="Round Trip">
          <BookingForm tab="Round Trip" />
        </TabsContent>
      </Tabs>
    </section>
  );
};

const BookingForm = ({ tab }) => {
  const defaultTimeOptions = ["09:30 AM", "11:00 AM", "03:30 PM", "04:30 PM"];
  const [showTotal, setShowTotal] = React.useState(false);
  const { loading, setLoading } = React.useContext(GlobalCTX);
  const { ticketCost, formData, setFormData } = React.useContext(BookingCTX);
  const [timeOptions, setTimeOptions] = React.useState({
    departure_time: defaultTimeOptions,
    return_time: defaultTimeOptions,
  });
  const [availableDate, setAvailableDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const { onNextClick } = useStepper();
  const ticket_id = uuid();

  const {
    register,
    handleSubmit,
    formState: { errors, defaultValues },
    control,
    resetField,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(bookingDetailsSchema),
    context: { roundTrip: tab === "Round Trip" ? true : false },
    defaultValues: formData.bookingDetails,
  });

  const travel_from = watch("travel_from");
  const travel_to = watch("travel_to");
  const adults_number = watch("adults_number");
  const children_number = watch("children_number");
  const departure_date = watch("departure_date");
  const return_date = watch("return_date");
  const total_passengers = Number(adults_number) + Number(children_number);

  React.useEffect(() => {
    if (total_passengers && travel_from && travel_to) return setShowTotal(true);
    return setShowTotal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total_passengers, travel_from, travel_to]);

  React.useEffect(() => {
    if (departure_date) {
      const departureDate = new Date(departure_date);
      const availableDate = new Date(departureDate).setDate(
        departureDate.getDate() + 1
      );
      setAvailableDate(new Date(availableDate).toISOString().split("T")[0]);

      if (return_date < departure_date) resetField("return_date");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departure_date]);

  React.useEffect(() => {
    resetTimeOptions(travel_from);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travel_from]);

  const resetTimeOptions = (travel_from) => {
    const calabarTimeOptions = ["09:30 AM", "03:30 PM"];
    const uyoTimeOptions = ["11:00 AM", "04:30 PM"];

    if (travel_from) {
      travel_from === "Nwaniba Timber Beach, Uyo"
        ? setTimeOptions({
            departure_time: uyoTimeOptions,
            return_time: calabarTimeOptions,
          })
        : travel_from === "Marina, Calabar"
        ? setTimeOptions({
            departure_time: calabarTimeOptions,
            return_time: uyoTimeOptions,
          })
        : "";

      resetField("departure_time");
      resetField("return_time");
    }
  };

  const onSubmit = (formData_) => {
    const total_passengers =
      Number(formData_.adults_number) + Number(formData_.children_number);
    const {
      travel_from,
      travel_to,
      departure_date,
      departure_time,
      adults_number,
      children_number,
      return_date,
      return_time,
    } = formData_;

    const formValues = {
      trip_type: tab,
      travel_from,
      travel_to,
      departure_date,
      departure_time,
      adults_number,
      children_number,
      total_passengers,
      amount:
        total_passengers *
        (tab === "One-Way Trip" ? ticketCost : ticketCost * 2),
      ...(tab === "Round Trip" && {
        return_date,
        return_time,
      }),
    };

    if (Object.keys(formData.bookingDetails).length) {
      setFormData((prev) => ({
        ...prev,
        bookingDetails: formValues,
      }));
      onNextClick();
    } else {
      setLoading(true);
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          ticket_id: ticket_id.slice(0, 6),
          bookingDetails: formValues,
        }));
        setLoading(false);
        onNextClick();
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-poppins pb-10">
      <div className="space-y-5 py-8">
        <SelectField
          {...register("travel_from")}
          defaultValue={defaultValues["travel_from"]}
          label="Traveling From"
          placeholder="Select Departure Terminal"
          options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
          errors={errors}
        />

        <SelectField
          {...register("travel_to")}
          defaultValue={defaultValues["travel_to"]}
          label="Traveling To"
          placeholder="Select Arrival Terminal"
          options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
          errors={errors}
        />

        {/* Departure Date */}
        <div
          className={cn(
            "flex gap-5 w-full ",
            tab === "One-Way Trip" ? "flex-wrap md:flex-nowrap" : ""
          )}
        >
          <div className="w-1/2 md:w-full grow ">
            <div className="flex flex-col w-full">
              <label className="text-xs md:text-sm !w-full flex flex-col ">
                Date of Departure
                <Controller
                  control={control}
                  name="departure_date"
                  render={({ field }) => (
                    <DatePicker
                      minDate={new Date().toISOString().split("T")[0]}
                      icon={<CalendarIcon />}
                      showIcon
                      toggleCalendarOnIconClick={true}
                      closeOnScroll
                      className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      customInput={
                        <button type="button">
                          {field?.value ? (
                            format(field?.value, "P")
                          ) : (
                            <span className="text-xs text-[#9fa6b2]">
                              dd/mm/yyyy
                            </span>
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </label>
              {errors?.departure_date && (
                <p className="text-xs pt-2 text-red-700">
                  {errors?.departure_date.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-1/2  md:w-full grow">
            <SelectField
              {...register("departure_time")}
              defaultValue={defaultValues["departure_time"]}
              label="Time of Departure"
              placeholder="12:00 PM"
              options={timeOptions.departure_time}
              errors={errors}
              disabled={!travel_from}
            />
          </div>
        </div>

        {/* Round Trip */}
        {tab === "Round Trip" && (
          <div className="flex gap-5 w-full">
            <div className="flex flex-col w-full">
              <label className="text-xs md:text-sm !w-full flex flex-col ">
                Date of Return
                <Controller
                  control={control}
                  name="return_date"
                  render={({ field }) => (
                    <DatePicker
                      minDate={availableDate}
                      icon={<CalendarIcon />}
                      showIcon
                      toggleCalendarOnIconClick={true}
                      closeOnScroll
                      className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      customInput={
                        <button type="button">
                          {field?.value ? (
                            format(field?.value, "P")
                          ) : (
                            <span className="text-xs text-[#9fa6b2]">
                              dd/mm/yyyy
                            </span>
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </label>
              {errors?.return_date && (
                <p className="text-xs pt-2 text-red-700">
                  {errors?.return_date.message}
                </p>
              )}
            </div>

            <SelectField
              {...register("return_time")}
              defaultValue={defaultValues["return_time"]}
              label="Time of Return"
              placeholder="12:00 PM"
              options={timeOptions.return_time}
              errors={errors}
              disabled={!travel_from}
            />
          </div>
        )}

        <div className="flex gap-5">
          <SelectField
            {...register("adults_number")}
            defaultValue={defaultValues["adults_number"]}
            label="No. of Adults"
            placeholder="0"
            options={[1, 2, 3, 4, 5]}
            errors={errors}
          />
          <SelectField
            {...register("children_number")}
            defaultValue={defaultValues["children_number"]}
            label="No. of Children"
            placeholder="0"
            options={["", 1, 2, 3, 4, 5]}
            errors={errors}
          />
        </div>
      </div>

      {showTotal && (
        <section className="my-10">
          {/* <h3 className="font-medium">Ticket Price Summary</h3> */}
          <div className="flex my-5">
            <div className="text-center basis-1/4 rounded-lg bg-gray-200 shadow-sm py-8 ">
              <p className="text-sm">
                {formatValue({ value: String(ticketCost) })} x{" "}
                {total_passengers}
              </p>
              <p className="md:text-2xl font-semibold tracking-wider">
                {formatValue({
                  value: String(
                    total_passengers *
                      (tab === "One-Way Trip" ? ticketCost : ticketCost * 2)
                  ),
                  prefix: "₦",
                })}
              </p>
            </div>
            <ul className=" basis-3/4 flex justify-between items-center bg-gray-200 shadow-sm rounded-lg py-8 px-10 border-l-2 border-gray-500 border-dashed">
              <li>
                <p className="font-bold">{watch("departure_time")}</p>
                <p className="text-[#989898] text-sm">{watch("travel_from")}</p>
              </li>
              <li className="text-gray-500 inline-flex items-center">
                ------
                <span className="rounded-full bg-white border border-gray-500 w-10 h-10 inline-flex justify-center items-center">
                  <BoatIcon />
                </span>
                ------
              </li>
              <li>
                <p className="font-bold">Not Available</p>
                <p className="text-sm text-[#989898]">{watch("travel_to")}</p>
              </li>
            </ul>
          </div>
        </section>
      )}

      <Button text="Proceed" type="submit" loading={loading} className="w-56" />
    </form>
  );
};

const CustomerDetails = () => {
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
    <section className="bg-white p-10 my-8 rounded-lg">
      <hgroup>
        <h2 className="text-blue-500 text-base font-semibold">
          Customer Details
        </h2>
        <p className="text-sm">Please fill in customers trip details</p>
      </hgroup>

      <div className="bg-gray-200 w-full mx-auto mt-10 mb-5 h-24 py-3 flex items-center rounded-lg shadow-md ">
        <ul className=" w-full [&_h4]:uppercase [&_h4]:text-blue-700 [&_h4]:font-semibold [&_h4]:text-xs [&_p]:text-black [&_p]:text-sm [&_p]:font-medium flex flex-wrap items-center gap-5 md:justify-around divide-x-2 divide-black h-full [&_li:not(:first-of-type)]:pl-5 *:space-y-1">
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
                          Passenger Details {i + 2} (Adult)
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
          <div className="flex gap-5">
            <Button
              text="Back"
              variant="outline"
              onClick={onPrevClick}
              className="w-40 "
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

const SeatSelection = ({ showModal, closeModal, tab, onSubmit }) => {
  const [selectionExceeded, setSelectionExceeded] = React.useState(false);
  const { setSeatSelected, seatSelected, formData, setFormData } =
    React.useContext(BookingCTX);
  const passengers = formData.bookingDetails.total_passengers;

  React.useEffect(() => {
    if (seatSelected[tab].length >= passengers) {
      setSelectionExceeded(true);
    } else {
      setSelectionExceeded(false);
    }
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
      closeModal();
      onSubmit(seatSelected[tab]);
      setFormData((prev) => ({ ...prev, seatDetails: formValues }));
    }
  };

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

  return (
    <Modal
      open={showModal}
      onClose={closeModal}
      aria-labelledby="seat-selection-modal"
      sx={{
        backdropFilter: "blur(1px)",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className=" w-full max-w-[1000px] h-fit bg-white  rounded-lg py-5 px-3 md:pl-5 md:pr-8 md:py-8 grid gap-y-8 md:gap-0 md:grid-cols-2 md:grid-rows-2 mx-auto">
        <div className=" order-1 md:col-start-1 md:row-start-1 [&_p]:text-[#5B5B5B] [&_p]:text-sm md:[&_p]:text-base">
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
              onClick={handleSubmit}
              text={"Done"}
              className="w-full md:w-56 rounded-lg mt-auto"
            />
          </div>
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
    </Modal>
  );
};

const SeatButton = ({ id, onClick, disabled, seatSelected, currentTab }) => {
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

const Payment = () => {
  const { formData, loading } = React.useContext(BookingCTX);
  const { onPrevClick } = useStepper();
  const { testOfflinePayment } = usePayment();

  const paymentSchema = yup.object().shape({
    payment_status: yup.string().required("This field is required."),
    payment_method: yup.string().required("This field is required."),
    transaction_ref: yup
      .string()
      .required("This field is required")
      .min(6, "Trx ref must have at least 6 characters."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(paymentSchema),
  });

  const onSubmit = handleSubmit((formData) => {
    testOfflinePayment(formData);
  });

  return (
    <div className="flex gap-5">
      <form
        onSubmit={onSubmit}
        className="basis-8/12 bg-white p-10 my-8 rounded-lg flex flex-col gap-5"
      >
        <h2 className="text-blue-500 text-base font-semibold">
          Customer Details
        </h2>
        <div>
          <h4 className="font-semibold text-sm">Passenger 01</h4>
          <ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-16 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  ">
            <li>
              <p>First Name</p>
              <p>{formData.passengerDetails.first_name}</p>
            </li>
            <li>
              <p>Surname</p>
              <p>{formData.passengerDetails.surname}</p>
            </li>
            <li>
              <p>Phone Number</p>
              <p>{formData.passengerDetails.phone_number}</p>
            </li>
            <li>
              <p>Email Address</p>
              <p>{formData.passengerDetails?.email ?? "Not provided"}</p>
            </li>
          </ul>
        </div>
        {formData.bookingDetails?.adults_number > 1 &&
        formData.passengerDetails?.passenger2_first_name ? (
          <>
            {Array.from({
              length: formData.bookingDetails.total_passengers - 1,
            }).map((_, i) => {
              const num = i + 2;
              return (
                <div key={`Passenger0${num}`}>
                  <h4 className="font-semibold text-sm">Passenger 0{num}</h4>
                  <ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-16 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  ">
                    <li>
                      <p>First Name</p>
                      <p>
                        {
                          formData.passengerDetails[
                            `passenger${num}_first_name`
                          ]
                        }
                      </p>
                    </li>
                    <li>
                      <p>Surname</p>
                      <p>
                        {formData.passengerDetails[`passenger${num}_surname`]}
                      </p>
                    </li>
                    <li>
                      <p>Phone Number</p>
                      <p>
                        {
                          formData.passengerDetails[
                            `passenger${num}_phone_number`
                          ]
                        }
                      </p>
                    </li>
                    <li>
                      <p>Email Address</p>
                      <p>
                        {formData.passengerDetails?.[`passenger${num}_email`] ??
                          "Not provided"}
                      </p>
                    </li>
                  </ul>
                </div>
              );
            })}
          </>
        ) : (
          ""
        )}
        <div className="mt-20 py-8 h-36  grid grid-cols-3 gap-5">
          <SelectField
            {...register("payment_method")}
            label="Payment Method"
            placeholder="Select payment method"
            options={["POS", "Bank Transfer", "Cash"]}
            errors={errors}
            className="bg-white"
          />
          <SelectField
            {...register("payment_status")}
            label="Payment Status"
            placeholder="Select payment status"
            options={["Success", "Canceled", "Pending"]}
            errors={errors}
            className="bg-white"
          />
          <InputField
            {...register("transaction_ref")}
            label="Transaction Reference"
            placeholder="Enter trx ref"
            type="text"
            maxLength={35}
            className="bg-white"
            autoComplete="off"
            errors={errors}
          />
        </div>
        <div className="flex gap-5 mt-auto">
          <Button
            onClick={onPrevClick}
            variant="outline"
            text="Back"
            className="w-40"
          />
          <Button
            text="Submit"
            type="submit"
            loading={loading}
            className="w-40"
          />
        </div>
      </form>
      <div className=" self-start basis-4/12 my-8 bg-white rounded-lg p-5 flex flex-col gap-6">
        <div>
          <h3 className="text-blue-500 font-semibold text-base ">
            Ticket Summary
          </h3>
          <p className="text-[#8E98A8] text-sm inline-flex items-center gap-1">
            Non-refundable <InformationCircleIcon />
          </p>
          <p className="font-medium text-xs text-right">
            Booking ID: #
            <span className="uppercase font-bold tracking-wide">
              {formData?.ticket_id}
            </span>
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="font-semibold mb-1">Terminals</h4>
          <p className="text-xs">
            {formData.bookingDetails?.travel_from} -{" "}
            {formData.bookingDetails?.travel_to}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
            <p>
              <Boat2Icon />
              {formData.bookingDetails?.trip_type}
            </p>
            <p>
              <UsersIcon /> {formData.bookingDetails?.total_passengers}{" "}
              passenger(s)
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <div>
            <h5 className="font-semibold text-sm mb-1">Departure Details</h5>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
              <p>
                <CalendarIcon />
                {format(formData.bookingDetails?.departure_date, "PP")}
              </p>
              <p>
                <ClockIcon />
                {formData.bookingDetails?.departure_time}
              </p>
              <p>
                <ChairIcon />
                {humanize(
                  formData.seatDetails?.departure_seats ?? ["None selected"]
                )}
              </p>
            </div>
          </div>
          {formData.bookingDetails.trip_type === "Round Trip" && (
            <div>
              <h5 className="font-semibold text-sm mb-1">Return Details</h5>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
                <p>
                  <CalendarIcon />
                  {format(new Date(formData.bookingDetails?.return_date), "PP")}
                </p>
                <p>
                  <ClockIcon />
                  {formData.bookingDetails?.return_time}
                </p>
                <p>
                  <ChairIcon />
                  {humanize(
                    formData.seatDetails?.return_seats ?? ["None selected"]
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-y-2 border-dashed py-2">
          <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
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
                  {formatValue({
                    value: String(formData.bookingDetails?.amount),
                    prefix: "₦",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
