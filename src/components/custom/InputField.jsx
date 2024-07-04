/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from "react";

const InputField = React.forwardRef((props, ref) => {
  const { name, errors, label, className, onChange } = props;

  return (
    <div className="flex flex-col w-full">
      <label
        className={"text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col"}
      >
        {label}
        <input
          {...props}
          ref={ref}
          onChange={(event) => {
            onChange(event); // react hook onChange fn
          }}
          className={`h-10 md:h-12 bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins ${className}`}
        />
      </label>
      {errors?.[name] && (
        <p className="text-xs pt-2 text-red-700">{errors?.[name].message}</p>
      )}
    </div>
  );
});

export default InputField;
