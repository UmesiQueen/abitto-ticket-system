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
import { BookingCTX } from "../context/BookingContext";

const Booking = () => {
  const [value, setValue] = React.useState("1");

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
                <BookingForm tab="one-way" />
              </TabPanel>
              <TabPanel value="2" sx={{ background: "#fff" }}>
                <BookingForm tab="round" />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
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

  const { setFormData } = React.useContext(BookingCTX);

  const onSubmit = (formData) => {
    setFormData(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-poppins md:p-5 ">
      <div className="space-y-5">
        <h3 className="font-medium text-base ">Booking Details</h3>

        <SelectField
          {...register("travel_from", { required: true })}
          label="Travelling From"
          placeholder="Select Departure Terminal"
          options={["Calabar", "Uyo"]}
          errors={errors}
        />

        <SelectField
          {...register("travel_to", { required: true })}
          label="Travelling To"
          placeholder="Select Arrival Terminal"
          options={["Calabar", "Uyo"]}
          errors={errors}
        />

        {/* Departure Date */}
        <div
          className={classNames(
            "flex gap-5",
            tab === "one-way" ? "flex-wrap md:flex-nowrap" : ""
          )}
        >
          <InputField
            {...register("departure_date", { required: true })}
            label="Date of Departure"
            placeholder="02/04/2024"
            type="date"
            errors={errors}
          />
          <InputField
            {...register("departure_time", { required: true })}
            label="Time of Departure"
            placeholder="08:00PM"
            type="time"
            errors={errors}
          />
        </div>

        {/* Round Trip */}
        {tab === "round" && (
          <div className="flex gap-5">
            <InputField
              {...register("return_date", { required: true })}
              label="Date of Return"
              placeholder="02/04/2024"
              type="date"
              errors={errors}
            />
            <InputField
              {...register("return_time", { required: true })}
              label="Time of Return"
              placeholder="08:00PM"
              type="time"
              errors={errors}
            />
          </div>
        )}

        <div className="flex gap-5">
          <SelectField
            {...register("adults_number", { required: true })}
            label="No. of Adults"
            placeholder="1"
            options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
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
            {...register("first_name", { required: true })}
            label="First Name"
            placeholder="john"
            type="text"
            errors={errors}
          />
          <InputField
            {...register("surname", { required: true })}
            label="Surname"
            placeholder="doe"
            type="text"
            errors={errors}
          />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-5">
          <InputField
            {...register("email", { required: true })}
            label="Email Address"
            placeholder="johndoe@gmail.com"
            type="email"
            errors={errors}
          />
          <InputField
            {...register("phone_number", { required: true })}
            label="Phone Number"
            placeholder="(+234) XXXX XXX XXX"
            type="tel"
            errors={errors}
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

// eslint-disable-next-line react/display-name
const InputField = React.forwardRef((props, ref) => {
  const { name, errors, label } = props;

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm w-full flex gap-3 flex-col ">
        {label}
        <input
          {...props}
          ref={ref}
          className="bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full rounded-none "
        />
      </label>
      {errors?.[name] && (
        <p className="text-xs pt-2 text-red-700">Field is required.</p>
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
          sx={{ "& .MuiOutlinedInput-notchedOutline": { display: "none" } }}
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
