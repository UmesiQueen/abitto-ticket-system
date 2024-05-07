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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Alert from "@mui/material/Alert";
import { v4 as uuid } from "uuid";
import axios from "axios";
// import { z } from "zod";
import { BookingCTX } from "../context/BookingContext";

const Booking = () => {
  const [value, setValue] = React.useState("1");
  const { alert } = React.useContext(BookingCTX);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="bg-hero-pattern min-h-[1230px] w-screen bg-cover bg-no-repeat bg-center relative ">
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
      {alert && (
        <div className="absolute top-24 w-fit left-0 right-0 mx-auto ">
          <Alert
            variant="outlined"
            className=" backdrop-blur"
            sx={{
              color: "#fff",
              borderColor: "#244891",
              borderWidth: "2px",
              backgroundColor: "#3366CC83",
              "& .MuiAlert-icon": { color: "#fff" },
            }}
            severity="info"
          >
            Please a book a ticket to view summary.
          </Alert>
        </div>
      )}
    </div>
  );
};

export default Booking;

const BookingForm = ({ tab }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = React.useState(false);
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
        console.error(err, "Error occurred.");
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-poppins md:p-5 ">
      <div className="space-y-5">
        <h3 className="font-medium text-base ">Booking Details</h3>

        <SelectField
          {...register("travel_from", { required: "Field is required." })}
          label="Travelling From"
          placeholder="Select Departure Terminal"
          options={["Calabar ==> Marina", "Uyo ==> Nwaniba Timber Beach"]}
          errors={errors}
        />

        <SelectField
          {...register("travel_to", { required: "Field is required." })}
          label="Travelling To"
          placeholder="Select Arrival Terminal"
          options={["Calabar ==> Marina", "Uyo ==> Nwaniba Timber Beach"]}
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
            <InputField
              {...register("departure_date", {
                required: "Field is required.",
              })}
              label="Date of Departure"
              placeholder="02/04/2024"
              type="date"
              errors={errors}
            />
          </div>
          <div className="w-1/2  md:w-full grow">
            <SelectField
              {...register("departure_time", {
                required: "Field is required.",
              })}
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
            <InputField
              {...register("return_date", { required: "Field is required." })}
              label="Date of Return"
              placeholder="02/04/2024"
              type="date"
              errors={errors}
            />
            <SelectField
              {...register("return_time", { required: "Field is required." })}
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
            {...register("adults_number", { required: "Field is required." })}
            label="No. of Adults"
            placeholder="1"
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            errors={errors}
          />
          <SelectField
            {...register("children_number")}
            label="No. of Children"
            placeholder="1"
            options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            errors={errors}
          />
        </div>
      </div>

      <div className=" mt-10 space-y-5">
        <h3 className="font-medium text-base ">Passenger Details</h3>
        <div className="flex gap-5">
          <InputField
            {...register("first_name", { required: "Field is required." })}
            label="First Name"
            placeholder="john"
            type="text"
            errors={errors}
          />
          <InputField
            {...register("surname", { required: "Field is required." })}
            label="Surname"
            placeholder="doe"
            type="text"
            errors={errors}
          />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-5">
          <InputField
            {...register("email", { required: "Field is required." })}
            label="Email Address"
            placeholder="johndoe@gmail.com"
            type="email"
            errors={errors}
          />
          <InputField
            {...register("phone_number", { required: "Field is required." })}
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
          className="h-10 bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full rounded-none "
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
  const { label, placeholder, options, name, errors } = props;
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm w-full flex gap-3 flex-col ">
        {label}
        <Select
          ref={ref}
          {...props}
          value={value}
          onChange={handleChange}
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
        <p className="text-xs pt-2 text-red-700">Field is required.</p>
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
