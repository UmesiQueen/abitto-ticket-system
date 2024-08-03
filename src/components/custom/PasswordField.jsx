/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from "react";
import { Eye, EyeSlash } from "iconsax-react";

const PasswordField = React.forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { name, errors, label, className } = props;
  return (
    <>
      <div className="flex flex-col w-full">
        <label className="text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col">
          {label}
          <div className="relative">
            <input
              {...props}
              ref={ref}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              maxLength={35}
              className={`h-10 md:h-12 bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins ${className}`}
            />
            <button
              type="button"
              className=" hover:bg-blue-500/30 absolute top-0 right-0 h-10 md:h-12 px-3 rounded-e-lg transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </button>
          </div>
        </label>
        {errors?.[name] && (
          <p className="text-xs pt-2 text-red-700">{errors?.[name].message}</p>
        )}
      </div>
    </>
  );
});

export default PasswordField;
