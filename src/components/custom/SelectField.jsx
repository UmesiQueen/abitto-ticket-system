/* eslint-disable react/prop-types */
import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const SelectField = React.forwardRef((props, ref) => {
	const {
		label,
		placeholder,
		options,
		name,
		errors,
		onChange,
		defaultValue = "",
		className,
		handlechange = () => { },
		formState = true,
	} = props;
	const [value, setValue] = React.useState(defaultValue);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		if (!formState && !defaultValue) setValue("");
	}, [formState, defaultValue]);

	React.useEffect(() => {
		window.addEventListener("scroll", handleClose);
		return () => window.removeEventListener("scroll", handleClose);
	});

	const handleClose = () => {
		if (open) setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	return (
		<div className="flex flex-col w-full">
			<label htmlFor={name} className="text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col ">
				{label}
				<Select
					open={open}
					onClose={handleClose}
					onOpen={handleOpen}
					ref={ref}
					{...props}
					value={options.includes(value) ? value : ""}
					onChange={(event) => {
						setValue(event.target.value);
						onChange(event); // react hook onChange fn
						handlechange(event);
					}}
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
					sx={{
						"& .MuiOutlinedInput-notchedOutline": { display: "none" },
					}}
					className={`bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-xs w-full !rounded-lg !font-poppins ${className} `}
				>
					{options.map((option) => {
						return (
							<MenuItem value={option} key={option} className="!font-poppins">
								{option}
							</MenuItem>
						);
					})}
				</Select>
			</label>
			{errors?.[name] && (
				<p className="text-xs pt-2 text-red-700">{errors?.[name].message}</p>
			)}
		</div>
	);
});
SelectField.displayName = "SelectField";

export default SelectField;
