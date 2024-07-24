import React from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoatURL from "@/assets/images/boat1.jpg";
import BoatURL2 from "@/assets/images/boat2.png";
import BoatURL3 from "@/assets/images/boat3.png";
import Button from "@/components/custom/Button";
import { UsersIcon, CalendarIcon, Boat2Icon, ClockIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import InputField from "@/components/custom/InputField";
import SelectField from "@/components/custom/SelectField";
import DatePicker from "react-datepicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import { format, addHours } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rentalSchema } from "@/lib/validators/rentalSchema";
import { useStepper } from "@/hooks/useStepper";
import { usePayment } from "@/hooks/usePayment";

const Rental = () => {
  const { activeStep } = useStepper();

  return (
    <>
      <Helmet>
        <title>Rental Services | Abitto Ferry</title>
      </Helmet>
      <div className="py-32 px-5 ">
        <section className="w-full max-w-[1000px] mx-auto ">
          {activeStep == 0 ? (
            <RentalSelection />
          ) : activeStep == 1 ? (
            <div className="p-5 pb-10 md:p-10 rounded-lg bg-white ">
              <RentalForm />
            </div>
          ) : activeStep == 2 ? (
            <div className="p-5 pb-10 md:p-10 rounded-lg bg-white ">
              <RentalSummary />
            </div>
          ) : (
            ""
          )}
        </section>
      </div>
    </>
  );
};
export default Rental;

export const RentalSelection = () => {
  const { setRentalData } = React.useContext(BookingCTX);
  const { onNextClick } = useStepper();

  const handleClick = ({ rental_cost, departure, arrival, rent_type }) => {
    setRentalData((prev) => ({
      ...prev,
      rental_cost,
      departure,
      arrival,
      rent_type,
    }));
    onNextClick();
  };
  React.useEffect(() => console.log(document.getElementById("hello")), []);
  return (
    <>
      <hgroup className="text-center">
        <h1 className="font-semibold text-2xl">Boat Rental Package</h1>
        <p className="text-sm">
          Choose from our range of boat rental packages.
        </p>
      </hgroup>
      <div className=" bg-white rounded-lg py-5 md:px-5 max-w-[1000px] mx-auto mt-10">
        <Tabs defaultValue="within marina">
          <div className="mx-auto w-fit">
            <TabsList className="h-full md:gap-2 rounded-3xl p-1 bg-blue-50">
              <StyledTabsTrigger value="within marina" title="Within Marina" />
              <StyledTabsTrigger
                value="uyo to calabar"
                title="Uyo to Calabar"
              />
              <StyledTabsTrigger
                value="calabar to uyo"
                title="Calabar to Uyo"
              />
            </TabsList>
          </div>
          {rentalPackages.map((item, index) => (
            <TabsContent key={index} value={item.type}>
              <div className="flex flex-col md:flex-row gap-10 *:flex-grow md:*:w-1/2 min-h-56 p-5 mt-5 rounded-lg">
                <div className="relative rounded-lg overflow-hidden h-56">
                  <img
                    src={item.src}
                    alt="boat image"
                    className="object-cover h-56 w-full"
                  />
                  <div className=" bg-gradient-to-b from-white/0 from-30% to-black/60 absolute top-0 right-0 w-full h-full" />
                </div>
                <div id="hello" className="flex flex-col gap-5 leading-none">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <div className="inline-flex gap-5 font-medium ">
                    <p>
                      {formatValue({
                        value: String(item.rental_cost),
                        prefix: "₦",
                        decimalScale: 2,
                      })}
                      /<span className="font-normal">{item.duration}</span>
                    </p>
                    <p className="inline-flex gap-1">
                      <UsersIcon />
                      <span>{item.capacity} persons</span>
                    </p>
                  </div>
                  <Button
                    id="select_btn"
                    text="Select package"
                    className="mt-8 md:mt-auto w-full md:w-48"
                    onClick={() => {
                      handleClick({
                        rental_cost: item.rental_cost,
                        departure: item.departure,
                        arrival: item.arrival,
                        rent_type: item.type,
                      });
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

const rentalPackages = [
  {
    type: "within marina",
    title: "Rent Within Marina",
    src: BoatURL,
    capacity: "10-15",
    duration: "hour",
    rental_cost: 150000,
    departure: "Marina, Calabar",
    arrival: "Marina, Calabar",
  },
  {
    type: "uyo to calabar",
    title: "Uyo to Calabar",
    src: BoatURL2,
    capacity: "10-15",
    duration: "trip",
    rental_cost: 300000,
    departure: "Nwaniba Timber Beach, Uyo",
    arrival: "Marina, Calabar",
  },
  {
    type: "calabar to uyo",
    title: "Calabar to Uyo",
    src: BoatURL3,
    capacity: "10-15",
    duration: "trip",
    rental_cost: 300000,
    departure: "Marina, Calabar",
    arrival: "Nwaniba Timber Beach, Uyo",
  },
];

const StyledTabsTrigger = ({ value, title }) => {
  return (
    <TabsTrigger
      value={value}
      className="text-xs md:text-base px-1 data-[state=active]:px-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white py-3 hover:bg-blue-50 rounded-3xl transition-all !duration-150 !ease-in-out"
    >
      {title}
    </TabsTrigger>
  );
};

StyledTabsTrigger.propTypes = {
  value: PropTypes.string,
  title: PropTypes.string,
};

export const RentalForm = () => {
  const { rentalData, setRentalData } = React.useContext(BookingCTX);
  const { onPrevClick, onNextClick } = useStepper();
  const { rental_time, ...otherRentalData } = rentalData;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, defaultValues },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(rentalSchema),
    defaultValues: {
      ...otherRentalData,
      ...(rentalData?.rental_time && {
        [rental_time]: dayjs(
          new Date(
            `${format(rentalData.rental_date, "PPP")} ${rentalData.rental_time}`
          )
        ),
      }),
    },
    context: { rentalType: rentalData.rent_type },
  });

  const onSubmit = handleSubmit((formData) => {
    const total_cost = formData?.rental_duration
      ? Number(rentalData.rental_cost) *
        Number(formData.rental_duration.split(" ")[0])
      : Number(rentalData.rental_cost);

    const rental_time = format(
      addHours(new Date(formData.rental_time), 0),
      "p"
    );
    setRentalData((prev) => ({
      ...prev,
      ...formData,
      total_cost,
      rental_time,
    }));
    onNextClick();
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRentalData((prev) => ({ ...prev, [name]: String(value) }));
  };

  const handleCancel = () => {
    onPrevClick();
    setRentalData({});
  };

  return (
    <>
      <hgroup className=" mb-10">
        <h2 className="text-base font-semibold">Rental Details</h2>
        <p className="text-sm">Please fill in your rental details</p>
      </hgroup>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-3 gap-3">
          <InputField
            {...register("first_name")}
            label="First Name"
            placeholder="Enter first name"
            type="text"
            maxLength={35}
            errors={errors}
            handlechange={handleChange}
          />
          <InputField
            {...register("surname")}
            label="Surname"
            placeholder="Enter surname"
            type="text"
            maxLength={35}
            errors={errors}
            handlechange={handleChange}
          />
          <InputField
            {...register("email")}
            label="Email Address"
            placeholder="Enter email address"
            type="email"
            maxLength={40}
            errors={errors}
            handlechange={handleChange}
          />
          <InputField
            {...register("phone_number")}
            label="Phone Number"
            placeholder="(+234) XXXX XXX XXX"
            type="tel"
            errors={errors}
            handlechange={handleChange}
          />
          <SelectField
            {...register("passengers")}
            label="Passengers"
            placeholder="0"
            options={["10", "11", "12", "13", "14", "15"]}
            errors={errors}
            handlechange={handleChange}
            defaultValue={defaultValues?.passengers}
          />
          <div className="flex flex-col w-full">
            <label className="text-xs md:text-sm !w-full flex flex-col ">
              Rental Date
              <Controller
                control={control}
                name="rental_date"
                render={({ field }) => (
                  <DatePicker
                    minDate={new Date().toISOString().split("T")[0]}
                    icon={<CalendarIcon />}
                    showIcon
                    toggleCalendarOnIconClick={true}
                    closeOnScroll
                    className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
                    onChange={(date) => {
                      field.onChange(date);
                      handleChange({
                        target: { name: "rental_date", value: date },
                      });
                    }}
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
            {errors?.rental_date && (
              <p className="text-xs pt-2 text-red-700">
                {errors?.rental_date.message}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col relative">
              Rental Time
              <Controller
                control={control}
                name="rental_time"
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeField
                      {...field}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          display: "none",
                        },
                        "& .MuiInputBase-root": {
                          height: { xs: "2.5rem", md: "3rem" },
                          borderRadius: "0.5rem",
                          borderColor: "#3366CC",
                          bgcolor: "#EBF0FA",
                          borderWidth: "1px",
                          paddingX: "14px",
                        },
                        "& .MuiInputBase-input": { padding: 0 },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
              <div className="absolute right-4 bottom-3 md:bottom-4">
                <ClockIcon />
              </div>
            </label>
            {errors?.rental_time && (
              <p className="text-xs pt-2 text-red-700">
                {errors?.rental_time.message}
              </p>
            )}
          </div>

          {rentalData.rent_type == "within marina" && (
            <SelectField
              {...register("rental_duration")}
              label="Rental Duration"
              placeholder="1 Hour"
              options={["1 Hour", "2 Hours", "3 Hours", "4 Hours", "5 Hours"]}
              errors={errors}
              handlechange={handleChange}
              defaultValue={defaultValues.rental_duration}
            />
          )}
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-5 mt-10">
          <Button
            text="Cancel"
            variant="outline"
            className="w-full md:w-40"
            onClick={handleCancel}
          />
          <Button
            text="Proceed to checkout"
            type="submit"
            className="w-full md:w-48"
            onClick={onSubmit}
          />
        </div>
      </form>
    </>
  );
};

const RentalSummary = () => {
  const { rentalData } = React.useContext(BookingCTX);
  const { onPrevClick } = useStepper();
  const { onlineRentalPayment } = usePayment();

  const getArrivalDateTime = () => {
    const dateTime = new Date(
      `${format(rentalData.rental_date, "PP")} ${rentalData.rental_time}`
    );
    const duration = rentalData.rental_duration.split(" ")[0];
    const arrivalTime = addHours(dateTime, duration);
    return format(arrivalTime, "p");
  };

  return (
    <div className="flex flex-col md:flex-row-reverse md:divide-x-2 md:divide-x-reverse">
      <div className="md:basis-5/12 md:pl-10 flex flex-col gap-6">
        <h3 className="text-blue-500 font-semibold text-base ">
          Rental Summary
        </h3>

        <div className="space-y-1 text-sm -mt-2">
          <h4 className="font-semibold mb-1">Rentage Route</h4>
          <p>
            <span className="font-semibold text-sm md:text-base text-gray-500">
              From:
            </span>{" "}
            {rentalData?.departure}
          </p>
          <p>
            <span className="font-semibold text-sm md:text-base text-gray-500">
              To:
            </span>{" "}
            {rentalData?.arrival}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <div className="space-y-1">
            <h5 className="font-semibold text-sm">Departure Details</h5>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs md:text-sm font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
              <p>
                <CalendarIcon />
                {format(rentalData.rental_date, "PP")}
              </p>
              <p>
                <ClockIcon />
                {rentalData?.rental_time}
                {rentalData?.rental_duration
                  ? ` - ${getArrivalDateTime()}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs md:text-sm font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
              <p>
                <UsersIcon />
                {rentalData.passengers} passenger(s)
              </p>
              {rentalData?.rental_duration && (
                <p>
                  <Boat2Icon />
                  {rentalData.rental_duration}
                </p>
              )}
            </div>
          </div>
        </div>

        <ul className="md:hidden border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-5 [&_p:first-of-type]:text-xs  [&_p:last-of-type]:text-sm  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  ">
          <li>
            <p>First Name</p>
            <p>{rentalData.first_name}</p>
          </li>
          <li>
            <p>Surname</p>
            <p>{rentalData.surname}</p>
          </li>
          <li>
            <p>Phone Number</p>
            <p>{rentalData.phone_number}</p>
          </li>
          <li>
            <p>Email Address</p>
            <p>{rentalData?.email}</p>
          </li>
          <li>
            <p>Passengers</p>
            <p>{rentalData?.passengers}</p>
          </li>
          <li>
            <p>Rental Date</p>
            <p>{format(rentalData?.rental_date, "PP")}</p>
          </li>
          <li>
            <p>Rental Time</p>
            <p>{rentalData?.rental_time}</p>
          </li>
          {rentalData?.rental_duration && (
            <li>
              <p>Rental duration</p>
              <p>{rentalData?.rental_duration}</p>
            </li>
          )}
        </ul>

        <div className="border-y-2 border-dashed py-2 mt-5 md:mt-0">
          <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
            <tbody>
              {/* <tr>
                <td className="text-xs text-[#444444]">Ride Insurance</td>
                <td className="text-xs text-[#444444]">₦0</td>
              </tr> */}
              <tr>
                <td className="text-xs text-[#444444]">Rental Price</td>
                <td className="text-xs text-[#444444]">
                  {formatValue({
                    value: String(rentalData.rental_cost),
                    prefix: "₦",
                  })}
                  {rentalData.rental_duration &&
                    ` x ${rentalData.rental_duration}`}
                </td>
              </tr>
              <tr>
                <td className="font-medium text-base">Total</td>
                <td className="font-medium text-base">
                  {formatValue({
                    value: String(rentalData.total_cost),
                    prefix: "₦",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:basis-7/12 flex flex-col gap-5 md:pr-10">
        <div className="hidden md:block">
          <h2 className="text-base font-semibold text-blue-500">
            All Rental Details
          </h2>
          <ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-5 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  ">
            <li>
              <p>First Name</p>
              <p>{rentalData.first_name}</p>
            </li>
            <li>
              <p>Surname</p>
              <p>{rentalData.surname}</p>
            </li>
            <li>
              <p>Phone Number</p>
              <p>{rentalData.phone_number}</p>
            </li>
            <li>
              <p>Email Address</p>
              <p>{rentalData?.email}</p>
            </li>
            <li>
              <p>Passengers</p>
              <p>{rentalData?.passengers}</p>
            </li>
            <li>
              <p>Rental Date</p>
              <p>{format(rentalData?.rental_date, "PP")}</p>
            </li>
            <li>
              <p>Rental Time</p>
              <p>{rentalData?.rental_time}</p>
            </li>
            {rentalData?.rental_duration && (
              <li>
                <p>Rental duration</p>
                <p>{rentalData?.rental_duration}</p>
              </li>
            )}
          </ul>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-5 mt-10">
          <Button
            text="Back"
            variant="outline"
            className="w-full md:w-40"
            onClick={onPrevClick}
          />
          <Button
            id="rental_payment_btn"
            text="Pay with Paystack"
            onClick={onlineRentalPayment}
            className=" w-full md:w-48"
          />
        </div>
      </div>
    </div>
  );
};
