import React from "react";
import { Helmet } from "react-helmet-async";
import SelectField from "@/components/custom/SelectField";
import InputField from "@/components/custom/InputField";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/custom/Button";
import { NumericFormat } from "react-number-format";
import { shipmentDetailsSchema } from "@/lib/validators/logisticsSchema";
import { GlobalCTX } from "@/contexts/GlobalContext";

const GetQuote = () => {
	const [packageDetails, setPackageDetails] = React.useState({});
	const { mountPortalModal } = React.useContext(GlobalCTX);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(shipmentDetailsSchema),
		defaultValues: packageDetails,
		context: { isAdmin: false },
	});

	const onSubmit = handleSubmit((formData) => {
		setPackageDetails((prev) => ({
			...prev,
			value: formatCost(formData.value),
		}));
		mountPortalModal(<QuoteModal />);
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
			<div className="max-w-[1040px] mx-auto py-24">
				<div className=" bg-white mx-5 p-5 md:p-10 rounded-lg">
					<hgroup className="mb-8">
						<h2 className="text-blue-500 font-semibold text-base md:text-xl">
							Get Quote
						</h2>
						<p className="text-sm md:text-base font-medium">
							Please fill in cargo details and to get quote
						</p>
					</hgroup>
					<form onSubmit={onSubmit} className="flex flex-col gap-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<SelectField
								{...register("departure")}
								label="Departure"
								placeholder="Select Departure Terminal"
								options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
								errors={errors}
								handlechange={handleChange}
							/>
							<SelectField
								{...register("arrival")}
								label="Arrival"
								placeholder="Select Arrival Terminal"
								options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
								errors={errors}
								handlechange={handleChange}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<SelectField
								{...register("category")}
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
							/>
							<InputField
								{...register("no_item")}
								label="No. of item"
								placeholder="Enter no. of item"
								type="number"
								max={35}
								min={0}
								errors={errors}
								handlechange={handleChange}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<InputField
								{...register("weight")}
								label="Weight(kg)"
								placeholder="Enter weight of item"
								type="number"
								max={35}
								min={0}
								errors={errors}
								handlechange={handleChange}
							/>
							{/* NumericFormat Input Field */}
							<div className="flex flex-col w-full">
								<label className="text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col">
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

						<Button text="Get Quote" type="submit" className="w-full mt-5" />
					</form>
				</div>
			</div>
		</>
	);
};

export default GetQuote;

const QuoteModal = () => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className="w-96 px-5 py-10 rounded-lg bg-white space-y-5">
			<h2 className="font-semibold text-center">Quote</h2>
			<Button text="Continue" variant="outline" onClick={unMountPortalModal} />
		</div>
	);
};
