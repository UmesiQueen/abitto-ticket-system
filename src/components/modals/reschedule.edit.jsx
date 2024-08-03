import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import DatePicker from "react-datepicker";
import { format, addHours } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import Button from "@/components/custom/Button";
import { CalendarIcon, ClockIcon, CancelSquareIcon } from "@/assets/icons";
import { Button as IconButton } from "@/components/ui/button";
import { useScheduleTrip } from "@/hooks/useScheduleTrip";
import ConfirmationModal from "@/components/modals/confirmation";

const rescheduleSchema = yup.object().shape({
  date: yup.string().required("Date field is required."),
  time: yup.string().required("Time field is required."),
});

const RescheduleEditModal = () => {
  // const [isDisabled, setIsDisabled] = React.useState(true);
  const { unMountPortalModal, setModalContent } = React.useContext(GlobalCTX);
  const { rescheduleRequest } = useScheduleTrip();
  const {
    tripDetails: { date, time, ...otherDetails },
  } = React.useContext(BookingCTX);
  const {
    control,
    formState: { errors },
    handleSubmit,
    // watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(rescheduleSchema),
    defaultValues: {
      date,
      time: dayjs(`${date} ${time}`),
    },
  });

  // const timeField = watch("time");
  // const dateField = watch("date");

  // React.useEffect(() => {
  //   checkChanges();
  // }, [timeField, dateField]);

  // const checkChanges = () => {
  //   const oldTimeDate = new Date(`${date} ${time}`);
  //   const newTimeDate = new Date(`${dateField} ${format(timeField.$d, "p")}`);

  //   console.log(newTimeDate, oldTimeDate);

  //   if (newTimeDate.match(oldTimeDate)) {
  //     console.log("here");
  //     return setIsDisabled(true);
  //   }
  //   return setIsDisabled(false);
  // };

  const onSubmit = handleSubmit((formData) => {
    const { time, ...otherFormData } = formData;
    const formValues = {
      time: format(addHours(time, 0), "p"),
      ...otherFormData,
      ...otherDetails,
    };

    setModalContent(
      <ConfirmationModal
        props={{
          header: "Are you sure you want to reschedule trip?",
          handleRequest: () => {
            rescheduleRequest(formValues);
          },
          severity: "warning",
        }}
      />
    );
  });

  return (
    <div className="bg-white rounded-lg p-10 pt-5 min-w-[700px] flex flex-col gap-5">
      <div className="flex flex-row-reverse items-center justify-between">
        <IconButton
          size="icon"
          variant="ghost"
          className=""
          onClick={unMountPortalModal}
        >
          <CancelSquareIcon />
        </IconButton>
        <h3 className="font-bold text-center grow">Edit Journey Details</h3>
      </div>
      <form onSubmit={onSubmit}>
        <div className="flex gap-8">
          <div className="flex flex-col w-full">
            <label className="font-semibold text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col relative">
              Select new time
              <Controller
                control={control}
                name="time"
                render={({ field }) => {
                  const { onChange, name, ...otherFields } = field;
                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimeField
                        {...otherFields}
                        onChange={(e) => {
                          onChange({ target: { name, value: e } });
                        }}
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
                  );
                }}
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
          <div className="flex flex-col w-full">
            <label className="font-semibold text-xs md:text-sm !w-full flex flex-col ">
              Select new date
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
        </div>
        <Button
          // disabled={isDisabled}
          type="submit"
          text="Continue"
          className="w-full mt-8 !h-12"
        />
      </form>
    </div>
  );
};

export default RescheduleEditModal;
