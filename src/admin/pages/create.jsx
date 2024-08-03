import React from "react";
import { Helmet } from "react-helmet-async";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/custom/Button";
import { useNavigate } from "react-router-dom";
import { ShipIcon, TicketIcon } from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { CheckSquareIcon } from "lucide-react";

const Create = () => {
  const [isChecked, setIsChecked] = React.useState();
  const { adminProfile } = React.useContext(GlobalCTX);
  const navigate = useNavigate();

  const handleIsChecked = (e) => {
    const target = e.target.id;
    setIsChecked({ [target]: true });
  };

  return (
    <>
      <Helmet>
        <title>Create | Admin</title>
      </Helmet>
      <div className="bg-white rounded-lg p-10">
        <hgroup className="text-center space-y-2">
          <h1 className="font-semibold text-2xl">
            Welcome Back, {adminProfile?.first_name}
          </h1>
          <p className="text-sm text-gray-500">
            What are you doing today? Select an option to create a new activity.
          </p>
        </hgroup>
        <div className="my-20 space-y-20 max-w-[1040px] mx-auto">
          <div className="flex gap-5 justify-between">
            <div
              data-checked={isChecked?.book_ticket}
              className="relative flex flex-col justify-between  hover:bg-blue-50/40 border-2 border-gray-500 data-[checked=true]:scale-105 data-[checked=true]:text-blue-500 data-[checked=true]:border-blue-500 rounded-lg p-5 grow w-72 min-h-44 shadow-sm overflow-hidden transition-all duration-150 ease-in-out"
            >
              <button
                id="book_ticket"
                onClick={handleIsChecked}
                className="absolute z-1 w-full h-full top-0 left-0 right-0 rounded-lg"
              />
              <div className="flex items-center gap-5 justify-between ">
                <div
                  data-checked={isChecked?.book_ticket}
                  className="p-3 bg-gray-200 rounded-full data-[checked=true]:text-blue-500 "
                >
                  <TicketIcon />
                </div>
                <Checkbox
                  tabIndex={-1}
                  checked={isChecked?.book_ticket ? true : false}
                  className="rounded-full data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
              </div>
              <h2 className="font-medium text-lg">Book a Trip</h2>
            </div>
            <div
              data-checked={isChecked?.rent_boat}
              className="relative flex flex-col justify-between hover:bg-blue-50/40 border-2 border-gray-500 data-[checked=true]:scale-105 data-[checked=true]:text-blue-500 data-[checked=true]:border-blue-500 rounded-lg p-5 grow w-72 min-h-44 shadow-sm overflow-hidden transition-all duration-150 ease-in-out"
            >
              <button
                id="rent_boat"
                onClick={handleIsChecked}
                className="absolute z-1 w-full h-full top-0 left-0 right-0 rounded-lg"
              />
              <div className="flex items-center gap-5 justify-between">
                <div
                  data-checked={isChecked?.rent_boat}
                  className="p-3 bg-gray-200 rounded-full data-[checked=true]:text-blue-500 "
                >
                  <ShipIcon />
                </div>
                <Checkbox
                  tabIndex={-1}
                  checked={isChecked?.rent_boat ? true : false}
                  className="rounded-full data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
              </div>
              <h2 className="font-medium text-lg">Rent a Boat</h2>
            </div>
            <div
              data-checked={isChecked?.check_in}
              className="relative flex flex-col justify-between hover:bg-blue-50/40 border-2 border-gray-500 data-[checked=true]:scale-105 data-[checked=true]:text-blue-500 data-[checked=true]:border-blue-500 rounded-lg p-5 grow w-72 min-h-44 shadow-sm overflow-hidden transition-all duration-150 ease-in-out"
            >
              <button
                id="check_in"
                onClick={handleIsChecked}
                className="absolute z-1 w-full h-full top-0 left-0 right-0"
              />
              <div className="flex items-center gap-5 justify-between">
                <div
                  data-checked={isChecked?.check_in}
                  className="p-3 bg-gray-200 rounded-full data-[checked=true]:text-blue-500 "
                >
                  <CheckSquareIcon />
                </div>
                <Checkbox
                  tabIndex={-1}
                  checked={isChecked?.check_in ? true : false}
                  className="rounded-full data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
              </div>
              <h2 className="font-medium text-lg">Check in</h2>
            </div>
          </div>
          <Button
            text="Proceed"
            className="w-full py-6"
            disabled={!isChecked}
            onClick={() => {
              const path = Object.keys(isChecked)[0];
              if (path == "book_ticket") navigate("book-ticket");
              if (path == "check_in") navigate("check-in");
              if (path == "rent_boat") navigate("rental");
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Create;
