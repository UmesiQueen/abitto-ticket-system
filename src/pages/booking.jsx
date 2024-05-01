import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { styled } from "@mui/material/styles";
import classNames from "classnames";

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
              <TicketForm tab="1" />
            </TabPanel>
            <TabPanel value="2" sx={{ background: "#fff" }}>
              <TicketForm tab="2" />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default Booking;

// eslint-disable-next-line react/prop-types
const TicketForm = ({ tab }) => {
  return (
    <form className="font-poppins md:p-5 [&_label]:text-xs md:[&_label]:text-sm [&_label]:w-full [&_label]:flex [&_label]:gap-3 [&_label]:flex-col ">
      <div className="space-y-5">
        <h3 className="font-medium text-base ">Booking Details</h3>
        <InputField
          label="Travelling From"
          placeholder="Select Departure Terminal"
          type="text"
        />
        <InputField
          label="Travelling To"
          placeholder="Select Arrival Terminal"
          type="text"
        />
        {/* Departure Date */}
        <div
          className={classNames(
            "flex gap-5",
            tab === "1" ? "flex-wrap md:flex-nowrap" : ""
          )}
        >
          <label>
            Date of Departure
            <input
              type="text"
              className="bg-blue-50 p-3 border border-blue-500 font-normal text-xs  w-full "
              placeholder="21/04/2024"
            />
          </label>
          <label>
            Time of Departure
            <input
              type="text"
              className="bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full "
              placeholder="08:00 AM"
            />
          </label>
        </div>
        {/* Round Trip */}
        {tab === "2" && (
          <div className="flex gap-5">
            <label>
              Date of Return
              <input
                type="text"
                className="bg-blue-50 p-3 border border-blue-500 font-normal text-xs  w-full"
                placeholder="21/04/2024"
              />
            </label>
            <label>
              Time of Return
              <input
                type="text"
                className="bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full "
                placeholder="08:00 AM"
              />
            </label>
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
            type="number"
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

// eslint-disable-next-line react/prop-types
const InputField = ({ label, type, placeholder }) => {
  return (
    <label className="text-sm w-full flex gap-3 flex-col ">
      {label}
      <input
        type={type}
        className="bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full "
        placeholder={placeholder}
      />
    </label>
  );
};

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
});
