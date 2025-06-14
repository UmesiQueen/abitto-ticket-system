/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import SelectField from "@/components/custom/SelectField";
import InputField from "@/components/custom/InputField";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "@/components/custom/Button";
import { NumericFormat } from "react-number-format";
import { shipmentDetailsSchema } from "@/lib/validators/logisticsSchema";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { CancelSquareIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import PackageGIF from "@/assets/package.gif";
import { formatValue } from "react-currency-input-field";
import { BookingCTX } from "@/contexts/BookingContext";
import { useLogistics } from "@/hooks/useLogistics";

const GetQuote = () => {
	const defaultValue = {
		departure: "",
		arrival: "",
		no_item: "",
		category: "",
		weight: "",
		value: ""
	}
	const [packageDetails, setPackageDetails] = React.useState(defaultValue);
	const { mountPortalModal } = React.useContext(GlobalCTX);
	const { loading } = React.useContext(BookingCTX);
	const { getLogisticsCost } = useLogistics();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitted, defaultValues },
	} = useForm({
		mode: "onSubmit",
		resolver: yupResolver(shipmentDetailsSchema),
		defaultValues: packageDetails,
		context: { isAdmin: false },
	});

	const onSubmit = handleSubmit((formData) => {
		setPackageDetails((prev) => ({
			...prev,
			value: formatCost(formData.value),
		}));

		getLogisticsCost((cost) => {
			mountPortalModal(
				<QuoteModal
					props={{
						weight: packageDetails.weight,
						quantity: packageDetails.no_item,
						cost_per_kg: cost,
					}}
				/>
			);
		})

	});

	const formatCost = (cost) => {
		return cost
			.substring(1)
			.split("")
			.filter((cost) => cost !== ",")
			.join("");
	};

	const handleChange = (e) => {
		const { value, name } = e.target;
		setPackageDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<>
			<Helmet>
				<title>Get Quote | Abitto Ferry </title>
			</Helmet>
			<div className="max-w-[1040px] mx-auto pt-32 pb-24">
				<div className=" bg-white mx-5 p-5 md:p-10 rounded-lg">
					<hgroup className="mb-8">
						<h2 className="text-blue-500 font-semibold text-base md:text-xl">
							Get Quote
						</h2>
						<p className="text-sm md:text-base font-medium">
							Please fill in shipment details and to get quote
						</p>
					</hgroup>
					<form onSubmit={onSubmit} className="flex flex-col gap-5">
						<div className="grid grid-c0ols-1 md:grid-cols-2 gap-5">
							<SelectField
								{...register("departure")}
								defaultValues={defaultValues.departure}
								label="Departure"
								placeholder="Select Departure Terminal"
								options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
								errors={errors}
								handlechange={handleChange}
								formState={isSubmitted}
							/>
							<SelectField
								{...register("arrival")}
								defaultValues={defaultValues.arrival}
								label="Arrival"
								placeholder="Select Arrival Terminal"
								options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
								errors={errors}
								handlechange={handleChange}
								formState={isSubmitted}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<SelectField
								{...register("category")}
								defaultValues={defaultValues.category}
								label="Category"
								placeholder="Select Item Category"
								options={[
									"Food",
									"Electronics/Gadgets",
									"Documents",
									"Clothes",
									"Jewelries/Accessories",
									"Health Products",
									"Others",
								]}
								errors={errors}
								handlechange={handleChange}
								formState={isSubmitted}
							/>
							<InputField
								{...register("no_item")}
								defaultValues={defaultValues.no_item}
								label="No. of item"
								placeholder="Enter no. of item"
								type="number"
								min={0}
								errors={errors}
								handlechange={handleChange}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<InputField
								{...register("weight")}
								defaultValues={defaultValues.weight}
								label="Weight(kg)"
								placeholder="Enter weight of item"
								type="number"
								min={0}
								errors={errors}
								handlechange={handleChange}
							/>
							{/* NumericFormat Input Field */}
							<div className="flex flex-col w-full">
								<label htmlFor="value" className="text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col">
									Value(NGN)
									<Controller
										control={control}
										name="value"
										render={({
											field: { name, onChange, onBlur, value, ref },
										}) => {
											return (
												<NumericFormat
													prefix="₦"
													getInputRef={ref}
													onBlur={onBlur}
													name={name}
													value={value}
													placeholder="Enter est. value of item"
													thousandSeparator=","
													allowNegative={false}
													autoComplete="off"
													onValueChange={(_, sourceInfo) => {
														onChange(sourceInfo.event);
													}}
													className="h-10 md:h-12 bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins"
												/>
											);
										}}
									/>
								</label>
								{errors?.value && (
									<p className="text-xs pt-2 text-red-700">
										{errors?.value.message}
									</p>
								)}
							</div>
						</div>

						<CustomButton
							type="submit"
							className="w-full mt-5"
							loading={loading}
						>
							Get Quote
						</CustomButton>
					</form>
				</div>
			</div>
		</>
	);
};

export default GetQuote;

const QuoteModal = ({
	props: { weight, quantity, cost_per_kg },
}) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className=" w-full max-w-[30rem] p-5 md:p-10 rounded-lg bg-white space-y-5 relative text-center">
			<Button
				variant="ghost"
				size="icon"
				className=" absolute top-0 right-0"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</Button>
			<div className="min-h-32">
				<img src={PackageGIF} alt="package gif" className="mx-auto" />
			</div>
			<hgroup>
				<h2 className="font-bold text-xl md:text-2xl text-blue-500">
					Shipment Cost Estimate
				</h2>
				<p className="text-sm md:text-base">
					This is just an estimated cost of your shipment. Actual price may vary
					when you arrive at the terminal.
				</p>
			</hgroup>

			<table className="text-sm md:text-base text-left w-full border border-blue-50 border-collapse [&_td]:border [&_td]:border-blue-50 [&_td]:py-1  [&_td]:px-2">
				<tbody>
					<tr>
						<td>Weight:</td>
						<td>{weight}kg</td>
					</tr>
					<tr>
						<td>Quantity:</td>
						<td>{quantity}</td>
					</tr>
					<tr>
						<td>Cost/kg:</td>
						<td>
							{formatValue({
								value: String(cost_per_kg ?? 0),
								prefix: "₦",
							})}
						</td>
					</tr>
					<tr className="font-semibold">
						<td>Total:</td>
						<td>
							{formatValue({
								value: String(Number(cost_per_kg) * Number(weight)),
								prefix: "₦",
							})}
						</td>
					</tr>
				</tbody>
			</table>
			<p className="text-sm md:text-base">Please visit our closest terminal to complete shipment.</p>
			<CustomButton
				className="w-full"
				onClick={unMountPortalModal}
			>
				Ok, I understand
			</CustomButton>
		</div>
	);
};
