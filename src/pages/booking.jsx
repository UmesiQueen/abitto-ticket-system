/* eslint-disable react/prop-types */
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import { styled } from "@mui/material/styles";
import classNames from "classnames";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { v4 as uuid } from "uuid";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "../assets/icons";
import { BookingCTX } from "../context/BookingContext";
import { GlobalCTX } from "../context//GlobalContext";

const Booking = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="bg-hero-pattern h-[1350px] w-screen bg-cover bg-no-repeat bg-center relative ">
      <div className="bg-black/40 w-full h-full absolute z-0 ">
        <div className="px-5 md:px-0 pt-28 md:w-[690px] mx-auto pb-10 md:pb-0 ">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
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
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ background: "#fff" }}>
                <BookingForm tab="One-Way Trip" />
              </TabPanel>
              <TabPanel value="2" sx={{ background: "#fff" }}>
                <BookingForm tab="Round Trip" />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Booking;

const BookingSchema = yup.object().shape({
  travel_from: yup.string().required("Traveling from is required."),
  travel_to: yup
    .string()
    .required("Traveling to is required.")
    .when("travel_from", (travel_from, schema) =>
      travel_from[0]
        ? schema.notOneOf(
            [yup.ref("travel_from")],
            "Destination and departure cannot be the same."
          )
        : schema
    ),
  departure_date: yup.string().required("Departure date is required."),
  departure_time: yup.string().required("Departure time is required."),
  return_date: yup
    .string()
    .when("$roundTrip", (isRoundTrip, field) =>
      isRoundTrip[0]
        ? field.required("Return date is required.")
        : field.notRequired()
    ),
  return_time: yup
    .string()
    .when("$roundTrip", (isRoundTrip, field) =>
      isRoundTrip[0]
        ? field.required("Return time is required.")
        : field.notRequired()
    ),
  adults_number: yup
    .number()
    .required("No of adults is required.")
    .typeError("No of adults is required."),
  children_number: yup
    .number()
    .nullable(true)
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .notRequired(),
  first_name: yup
    .string()
    .required("First name is required.")
    .min(2, "First name must have a min of 2 characters."),
  surname: yup
    .string()
    .required("Surname is required.")
    .min(2, "Surname must have at least 2 characters."),
  email: yup
    .string()
    .required("Email address is required.")
    .email("Invalid email."),
  phone_number: yup
    .string()
    .required("Phone number is required.")
    .matches(/^\+?\d+$/, "Invalid phone number.")
    .min(11, "Phone number must have at least 11 characters."),
});

const BookingForm = ({ tab }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(BookingSchema),
    context: { roundTrip: tab === "Round Trip" ? true : false },
  });

  const { loading, setLoading, handleAlert } = React.useContext(GlobalCTX);
  const { setFormData } = React.useContext(BookingCTX);
  const navigate = useNavigate();
  const ticket_id = uuid();

  const onSubmit = (formData) => {
    setLoading(true);
    axios
      .post("https://abitto-api.onrender.com/api/booking/new", {
        ticket_id: ticket_id.slice(0, 6),
        trip_type: tab,
        ...formData,
      })
      .then((res) => {
        if (res.status === 200) {
          setFormData(res.data?.booking);
          setLoading(false);
          navigate("/ticket-summary");
        }
      })
      .catch((err) => {
        setLoading(false);
        handleAlert("error");
        console.error(err, "Error occurred.");
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-poppins md:p-5 ">
      <div className="space-y-5">
        <h3 className="font-medium text-base ">Booking Details</h3>

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
          className={classNames(
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
                      placeholderText="dd/mm/yyyy"
                      icon={<CalendarIcon />}
                      showIcon
                      toggleCalendarOnIconClick={true}
                      closeOnScroll
                      className="bg-blue-50 h-10 border border-blue-500 font-normal text-xs w-full !px-4 !rounded-none placeholder:text-xs font-poppins placeholder:text-[#9fa6b2] mt-3"
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
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
              placeholder="08:30 AM"
              options={[
                "08:30 AM",
                "10:30 AM",
                "12:30 PM",
                "02:30 PM",
                "05:00 PM",
              ]}
              errors={errors}
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
                      placeholderText="dd/mm/yyyy"
                      icon={<CalendarIcon />}
                      showIcon
                      toggleCalendarOnIconClick={true}
                      closeOnScroll
                      className="bg-blue-50 h-10 border border-blue-500 font-normal text-xs w-full !px-4 !rounded-none placeholder:text-xs font-poppins placeholder:text-[#9fa6b2] mt-3"
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
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
              placeholder="08:30 AM"
              options={[
                "08:30 AM",
                "10:30 AM",
                "12:30 PM",
                "02:30 PM",
                "05:00 PM",
              ]}
              errors={errors}
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

      <div className=" mt-10 space-y-5">
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

      <button
        type="submit"
        className="mt-10 bg-blue-500 h-12 w-36 flex items-center justify-center font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white"
      >
        {loading ? (
          <ClipLoader
            color="#fff"
            loading={loading}
            size={30}
            aria-label="Loading Spinner"
          />
        ) : (
          "Search Trip"
        )}
      </button>
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
          value={value}
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

// const StyledTabList = styled((props) => (
//   <TabList
//     {...props}
//     TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
//   />
// ))({
//   "& .MuiTabs-indicator": {
//     display: "flex",
//     justifyContent: "center",
//     height: "100%",
//     backgroundColor: "3366cc",
//   },
//   "& .MuiTabs-indicatorSpan": {
//     width: "100%",
//     height: "15px",
//     borderRadius: "49% 49% 0% 0% / 88% 89% 11% 12%;",
//     marginTop: "auto",
//     backgroundColor: "#D9D9D91F",
//   },
// });
