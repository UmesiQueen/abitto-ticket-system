/* eslint-disable react/prop-types */
// import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Cloud2Icon, UserIcon, PasswordIcon } from "@/assets/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectField from "@/components/custom/SelectField";
import InputField from "@/components/custom/InputField";
import Button from "@/components/custom/Button";
import { toast } from "sonner";
import PasswordField from "@/components/custom/PasswordField";
import {
  editProfileSchema,
  passwordSchema,
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
            {/* <StyledTabsTrigger
              value="schedule trip"
              title="Schedule Trip"
              icon={<EditIcon />}
            /> */}
          </TabsList>
          <StyledTabsContent value="edit profile" content={<EditProfile />} />
          <StyledTabsContent
            value="change password"
            content={<ChangePassword />}
          />
          {/* <StyledTabsContent value="schedule trip" content={<ScheduleTrip />} /> */}
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
        <ProfileImage />

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

const ProfileImage = () => {
  const currentImageUrl = "https://i.ibb.co/bKKvY14/Queen.png";
  // const [imgUrl, setImgUrl] = React.useState(currentImageUrl);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file, "result");

    const reader = new FileReader();
    reader.addEventListener("onload", () => {
      const imageUrl = reader.result?.toString() || "";
      console.log(imageUrl, "image url");
      reader.readAsDataURL(file);
    });
    // setImgUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      <div className="bg-[#e3dff4] rounded-full overflow-hidden h-56 aspect-square mx-auto">
        <img
          alt="profile"
          src={currentImageUrl}
          className=" w-full h-full object-cover"
        />
      </div>
      <label
        htmlFor="image_uploads"
        className="text-base text-blue-500 font-medium flex gap-2 items-center w-fit mx-auto py-1 px-2 rounded-lg cursor-pointer hover:bg-blue-50"
      >
        <Cloud2Icon /> Upload Profile Picture
      </label>
      <input
        type="file"
        id="image_uploads"
        name="image_uploads"
        className="hidden"
        accept=".jpg, .jpeg, .png"
        onChange={handleImageUpload}
      />
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
