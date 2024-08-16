import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button as ButtonUI } from "@/components/ui/button";
import { CircleArrowLeftIcon } from "@/assets/icons";
import Logo from "@/assets/logo3.svg";
import SelectField from "@/components/custom/SelectField";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStepper } from "@/hooks/useStepper";
import { BookingCTX } from "@/contexts/BookingContext";
import InputField from "@/components/custom/InputField";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/custom/Button";
import { NumericFormat } from "react-number-format";

const ctx = React.createContext();

const Logistics = () => {
	const navigate = useNavigate();
	const { activeStep } = React.useContext(BookingCTX);

	return (
		<>
			<Helmet>
				<title>Logistics | Admin </title>
			</Helmet>
			<ctx.Provider>
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

const shipmentDetailsSchema = yup.object().shape({
	departure: yup.string().required("This field is required."),
	arrival: yup.string().required("This field is required."),
	category: yup.string().required("This field is required."),
	item_name: yup.string(),
	item_description: yup.string(),
	no_item: yup
		.number()
		.typeError("No. of item must be a number")
		.required("This field is required."),
	weight: yup
		.number()
		.typeError("Weight must be a number")
		.required("This field is required."),
});

const ShippingDetails = () => {
	const { onNextClick } = useStepper();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(shipmentDetailsSchema),
	});

	const onSubmit = handleSubmit((formData) => {
		console.log(formData, "form Data");
		onNextClick();
	});

	return (
		<div>
			<form onSubmit={onSubmit} className="flex flex-col gap-5">
				<div className="flex gap-5">
					<SelectField
						{...register("departure")}
						// defaultValue={defaultValues["shipping_from"]}
						label="Shipping From"
						placeholder="Select Departure Terminal"
						options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
						errors={errors}
						// handlechange={handleChange}
						// disabled={isSalesperson ? true : false}
					/>
					<SelectField
						{...register("arrival")}
						// defaultValue={defaultValues["shipping_to"]}
						label="Shipping To"
						placeholder="Select Arrival Terminal"
						options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
						errors={errors}
						// handlechange={handleChange}
						// disabled={isSalesperson ? true : false}
					/>
				</div>
				<div className="flex gap-5">
					<SelectField
						{...register("category")}
						label="Nature of item"
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
						// handlechange={handleChange}
						// disabled={isSalesperson ? true : false}
					/>
					<InputField
						{...register("no_item")}
						label="No. of item"
						placeholder="Enter no. of item"
						type="number"
						max={35}
						min={0}
						errors={errors}
					/>
				</div>

				<InputField
					{...register("item_name")}
					label="Item Name"
					placeholder="Enter name of item"
					type="text"
					max={35}
					min={0}
					errors={errors}
				/>
				<div className="flex flex-col w-full">
					<label
						className={
							"text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col"
						}
					>
						Item Description
						<Textarea
							{...register("item_description")}
							placeholder="Describe item briefly..."
							rows="6"
							className="bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins resize-none "
						/>
					</label>
				</div>

				<div className="flex gap-5">
					<InputField
						{...register("weight")}
						label="Weight(kg)"
						placeholder="Enter weight of item"
						type="number"
						max={35}
						min={0}
						errors={errors}
					/>
					{/* NumericFormat Input Field */}
					<div className="flex flex-col w-full">
						<label className="text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col">
							Value(NGN)
							<Controller
								control={control}
								name="cost"
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
											onValueChange={(_, sourceInfo) => {
												onChange(sourceInfo.event);
											}}
											className="h-10 md:h-12 bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins"
										/>
									);
								}}
							/>
						</label>
						{errors?.cost && (
							<p className="text-xs pt-2 text-red-700">
								{errors?.cost.message}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center *:grow *:w-full mt-20">
					<div>
						<Button
							text="Get Quote"
							variant="outline"
							type="button"
							className="w-44"
						/>
					</div>
					<div className="flex justify-between items-center py-2 px-5 border-y-2 border-dashed border-gray-500">
						<p className="font-semibold">Amount:</p>
						<div>
							<p>#2000 x 1kg</p>
							<p className="font-bold">NGN 45,000</p>
						</div>
					</div>
				</div>

				<Button
					text="Continue"
					// type="submit"
					onClick={onNextClick}
					className="w-full mt-20"
				/>
			</form>
		</div>
	);
};

const SenderDetails = () => {
	const { onPrevClick, onNextClick } = useStepper();
	return (
		<div>
			<h2 className="font-semibold mb-5 text-blue-500">Sender Details</h2>
			<div className=" flex flex-col gap-5">
				<div className="flex gap-5">
					<InputField
						// {...register("item_name")}
						label="Name"
						placeholder="Enter sender name"
						type="text"
						max={35}
						min={0}
						// errors={errors}
					/>
					<InputField
						// {...register("item_name")}
						label="Phone Number"
						placeholder="Enter sender phone number"
						type="text"
						max={35}
						min={0}
						// errors={errors}
					/>
				</div>
				<div className="flex gap-5">
					<InputField
						// {...register("item_name")}
						label="Email"
						placeholder="Enter sender email"
						type="text"
						max={35}
						min={0}
						// errors={errors}
					/>
					<InputField
						// {...register("item_name")}
						label="Alt. Phone Number"
						placeholder="Enter alt. sender phone number"
						type="text"
						max={35}
						min={0}
						// errors={errors}
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
							// {...register("trip_remark")}
							placeholder="Enter sender address"
							rows={2}
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
					<Button
						text="Continue"
						// type="submit"
						// loading={loading}
						onClick={onNextClick}
						className="w-40 "
					/>
				</div>
			</div>
		</div>
	);
};

const ReceiverDetails = () => {
	const { onPrevClick, onNextClick } = useStepper();
	return (
		<div>
			<h2 className="font-semibold mb-5 text-blue-500">Receiver Details</h2>
			<div className=" flex flex-col gap-5">
				<div className="flex gap-5">
					<InputField
						// {...register("item_name")}
						label="Name"
						placeholder="Enter receiver name"
						type="text"
						max={35}
						min={0}
						// errors={errors}
					/>
					<InputField
						// {...register("item_name")}
						label="Phone Number"
						placeholder="Enter receiver phone number"
						type="text"
						max={35}
						min={0}
						// errors={errors}
					/>
				</div>
				<div className="flex gap-5">
					<InputField
						// {...register("item_name")}
						label="Email"
						placeholder="Enter receiver email"
						type="text"
						max={35}
						min={0}
						// errors={errors}
					/>
					<InputField
						// {...register("item_name")}
						label="Alt. Phone Number"
						placeholder="Enter alt. receiver phone number"
						type="text"
						max={35}
						min={0}
						// errors={errors}
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
							// {...register("trip_remark")}
							placeholder="Enter receiver address"
							rows={2}
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
					<Button
						text="Continue"
						// type="submit"
						// loading={loading}
						onClick={onNextClick}
						className="w-40 "
					/>
				</div>
			</div>
		</div>
	);
};

const Payment = () => {
	const { onPrevClick } = useStepper();
	return (
		<div>
			<h2 className="font-semibold mb-5 text-blue-500">Shipment Summary</h2>
			<div className="w-5/6 flex *:grow *:w-full [&_h3]:font-semibold [&_h3]:text-sm">
				<ul className="space-y-2">
					<li>
						<h3>Shipping From:</h3>
						<p>Marina, Calabar</p>
					</li>
					<li>
						<h3>Shipping To:</h3>
						<p>Nwaniba, Uyo</p>
					</li>
					<li className="flex gap-10">
						<div>
							<h3>Nature of item:</h3>
							<p>Food</p>
						</div>
						<div>
							<h3>Number of items:</h3>
							<p>3</p>
						</div>
					</li>

					<li>
						<h3>Item Name:</h3>
						<p>Food</p>
					</li>
					<li>
						<h3>Item Description:</h3>
						<p>Food</p>
					</li>
					<li className="flex gap-10">
						<div>
							<h3>Weight(kg):</h3>
							<p>10</p>
						</div>
						<div>
							<h3>Value(NGN):</h3>
							<p>#1000</p>
						</div>
					</li>
					<li></li>
				</ul>
				<div className="space-y-10">
					<div>
						<h3>Sender Details:</h3>
						<p>John Doe</p>
						<p>queencee@gmail.com</p>
						<p>08038034902492</p>
					</div>
					<div>
						<h3>Receiver Details:</h3>
						<p>John Doe</p>
						<p>queencee@gmail.com</p>
						<p>08038034902492</p>
						<p>08038034902492</p>
					</div>
				</div>
			</div>

			<div className=" w-4/6 my-10 flex justify-between items-center py-5 border-y-2 border-dashed border-gray-500">
				<p className="font-semibold">Amount:</p>
				<div>
					<p>#2000 x 1kg</p>
					<p className="font-bold">NGN 45,000</p>
				</div>
			</div>

			<div className=" py-10 flex gap-5 w-4/6">
				<SelectField
					// {...register("payment_method")}
					label="Payment Method"
					placeholder="Select payment method"
					options={["POS", "Bank Transfer", "Cash"]}
					// errors={errors}
					className="bg-white"
				/>

				<InputField
					// {...register("transaction_ref")}
					label="Transaction Reference"
					placeholder="Enter trx ref"
					type="text"
					maxLength={35}
					className="bg-white"
					autoComplete="off"
					// errors={errors}
				/>
			</div>

			<div className="flex gap-4 mt-10">
				<Button
					text="Back"
					variant="outline"
					onClick={onPrevClick}
					className="w-full md:w-40"
				/>
				<Button
					text="Submit"
					// type="submit"
					// loading={loading}
					// onClick={onNextClick}
					className="col-start-1 w-full md:w-40 "
				/>
			</div>
		</div>
	);
};
