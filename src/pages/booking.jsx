/* eslint-disable react/prop-types */
import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import { styled } from "@mui/material/styles";
import classNames from "classnames";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const Booking = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="bg-hero-pattern min-h-[1100px] w-screen bg-cover bg-no-repeat bg-center relative ">
      {/* <div className="bg-black/40 w-full h-full absolute z-0 " /> */}
      <div className="h-fit px-5 md:px-0 pt-28 md:w-[690px] mx-auto pb-10 md:pb-0 ">
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
              <BookingForm tab="1" />
            </TabPanel>
            <TabPanel value="2" sx={{ background: "#fff" }}>
              <BookingForm tab="2" />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default Booking;

const BookingForm = ({ tab }) => {
  return (
    <form className="font-poppins md:p-5 [&_label]:text-xs md:[&_label]:text-sm [&_label]:w-full [&_label]:flex [&_label]:gap-3 [&_label]:flex-col ">
      <div className="space-y-5">
        <h3 className="font-medium text-base ">Booking Details</h3>

        <SelectField
          label="Travelling From"
          placeholder="Select Departure Terminal"
        />

        <SelectField
          label="Travelling To"
          placeholder="Select Arrival Terminal"
        />

        {/* Departure Date */}
        <div
          className={classNames(
            "flex gap-5",
            tab === "1" ? "flex-wrap md:flex-nowrap" : ""
          )}
        >
          <DateField label="Date of Departure" />
          <TimeField label="Time of Departure" />
        </div>
        {/* Round Trip */}
        {tab === "2" && (
          <div className="flex gap-5">
            <DateField label="Date of Return" />
            <TimeField label="Time of Return" />
          </div>
        )}
        <div className="flex gap-5">
          <InputField label="No. of Adults" placeholder="1" type="number" />
          <InputField label="No. of Children" placeholder="1" type="number" />
        </div>
      </div>

      <div className=" mt-10 space-y-5">
        <h3 className="font-medium text-base ">Passenger Details</h3>
        <div className="flex gap-5">
          <InputField label="First Name" placeholder="john" type="text" />
          <InputField label="Surname:" placeholder="doe" type="text" />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-5">
          <InputField
            label="Email Address"
            placeholder="johndoe@gmail.com"
            type="email"
          />
          <InputField
            label="Phone Number"
            placeholder="(+234) XXXX XXX XXX"
            type="tel"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-10 bg-green-500 py-3 px-6 font-semibold text-sm  hover:bg-green-700 transition-all duration-100  ease-in-out text-white"
      >
        Search Trip
      </button>
    </form>
  );
};

const InputField = ({ label, type, placeholder }) => {
  return (
    <label className="text-sm w-full flex gap-3 flex-col ">
      {label}
      <input
        type={type}
        min={0}
        className="bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full "
        placeholder={placeholder}
      />
    </label>
  );
};

const SelectField = ({ label, placeholder }) => {
  const [departure, setDeparture] = React.useState("");

  const handleChange = (event) => {
    setDeparture(event.target.value);
  };

  return (
    <label className="text-sm w-full flex gap-3 flex-col ">
      {label}
      <Select
        id="demo-simple-select"
        value={departure}
        onChange={handleChange}
        displayEmpty
        renderValue={
          departure !== ""
            ? undefined
            : () => (
                <span className="noTranslate text-xs font-poppins text-[#9fa6b2]">
                  {placeholder}
                </span>
              )
        }
        className="bg-blue-50 h-10 border border-blue-500 font-normal text-xs w-full !rounded-none"
      >
        <MenuItem value="calabar">Calabar</MenuItem>
        <MenuItem value="uyo">Uyo</MenuItem>
      </Select>
    </label>
  );
};

const DateField = ({ label }) => {
  const [value, setValue] = React.useState(dayjs("21/04/2024"));

  return (
    <label className="text-sm w-full flex gap-3 flex-col ">
      {label}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          sx={{
            "& .MuiInputBase-root": {
              height: "44px",
              borderRadius: "0",
              borderColor: "#3366CC",
              borderWidth: "1px",
              padding: "0 12px",
              backgroundColor: "#ebf0fa",
            },
          }}
          slotProps={{
            textField: { variant: "standard" },
          }}
        />
      </LocalizationProvider>
    </label>
  );
};

const TimeField = ({ label }) => {
  return (
    <label className="text-sm w-full flex gap-3 flex-col">
      {label}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          sx={{
            "& .MuiInputBase-root": {
              height: "44px",
              borderRadius: "0",
              borderColor: "#3366CC",
              borderWidth: "1px",
              padding: "0 12px",
              backgroundColor: "#ebf0fa",
            },
          }}
          slotProps={{
            textField: { variant: "standard" },
          }}
        />
      </LocalizationProvider>
    </label>
  );
};

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
