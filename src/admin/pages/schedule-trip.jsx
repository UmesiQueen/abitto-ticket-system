import React from "react";
import { Helmet } from "react-helmet-async";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon, ClockIcon, CircleArrowLeftIcon } from "@/assets/icons";
import SelectField from "@/components/custom/SelectField";
import Button from "@/components/custom/Button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { BookingCTX } from "@/contexts/BookingContext";
import { scheduleTripSchema } from "@/lib/validators/scheduleTripSchema";
import { NumericFormat } from "react-number-format";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { Button as ButtonIcon } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScheduleTrip } from "@/hooks/useScheduleTrip";
import ConfirmationModal from "@/components/modals/confirmation";

const ScheduleTrip = () => {
  const [dateOptions, setDateOptions] = React.useState([]);
  const { loading } = React.useContext(BookingCTX);
  const { mountPortalModal } = React.useContext(GlobalCTX);
  const { scheduleRequest } = useScheduleTrip();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    register,
    resetField,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(scheduleTripSchema),
    context: { date: dateOptions.length ? true : false },
  });

  const onSubmit = handleSubmit((formData) => {
    const { cost, date, time, departure, arrival } = formData;
    const costString = formatCost(cost);

    const dateArray = date
      ? [...new Set([format(date, "PP"), ...dateOptions])]
      : dateOptions;

    const formValues = {
      departure,
      arrival,
      dates: dateArray,
      trip_status: "Upcoming",
      time: format(time, "p"),
      ticket_cost: costString,
      boat_id: "1024924d3",
    };

    mountPortalModal(
      <ConfirmationModal
        props={{
          header: "Are you sure you want to add this changes?",
          handleRequest: () => {
            scheduleRequest(handleReset, formValues);
          },
          severity: "warning",
        }}
      />
    );
  });

  const formatCost = (cost) => {
    return cost
      .substring(1)
      .split("")
      .filter((cost) => cost !== ",")
      .join("");
  };

  const handleReset = () => {
    const defaultValues = {
      departure: "",
      arrival: "",
      //   time: "",
      cost: "",
      date: "",
    };
    reset(defaultValues);
    setDateOptions([]);
  };

  const handleAddDate = () => {
    const date = watch("date");

    if (date) {
      setDateOptions((prev) =>
        Array.from(new Set([...prev, format(date, "PP")]))
      );
      resetField("date");
    }
  };

  const handleDeleteDate = (date) => {
    setDateOptions((prev) => prev.filter((options) => options !== date));
  };

  return (
    <>
      <Helmet>
        <title>Schedule Trip | Admin</title>
      </Helmet>

      <div className="flex gap-1 items-center mb-10 ">
        <ButtonIcon size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <CircleArrowLeftIcon />
        </ButtonIcon>
        <h1 className="font-semibold text-lg">Schedule New Trip</h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="[&_input]:bg-white [&_input]:border-gray-500 space-y-8 bg-white rounded-lg p-10 mb-5 mt-8 [&_label]:font-medium "
      >
        <div className="flex gap-6">
          <SelectField
            {...register("departure")}
            label="Departure"
            placeholder="Select Departure Terminal"
            options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
            className="bg-white !border-gray-500"
            errors={errors}
          />
          <SelectField
            {...register("arrival")}
            label="Arrival"
            placeholder="Select Arrival Terminal"
            options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
            className="bg-white !border-gray-500"
            errors={errors}
          />
        </div>
        <div className="flex gap-6">
          {/* Time Field */}
          <div className="flex flex-col w-full">
            <label className="text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col relative">
              Time
              <Controller
                control={control}
                name="time"
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeField
                      {...field}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          display: "none",
                        },
                        "& .MuiInputBase-root": {
                          height: "3rem",
                          borderRadius: "0.5rem",
                          borderColor: "#6b7280",
                          borderWidth: "1px",
                          paddingX: "14px",
                        },
                        "& .MuiInputBase-input": { padding: 0 },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
              <div className="absolute right-4 bottom-4">
                <ClockIcon />
              </div>
            </label>
            {errors?.time && (
              <p className="text-xs pt-2 text-red-700">
                {errors?.time.message}
              </p>
            )}
          </div>

          {/* NumericFormat Input Field */}
          <div className="flex flex-col w-full">
            <label className="text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col">
              Ticket Cost
              <Controller
                control={control}
                name="cost"
                render={({ field: { name, onChange, onBlur, value, ref } }) => {
                  return (
                    <NumericFormat
                      prefix="₦"
                      getInputRef={ref}
                      onBlur={onBlur}
                      name={name}
                      value={value}
                      placeholder="Enter ticket cost"
                      thousandSeparator=","
                      allowNegative={false}
                      onValueChange={(_, sourceInfo) => {
                        onChange(sourceInfo.event);
                      }}
                      className="h-10 md:h-12 bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins"
                    />
                  );
                }}
              />
            </label>
            {errors?.cost && (
              <p className="text-xs pt-2 text-red-700">
                {errors?.cost.message}
              </p>
            )}
          </div>
        </div>

        {/* Date Field */}
        <div className="flex gap-3">
          <div className="flex flex-col w-full">
            <label className="text-xs md:text-sm !w-full flex flex-col ">
              Select Trip Days
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    minDate={new Date().toISOString().split("T")[0]}
                    icon={<CalendarIcon />}
                    showIcon
                    toggleCalendarOnIconClick={true}
                    closeOnScroll
                    className=" h-10 md:h-12 border border-gray-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
                    onChange={(date) => {
                      field.onChange(date);
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
            {errors?.date && (
              <p className="text-xs pt-2 text-red-700">
                {errors?.date.message}
              </p>
            )}
          </div>
          <Button
            text="Add"
            className="w-36 mt-8 mb-auto"
            onClick={handleAddDate}
          />
        </div>
        {dateOptions.length ? (
          <ul className="flex gap-2">
            {dateOptions.map((date, index) => (
              <li
                key={index}
                className="border border-blue-500/60 bg-blue-50 rounded-lg inline-flex gap-1 items-center text-xs p-2 px-3 font-semibold"
              >
                {date}
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteDate(date);
                  }}
                >
                  <Cross2Icon />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
        <Button
          text="Create new trip"
          type="submit"
          className="w-full !mt-12 py-6"
          loading={loading}
        />
      </form>
    </>
  );
};

export default ScheduleTrip;
