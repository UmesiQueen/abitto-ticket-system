import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button as ButtonUI } from "@/components/ui/button";
import { CircleArrowLeftIcon } from "@/assets/icons";
import Logo from "@/assets/logo3.svg";
import SelectField from "@/components/custom/SelectField";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStepper } from "@/hooks/useStepper";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import InputField from "@/components/custom/InputField";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/custom/Button";
import { NumericFormat } from "react-number-format";
import {
	shipmentDetailsSchema,
	senderDetailsSchema,
	receiverDetailsSchema,
	paymentSchema,
} from "@/lib/validators/logisticsSchema";
import { formatValue } from "react-currency-input-field";
import { usePayment } from "@/hooks/usePayment";
import { useLogistics } from "@/hooks/useLogistics";

const ctx = React.createContext();

const Logistics = () => {
	const navigate = useNavigate();
	const { activeStep } = React.useContext(BookingCTX);
	const [packageDetails, setPackageDetails] = React.useState({});

	return (
		<>
			<Helmet>
				<title>Logistics | Admin </title>
			</Helmet>
			<ctx.Provider value={{ packageDetails, setPackageDetails }}>
				<div className="flex gap-1 items-center mb-10 ">
					<ButtonUI size="icon" variant="ghost" onClick={() => navigate(-1)}>
						<CircleArrowLeftIcon />
					</ButtonUI>
					<h1 className="font-semibold text-lg">Create a new Shipment</h1>
				</div>
				<div className="rounded-lg bg-white p-10">
					<div className="flex justify-between items-center pb-2 border-b-2 border-gray-500">
						<h2 className="font-semibold text-lg">Abitto Logistics</h2>
						<img src={Logo} alt="logo" width={150} />
					</div>

					<ul className="flex gap-5 border-b-2 border-gray-500">
						{[
							"Shipment Details",
							"Sender Info",
							"Receiver Info",
							"Payment",
						].map((header, index) => {
							const isActive = activeStep == index;
							return (
								<li
									key={header}
									data-state={isActive ? "active" : ""}
									className="p-4 text-sm data-[state=active]:border-b-4 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
								>
									{header}
								</li>
							);
						})}
					</ul>
					<div className="mt-10">
						{activeStep === 0 ? (
							<ShippingDetails />
						) : activeStep === 1 ? (
							<SenderDetails />
						) : activeStep === 2 ? (
							<ReceiverDetails />
						) : activeStep === 3 ? (
							<Payment />
						) : (
							""
						)}
					</div>
				</div>
			</ctx.Provider>
		</>
	);
};

export default Logistics;

const ShippingDetails = () => {
	const { pathname } = useLocation();
	const { packageDetails, setPackageDetails } = React.useContext(ctx);
	const { adminProfile } = React.useContext(GlobalCTX);
	const { loading } = React.useContext(BookingCTX);
	const { onNextClick } = useStepper();
	const { getLogisticsCost } = useLogistics()
	const [costPerKg, setCostPerKg] = React.useState(0);
	const [showPopover, setShowPopover] = React.useState(false);

	React.useEffect(() => {
		if (costPerKg > 0)
			setShowPopover(true);
	}, [costPerKg])

	const isSalesperson =
		["salesperson"].includes(adminProfile.account_type) &&
			pathname.includes("/backend")
			? true
			: false;

	const destinations = {
		Calabar: {
			departure: "Marina, Calabar",
			arrival: "Nwaniba Timber Beach, Uyo",
		},
		Uyo: {
			departure: "Nwaniba Timber Beach, Uyo",
			arrival: "Marina, Calabar",
		},
	};

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors, defaultValues },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(shipmentDetailsSchema),
		defaultValues: {
			...packageDetails,
			...(isSalesperson && {
				...destinations[adminProfile.city],
			}),
		},
		context: { isAdmin: true },
	});

	const isOthers = watch("category") == "Others" ? true : false;

	const onSubmit = handleSubmit((formData) => {
		setPackageDetails((prev) => ({
			...prev,
			...formData,
			value: formatCost(formData.value),
		}));
		getLogisticsCost(setCostPerKg)
	});

	const handleNextClick = () => {
		setPackageDetails((prev) => ({
			...prev,
			cost_per_kg: costPerKg,
			total_cost: Number(prev?.weight) * Number(costPerKg),
		}));
		onNextClick();
	}

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
		<div>
			<hgroup className="mb-8">
				<h2 className="text-blue-500 text-base font-semibold">
					Shipment Details
				</h2>
				<p className="text-sm">
					Please fill in shipment details and get quote to proceed
				</p>
			</hgroup>
			<form onSubmit={onSubmit} className="flex flex-col gap-5">
				<div className="flex gap-5">
					<SelectField
						{...register("departure")}
						defaultValue={defaultValues["departure"]}
						label="Departure"
						placeholder="Select Departure Terminal"
						options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
						errors={errors}
						handlechange={handleChange}
						disabled={isSalesperson ? true : false}
					/>
					<SelectField
						{...register("arrival")}
						defaultValue={defaultValues["arrival"]}
						label="Arrival"
						placeholder="Select Arrival Terminal"
						options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
						errors={errors}
						handlechange={handleChange}
						disabled={isSalesperson ? true : false}
					/>
				</div>
				<div className="flex gap-5">
					<SelectField
						{...register("category")}
						defaultValue={defaultValues["category"]}
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
						defaultValue={defaultValues["no_item"]}
						label="No. of item"
						placeholder="Enter no. of item"
						type="number"
						min={0}
						errors={errors}
						handlechange={handleChange}
					/>
				</div>
				<div className="flex gap-5">
					<InputField
						{...register("weight")}
						defaultValue={defaultValues["weight"]}
						label="Weight(kg)"
						placeholder="Enter weight of item"
						type="number"
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
								render={({ field: { name, onChange, onBlur, value, ref } }) => {
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

				{isOthers && (
					<InputField
						{...register("name")}
						defaultValue={defaultValues["name"]}
						label="Item Name"
						placeholder="Enter name of item"
						type="text"
						max={35}
						min={0}
						errors={errors}
						handlechange={handleChange}
					/>
				)}
				<div className="flex flex-col w-full">
					<label
						className={
							"text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col"
						}
					>
						Item Description
						<Textarea
							{...register("description")}
							defaultValue={defaultValues["description"]}
							placeholder="Describe item briefly..."
							rows="6"
							onChange={handleChange}
							className="bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins resize-none "
						/>
					</label>
				</div>
				{!showPopover && <Button text="Get Quote" type="submit" loading={loading} className="w-full" />}
			</form>

			{/* Quote */}
			{showPopover && <div>
				<div className="flex justify-between items-center p-5 border-y-2 border-dashed border-gray-500 my-20">
					<p className="font-semibold">Amount:</p>
					<div>
						<p>
							{formatValue({
								value: String(costPerKg),
								prefix: "₦",
							})}{" "}
							x {packageDetails?.weight ?? 0}kg
						</p>
						<p className="font-bold text-xl">
							{formatValue({
								value: String(
									Number(packageDetails?.weight ?? 0) * Number(costPerKg)
								),
								prefix: "NGN ",
							})}
						</p>
					</div>
				</div>
				<Button text="Continue" onClick={handleNextClick} className="w-full" />
			</div>}
		</div>
	);
};

const SenderDetails = () => {
	const { onPrevClick, onNextClick } = useStepper();
	const { packageDetails, setPackageDetails } = React.useContext(ctx);
	const {
		register,
		handleSubmit,
		formState: { errors, defaultValues },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(senderDetailsSchema),
		defaultValues: packageDetails,
	});

	const onSubmit = handleSubmit((formData) => {
		setPackageDetails((prev) => ({
			...prev,
			...formData
		}))
		onNextClick();
	});

	const handleChange = (e) => {
		const { value, name } = e.target;
		setPackageDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div>
			<hgroup className="mb-8">
				<h2 className="text-blue-500 text-base font-semibold">
					Sender Details
				</h2>
				<p className="text-sm">Please fill in sender details</p>
			</hgroup>
			<form onSubmit={onSubmit} className=" flex flex-col gap-5">
				<div className="flex gap-5">
					<InputField
						{...register("sender_name")}
						defaultValue={defaultValues["sender_name"]}
						label="Name"
						placeholder="Enter sender name"
						type="text"
						max={35}
						handlechange={handleChange}
						errors={errors}
					/>
					<InputField
						{...register("sender_phone_number")}
						defaultValue={defaultValues["sender_phone_number"]}
						label="Phone Number"
						placeholder="Enter sender phone number"
						type="text"
						max={35}
						handlechange={handleChange}
						errors={errors}
					/>
				</div>
				<div className="flex gap-5">
					<InputField
						{...register("sender_email")}
						defaultValue={defaultValues["sender_email"]}
						label="Email"
						placeholder="Enter sender email"
						type="text"
						max={35}
						handlechange={handleChange}
						errors={errors}
					/>
					<InputField
						{...register("sender_alt_phone_number")}
						defaultValue={defaultValues["sender_alt_phone_number"]}
						label="Alt. Phone Number"
						placeholder="Enter alt. sender phone number"
						type="text"
						max={35}
						handlechange={handleChange}
						errors={errors}
					/>
				</div>
				<div className="flex flex-col w-full">
					<label
						className={
							"text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col"
						}
					>
						Address
						<Textarea
							{...register("sender_address")}
							defaultValue={defaultValues["sender_address"]}
							placeholder="Enter sender address"
							rows={2}
							onChange={handleChange}
							className="bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins resize-none "
						/>
					</label>
				</div>
				<div className="flex gap-4 mt-10">
					<Button
						text="Back"
						variant="outline"
						onClick={onPrevClick}
						className="w-40"
					/>
					<Button text="Continue" type="submit" className="w-40 " />
				</div>
			</form>
		</div>
	);
};

const ReceiverDetails = () => {
	const { onPrevClick, onNextClick } = useStepper();
	const { packageDetails, setPackageDetails } = React.useContext(ctx);
	const {
		register,
		handleSubmit,
		formState: { errors, defaultValues },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(receiverDetailsSchema),
		defaultValues: packageDetails,
	});

	const onSubmit = handleSubmit((formData) => {
		setPackageDetails((prev) => ({
			...prev,
			...formData
		}))
		onNextClick();
	});

	const handleChange = (e) => {
		const { value, name } = e.target;
		setPackageDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div>
			<hgroup className="mb-8">
				<h2 className="text-blue-500 text-base font-semibold">
					Receiver Details
				</h2>
				<p className="text-sm">Please fill in receiver details</p>
			</hgroup>
			<form onSubmit={onSubmit} className=" flex flex-col gap-5">
				<div className="flex gap-5">
					<InputField
						{...register("receiver_name")}
						defaultValue={defaultValues["receiver_name"]}
						label="Name"
						placeholder="Enter receiver name"
						type="text"
						max={35}
						handlechange={handleChange}
						errors={errors}
					/>
					<InputField
						{...register("receiver_phone_number")}
						defaultValue={defaultValues["receiver_phone_number"]}
						label="Phone Number"
						placeholder="Enter receiver phone number"
						type="text"
						max={35}
						handlechange={handleChange}
						errors={errors}
					/>
				</div>
				<div className="flex gap-5">
					<InputField
						{...register("receiver_email")}
						defaultValue={defaultValues["receiver_email"]}
						label="Email"
						placeholder="Enter receiver email"
						type="text"
						max={35}
						handlechange={handleChange}
						errors={errors}
					/>
					<InputField
						{...register("receiver_alt_phone_number")}
						defaultValue={defaultValues["receiver_alt_phone_number"]}
						label="Alt. Phone Number"
						placeholder="Enter alt. receiver phone number"
						type="text"
						max={35}
						handlechange={handleChange}
						errors={errors}
					/>
				</div>
				<div className="flex flex-col w-full">
					<label
						className={
							"text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col"
						}
					>
						Address
						<Textarea
							{...register("receiver_address")}
							defaultValue={defaultValues["receiver_address"]}
							placeholder="Enter receiver address"
							rows={2}
							onChange={handleChange}
							className="bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins resize-none "
						/>
					</label>
				</div>
				<div className="flex gap-4 mt-10">
					<Button
						text="Back"
						variant="outline"
						onClick={onPrevClick}
						className="w-40"
					/>
					<Button text="Continue" type="submit" className="w-40" />
				</div>
			</form>
		</div>
	);
};

const Payment = () => {
	const { onPrevClick } = useStepper();
	const { packageDetails, setPackageDetails } = React.useContext(ctx);
	const { handleLogisticsPayment } = usePayment();
	const {
		register,
		handleSubmit,
		formState: { errors, defaultValues },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(paymentSchema),
		defaultValues: packageDetails,
	});

	const onSubmit = handleSubmit((formData) => {
		setPackageDetails((prev) => ({
			...prev,
			...formData,
			...(prev?.name ?? { name: prev.category })
		}))
		handleLogisticsPayment(packageDetails, () => { setPackageDetails({}) });
	});

	const handleChange = (e) => {
		const { value, name } = e.target;
		setPackageDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div>
			<h2 className="font-semibold mb-5 text-blue-500">Shipment Summary</h2>
			<div className="w-5/6 flex *:grow *:w-full [&_h3]:font-semibold [&_h3]:text-sm">
				<ul className="space-y-2">
					<li>
						<h3>Shipping From:</h3>
						<p>{packageDetails?.departure}</p>
					</li>
					<li>
						<h3>Shipping To:</h3>
						<p>{packageDetails?.arrival}</p>
					</li>
					<li className="flex gap-10">
						<div>
							<h3>Nature of item:</h3>
							<p>{packageDetails?.category}</p>
						</div>
						<div>
							<h3>Number of items:</h3>
							<p>{packageDetails?.no_item}</p>
						</div>
					</li>

					{packageDetails?.name && (
						<li>
							<h3>Item Name:</h3>
							<p>{packageDetails?.name}</p>
						</li>
					)}
					<li>
						<h3>Item Description:</h3>
						<p>{packageDetails?.description}</p>
					</li>
					<li className="flex gap-10">
						<div>
							<h3>Weight(kg):</h3>
							<p>{packageDetails?.weight}</p>
						</div>
						<div>
							<h3>Value(NGN):</h3>
							<p>
								{formatValue({
									value: String(packageDetails?.value),
									prefix: "₦",
								})}
							</p>
						</div>
					</li>
					<li></li>
				</ul>
				<div className="space-y-10">
					<div>
						<h3>Sender Details:</h3>
						<p>{packageDetails?.sender_name}</p>
						<p>{packageDetails?.sender_email}</p>
						<p>{packageDetails?.sender_phone_number}</p>
						{packageDetails?.sender_alt_phone_number && (
							<p>{packageDetails?.sender_alt_phone_number}</p>
						)}
						<p>{packageDetails?.sender_address}</p>
					</div>
					<div>
						<h3>Receiver Details:</h3>
						<p>{packageDetails?.receiver_name}</p>
						<p>{packageDetails?.receiver_email}</p>
						<p>{packageDetails?.receiver_phone_number}</p>
						{packageDetails?.receiver_alt_phone_number && (
							<p>{packageDetails?.receiver_alt_phone_number}</p>
						)}
						<p>{packageDetails?.receiver_address}</p>
					</div>
				</div>
			</div>

			<div className=" w-4/6 my-10 flex justify-between items-center py-5 border-y-2 border-dashed border-gray-500">
				<p className="font-semibold">Amount:</p>
				<div>
					<p>
						{formatValue({
							value: String(packageDetails?.cost_per_kg),
							prefix: "₦",
						})}{" "}
						x {packageDetails?.weight}kg
					</p>
					<p className="font-bold">
						{formatValue({
							value: String(packageDetails?.total_cost),
							prefix: "NGN",
						})}
					</p>
				</div>
			</div>

			<form onSubmit={onSubmit}>
				<div className=" py-10 flex gap-5 w-4/6">
					<SelectField
						{...register("payment_method")}
						defaultValue={defaultValues["payment_method"]}
						label="Payment Method"
						placeholder="Select payment method"
						options={["POS", "Bank Transfer", "Cash"]}
						errors={errors}
						handlechange={handleChange}
						className="bg-white"
					/>
					<InputField
						{...register("txRef")}
						defaultValue={defaultValues["txRef"]}
						label="Transaction Reference"
						placeholder="Enter trx ref"
						type="text"
						maxLength={35}
						className="bg-white"
						autoComplete="off"
						handlechange={handleChange}
						errors={errors}
					/>
				</div>
				<div className="flex gap-4 mt-10">
					<Button
						text="Back"
						variant="outline"
						onClick={onPrevClick}
						className="w-40"
					/>
					<Button
						text="Submit"
						type="submit"
						// loading={loading}
						className="w-40 "
					/>
				</div>
			</form>
		</div>
	);
};
