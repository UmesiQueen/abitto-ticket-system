/* eslint-disable react/prop-types */
import React from "react";
import { useParams } from "react-router-dom";
import { addDays, format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import CustomButton from "@/components/custom/Button";
import { CalendarIcon } from "@/assets/icons";
import SelectField from "@/components/custom/SelectField";
import * as yup from "yup";
import { useSearchParam } from "@/hooks/useSearchParam";
import { BookingCTX } from "@/contexts/BookingContext";

const SearchForm = ({ props }) => {
	const [loading, setLoading] = React.useState(false);
	const { resetPageIndex } = React.useContext(BookingCTX)
	const { accountType } = useParams();
	const { searchParams, setSearchParams, getSearchParams } = useSearchParam();
	const searchParamValues = getSearchParams();
	const { name, page, ...prop } = props

	const searchSchema = yup.object().shape({
		[name]: yup.string(),
		date: yup.string(),
	}).test("require at least one field", (field) => {
		const a = !!(field[name] || field.date); // At least one must be non-empty
		if (!a) {
			return new yup.ValidationError(
				"At least one of the two fields must be filled.", //Message
				"null",
				"date", //error name
				"required" //type
			);
		}
		return true;
	});

	const {
		register,
		handleSubmit,
		formState: { errors, defaultValues, isSubmitted },
		control,
		reset,
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(searchSchema),
		defaultValues: {
			[name]: searchParamValues?.[name] ?? "",
			date: searchParamValues?.date ?? ""
		}
	});

	React.useEffect(() => {
		if (!searchParams.size) {
			reset({ [name]: "", date: "" });
		}
	}, [searchParams, reset, name]);

	const onSubmit = handleSubmit((formData) => {
		setLoading(true);
		setTimeout(() => {
			setSearchParams({
				...searchParamValues,
				...(formData[name].length && { [name]: formData[name] }),
				...((formData.date).length && {
					date: new Date(addDays(formData.date, 1)).toISOString().split("T")[0],
				}),
			});
			resetPageIndex(page);
			setLoading(false);
		}, 650);
	});

	return (
		<form
			onSubmit={onSubmit}
			className="flex gap-5 justify-between bg-white rounded-lg p-6 pb-8"
		>
			<div className="flex gap-5 w-full ">
				{["super-admin", "dev"].includes(accountType) && (
					<SelectField
						{...register(name)}
						{...prop}
						errors={errors}
						defaultValue={defaultValues[name]}
						formState={isSubmitted}
					/>
				)}
				<div className="w-full relative">
					<label
						htmlFor="date"
						className="text-xs md:text-sm !w-full flex flex-col "
					>
						Choose Date
						<Controller
							control={control}
							name="date"
							render={({ field }) => (
								<DatePicker
									icon={<CalendarIcon />}
									showIcon
									toggleCalendarOnIconClick={true}
									closeOnScroll
									className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
									onChange={(date) => field.onChange(date)}
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
						<p className="text-xs text-red-700 absolute -bottom-6">{errors?.date.message}</p>
					)}
				</div>
			</div>
			<CustomButton
				type="submit"
				loading={loading}
				className="w-44 py-5 md:mt-8 "
			>
				Search
			</CustomButton>
		</form>
	);
};

export default SearchForm;
