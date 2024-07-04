/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Cloud2Icon,
  UserIcon,
  EditIcon,
  PasswordIcon,
  CalendarIcon,
  ClockIcon,
} from "@/assets/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectField from "@/components/custom/SelectField";
import InputField from "@/components/custom/InputField";
import Button from "@/components/custom/Button";
import { toast } from "sonner";
import { Cross2Icon } from "@radix-ui/react-icons";
import { BookingCTX } from "@/contexts/BookingContext";
import PasswordField from "@/components/custom/PasswordField";
import {
  editProfileSchema,
  passwordSchema,
  scheduleTripSchema,
} from "@/lib/validators/settingSchema";

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Settings | Admin</title>
      </Helmet>
      <h1 className="font-semibold text-lg ">Settings</h1>
      <div className="bg-white rounded-lg p-8 pl-0 mb-5 mt-8 [&_label]:font-medium">
        <Tabs
          defaultValue="edit profile"
          className="flex gap-10 divide-x-2 divide-gray-500"
        >
          <TabsList className="flex flex-col gap-2 [&_button]:min-w-56 pl-4 h-full bg-transparent rounded-none ">
            <StyledTabsTrigger
              value="edit profile"
              title="Edit Profile"
              icon={<UserIcon />}
            />
            <StyledTabsTrigger
              value="change password"
              title="Change Password"
              icon={<PasswordIcon />}
            />
            <StyledTabsTrigger
              value="schedule trip"
              title="Schedule Trip"
              icon={<EditIcon />}
            />
          </TabsList>
          <StyledTabsContent value="edit profile" content={<EditProfile />} />
          <StyledTabsContent
            value="change password"
            content={<ChangePassword />}
          />
          <StyledTabsContent value="schedule trip" content={<ScheduleTrip />} />
        </Tabs>
      </div>
    </>
  );
};

const StyledTabsContent = ({ value, content }) => {
  return (
    <TabsContent
      value={value}
      className="data-[state=active]:flex-grow min-h-[420px] pl-10 mb-5  mt-0"
    >
      {content}
    </TabsContent>
  );
};

const StyledTabsTrigger = ({ value, title, icon }) => {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white py-3 hover:bg-gray-200 rounded-lg justify-start gap-2"
    >
      <span>{icon}</span>
      {title}
    </TabsTrigger>
  );
};

export default Settings;

const EditProfile = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(editProfileSchema),
  });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData, "form Data");
    toast.success("Profile successfully updated.");
  });

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="[&_input]:bg-white [&_input]:border-gray-500 space-y-8"
      >
        <div className="bg-[#5e548e] rounded-full overflow-hidden h-56 aspect-square mx-auto">
          <img alt="profile" src="https://i.ibb.co/bKKvY14/Queen.png" />
        </div>
        <p className="text-base text-blue-500 font-medium flex gap-2 justify-center items-center my-auto">
          <Cloud2Icon /> Upload Profile Picture
        </p>

        <div className="flex gap-6">
          <InputField
            {...register("first_name")}
            label="First Name"
            placeholder="Enter first name"
            type="text"
            maxLength={35}
            errors={errors}
          />
          <InputField
            {...register("last_name")}
            label="Last Name"
            placeholder="Enter last name"
            type="text"
            maxLength={35}
            errors={errors}
          />
        </div>
        <div className="flex gap-6">
          <InputField
            {...register("email")}
            label="Email"
            placeholder="Enter email address"
            type="email"
            maxLength={40}
            errors={errors}
          />
          <SelectField
            {...register("gender")}
            label="Gender"
            placeholder="Select gender"
            options={["Female", "Male"]}
            className="bg-white !border-gray-500"
            errors={errors}
          />
        </div>
        <div className="flex gap-6">
          <InputField
            {...register("location")}
            label="Location"
            placeholder="Enter location"
            type="text"
            maxLength={35}
            errors={errors}
          />
          <InputField
            {...register("city")}
            label="City"
            placeholder="Enter city"
            type="text"
            maxLength={35}
            errors={errors}
          />
        </div>

        <Button type="submit" className="w-32 " text="Update" />
      </form>
    </>
  );
};

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData, "form data");
    reset();
    toast.info("Password reset successful!");
  });

  return (
    <>
      <h2 className="font-semibold mb-10">Reset Password</h2>
      <form
        onSubmit={onSubmit}
        className="space-y-8 [&_input]:bg-white [&_input]:border-gray-500 w-[30rem]"
      >
        <PasswordField
          {...register("currentPassword")}
          label="Old Password"
          placeholder="Enter old password"
          errors={errors}
        />
        <PasswordField
          {...register("newPassword")}
          label="New Password"
          placeholder="Enter new password"
          errors={errors}
        />
        <PasswordField
          {...register("confirmPassword")}
          label="Re-Enter New Password"
          placeholder="Re-enter new password"
          errors={errors}
        />
        <Button className="w-32" type="submit" text="Update" />
      </form>
    </>
  );
};

const ScheduleTrip = () => {
  const [dateOptions, setDateOptions] = React.useState([]);
  const { loading, setLoading } = React.useContext(BookingCTX);

  const {
    control,
    handleSubmit,
    register,
    resetField,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(scheduleTripSchema),
    context: { date: dateOptions.length ? true : false },
  });

  const onSubmit = handleSubmit((formData) => {
    setLoading(true);

    setTimeout(() => {
      const formValues = {
        ...formData,
        ...(dateOptions.length
          ? {
              date: Array.from(
                new Set([format(formData.date, "PP"), ...dateOptions])
              ),
            }
          : { date: format(formData.date, "PP") }),
      };
      console.log(formValues, "formData");
      toast.success("Trip successfully scheduled!");
      reset();
      setLoading(false);
    }, 650);
  });

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
      <h2 className="font-semibold mb-10">Add Trip Schedule</h2>
      <form
        onSubmit={onSubmit}
        className="[&_input]:bg-white [&_input]:border-gray-500 pr-20 space-y-8"
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
          <div className="flex flex-col w-full">
            <label className="text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col relative">
              Time
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  {...register("time")}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { display: "none" },
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
          <InputField
            {...register("cost")}
            label="Ticket Cost"
            placeholder="Enter ticket cost"
            type="text"
            maxLength={35}
            errors={errors}
          />
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
            className="w-36 h-12 mt-8 mb-auto"
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
          text="Continue"
          type="submit"
          className="w-48"
          loading={loading}
        />
      </form>
    </>
  );
};
