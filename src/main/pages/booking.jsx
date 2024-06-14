/* eslint-disable react/prop-types */
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, CircleArrowLeftIcon } from "@/assets/icons";
import { BookingCTX } from "@/hooks/BookingContext";
import { GlobalCTX } from "@/hooks/GlobalContext";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import { bookingSchema } from "@/lib/validators/bookingSchema";
import { Button as IconButton } from "@/components/ui/button";
import Button from "@/components/custom/Button";

const Booking = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title>Booking | Abitto Ferry</title>
      </Helmet>
      <div className="bg-hero-pattern h-[1350px] w-screen bg-cover bg-no-repeat bg-center relative ">
        <div className="bg-black/40 w-full h-full absolute z-0 ">
          <div className="px-5 md:px-0 pt-36 md:w-[690px] mx-auto pb-10 md:pb-0 ">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <StyledTabList
                    onChange={handleChange}
                    aria-label="booking ticket forms"
                  >
                    <Tab
                      label="One-Way Trip"
                      value="1"
                      sx={{
                        background: "#FFFFFF99",
                        textTransform: "capitalize",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    />
                    <Tab
                      label="Round Trip"
                      value="2"
                      sx={{
                        background: "#FFFFFF99",
                        textTransform: "capitalize",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    />
                  </StyledTabList>
                </Box>
                <TabPanel value="1" sx={{ background: "#fff", padding: "0" }}>
                  <BookingForm tab="One-Way Trip" />
                </TabPanel>
                <TabPanel value="2" sx={{ background: "#fff", padding: "0" }}>
                  <BookingForm tab="Round Trip" />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;

const BookingForm = ({ tab }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    resetField,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(bookingSchema),
    context: { roundTrip: tab === "Round Trip" ? true : false },
  });

  const defaultTimeOptions = ["09:30 AM", "11:00 AM", "03:30 PM", "04:30 PM"];

  const { loading, setLoading } = React.useContext(GlobalCTX);
  const { setFormData } = React.useContext(BookingCTX);
  const [timeOptions, setTimeOptions] = React.useState({
    departure_time: defaultTimeOptions,
    return_time: defaultTimeOptions,
  });
  const navigate = useNavigate();
  const ticket_id = uuid();
  const travel_from = watch("travel_from");

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

  const onSubmit = (formData) => {
    const total_passengers =
      Number(formData.adults_number) + Number(formData.children_number);

    setLoading(true);
    setTimeout(() => {
      setFormData({
        ticket_id: ticket_id.slice(0, 6),
        trip_type: tab,
        total_passengers,
        amount:
          Number(total_passengers) * (tab === "One-Way Trip" ? 8800 : 17600),
        ...formData,
      });
      setLoading(false);
      navigate("/ticket-summary");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-poppins pb-10">
      <div className="space-y-5 py-8 px-10">
        <div className="flex items-center gap-1 -ml-2">
          <IconButton
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            <CircleArrowLeftIcon />
          </IconButton>
          <h3 className="font-medium text-base ">Booking Details</h3>
        </div>

        <SelectField
          {...register("travel_from")}
          label="Traveling From"
          placeholder="Select Departure Terminal"
          options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
          errors={errors}
        />

        <SelectField
          {...register("travel_to")}
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
              <label className="text-sm !w-full flex flex-col ">
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
                      className="bg-blue-50 h-10 border border-blue-500 font-normal w-full !px-4 !rounded-none font-poppins mt-3 text-left"
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
              <label className="text-sm !w-full flex flex-col ">
                Date of Return
                <Controller
                  control={control}
                  name="return_date"
                  render={({ field }) => (
                    <DatePicker
                      minDate={new Date().toISOString().split("T")[0]}
                      icon={<CalendarIcon />}
                      showIcon
                      toggleCalendarOnIconClick={true}
                      closeOnScroll
                      className="bg-blue-50 h-10 border border-blue-500 font-normal w-full !px-4 !rounded-none font-poppins mt-3 text-left"
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
            label="No. of Adults"
            placeholder="0"
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            errors={errors}
          />
          <SelectField
            {...register("children_number")}
            label="No. of Children"
            placeholder="0"
            options={["", 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            errors={errors}
          />
        </div>
      </div>

      <div className="space-y-5 py-8 px-10 border-dashed border-t-[3px] border-gray-400 ">
        <h3 className="font-medium text-base ">Passenger Details</h3>
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

      <Button
        text="Continue"
        type="submit"
        loading={loading}
        className="px-4 mt-2 ml-10"
      />
    </form>
  );
};

// eslint-disable-next-line react/display-name
const InputField = React.forwardRef((props, ref) => {
  const { name, errors, label } = props;

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm !w-full flex gap-3 flex-col ">
        {label}
        <input
          {...props}
          ref={ref}
          className="h-10 bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full rounded-none font-poppins "
        />
      </label>
      {errors?.[name] && (
        <p className="text-xs pt-2 text-red-700">{errors?.[name].message}</p>
      )}
    </div>
  );
});

// eslint-disable-next-line react/display-name
const SelectField = React.forwardRef((props, ref) => {
  const { label, placeholder, options, name, errors, onChange } = props;
  const [value, setValue] = React.useState("");

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm w-full flex gap-3 flex-col ">
        {label}
        <Select
          ref={ref}
          {...props}
          value={options.includes(value) ? value : ""}
          onChange={(event) => {
            setValue(event.target.value);
            onChange(event);
          }}
          displayEmpty
          renderValue={
            value !== ""
              ? undefined
              : () => (
                  <span className="noTranslate text-xs font-poppins text-[#9fa6b2]">
                    {placeholder}
                  </span>
                )
          }
          sx={{
            "& .MuiOutlinedInput-notchedOutline": { display: "none" },
          }}
          className="bg-blue-50 h-10 border border-blue-500 font-normal text-xs w-full !rounded-none"
        >
          {options.map((option, index) => {
            return (
              <MenuItem value={option} key={index}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </label>
      {errors?.[name] && (
        <p className="text-xs pt-2 text-red-700">{errors?.[name].message}</p>
      )}
    </div>
  );
});

const StyledTabList = styled((props) => (
  <TabList
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "3366cc",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    height: "15px",
    borderRadius: "49% 49% 0% 0% / 88% 89% 11% 12%;",
    marginTop: "auto",
    backgroundColor: "#D9D9D91F",
  },
  "& .css-1ro49qa-MuiButtonBase-root-MuiTab-root.Mui-selected": {
    color: "white",
    background: "transparent",
    zIndex: 1,
  },
  "& .MuiTab-root": {
    width: "140px",
  },
});
