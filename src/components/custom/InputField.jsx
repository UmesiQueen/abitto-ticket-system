/* eslint-disable react/prop-types */
import React from "react";
import { cn } from "@/lib/utils";

const InputField = React.forwardRef((props, ref) => {
  const {
    name,
    errors,
    label,
    className,
    onChange,
    variant = "default",
    handlechange = () => { },
  } = props;

  const variantOptions = {
    default: "bg-blue-50 border-blue-500",
    white: "bg-white border-gray-500"
  }

  return (
    <div className="flex flex-col w-full">
      <label
        className="text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col"
      >
        {label}
        <input
          {...props}
          ref={ref}
          onChange={(event) => {
            onChange(event); // react hook onChange fn
            handlechange(event);
          }}
          className={cn("h-10 md:h-12 p-3 border font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins", className, variantOptions[variant])}
        />
      </label>
      {errors?.[name] && (
        <p className="text-xs pt-2 text-red-700">{errors?.[name].message}</p>
      )}
    </div>
  );
});
InputField.displayName = InputField;

export default InputField;
