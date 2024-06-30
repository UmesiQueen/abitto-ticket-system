import React from "react";
import { Helmet } from "react-helmet-async";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Cloud2Icon } from "@/assets/icons";

const Settings = () => {
  const [value, setValue] = React.useState("");

  return (
    <>
      <Helmet>
        <title>Settings | Admin</title>
      </Helmet>
      <h1 className="font-semibold text-lg ">Settings</h1>
      <div className="bg-white rounded-lg p-8 mb-5 mt-8 ">
        <div className="flex gap-16">
          <div className="basis-8/12 space-y-8">
            <div className="flex gap-6">
              <label className="w-full text-sm font-medium flex gap-3 flex-col ">
                First Name
                <input
                  className="h-12 p-3 rounded-lg border-2 border-[#f1f1f1] font-normal text-xs w-full"
                  type="text"
                  value="Jessica"
                />
              </label>
              <label className="w-full text-sm font-medium flex gap-3 flex-col ">
                Last Name
                <input
                  className="h-12 p-3 rounded-lg border-2 border-[#f1f1f1] font-normal text-xs w-full"
                  type="text"
                  value="Albert"
                />
              </label>
            </div>
            <div className="flex gap-6">
              <label className="w-full text-sm font-medium flex gap-3 flex-col ">
                Email
                <input
                  className="h-12 p-3 rounded-lg border-2 border-[#f1f1f1] font-normal text-xs w-full"
                  type="email"
                  placeholder="Enter email address"
                />
              </label>
              <label className="text-sm w-full flex gap-3 flex-col ">
                Gender
                <Select
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                  }}
                  displayEmpty
                  renderValue={
                    value !== ""
                      ? undefined
                      : () => (
                          <span className="noTranslate text-xs font-poppins text-[#9fa6b2]">
                            Select gender
                          </span>
                        )
                  }
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    "& .MuiOutlinedInput-notchedOutline": { display: "none" },
                  }}
                  className="h-10 rounded-lg border-2 border-[#f1f1f1] font-normal text-xs w-full"
                >
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                </Select>
              </label>
            </div>
            <div className="flex gap-6">
              <label className="w-full text-sm font-medium flex gap-3 flex-col ">
                Location
                <input
                  className="h-12 p-3 rounded-lg border-2 border-[#f1f1f1] font-normal text-xs w-full"
                  type="text"
                  value="Nigeria"
                />
              </label>
              <label className="w-full text-sm font-medium flex gap-3 flex-col ">
                City
                <input
                  className="h-12 p-3 rounded-lg border-2 border-[#f1f1f1] font-normal text-xs w-full"
                  type="text"
                  placeholder="Enter city"
                />
              </label>
            </div>
          </div>

          <div className=" basis-4/12 flex flex-col">
            <div className=" bg-[#5e548e] rounded-full overflow-hidden h-56 aspect-square mx-auto">
              <img alt="profile" src="https://i.ibb.co/bKKvY14/Queen.png" />
            </div>
            <p className="text-base text-blue-500 font-medium flex gap-2 justify-center items-center my-auto">
              <Cloud2Icon /> Upload Profile Picture
            </p>
          </div>
        </div>

        <button className=" bg-blue-500 w-32 py-3 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center gap-2 my-8 rounded-lg ">
          Update
        </button>
      </div>
    </>
  );
};

export default Settings;
