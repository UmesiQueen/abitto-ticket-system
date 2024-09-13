/* eslint-disable react/prop-types */
import React from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { GlobalCTX } from "@/contexts/GlobalContext";
import ConfirmationModal from "@/components/modals/confirmation";
import axiosInstance from "@/api";
import { toast } from "sonner";
import { useUpdate } from "@/hooks/useUpdate";

const pricingSchema = yup.object().shape({
	within_marina: yup.string().required("Amount cannot be empty."),
	calabar_to_uyo: yup.string().required("Amount cannot be empty."),
	uyo_to_calabar: yup.string().required("Amount cannot be empty."),
	logistics: yup.string().required("Amount cannot be empty."),
});

const Pricing = () => {
	const prices = useLoaderData();
	const { revalidate, state } = useRevalidator();
	const { mountPortalModal } = React.useContext(GlobalCTX);
	const [cost, setCost] = React.useState(prices);
	const { updatePrices } = useUpdate();

	React.useEffect(() => {
		if (Object.keys(prices).length)
			setCost(prices)
	}, [prices])

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitted, defaultValues },
	} = useForm({
		mode: "onSubmit",
		resolver: yupResolver(pricingSchema),
		defaultValues: cost
	});

	React.useEffect(() => {
		console.log(defaultValues, "default")
	}, [isSubmitted])

	const onSubmit = handleSubmit((formData) => {
		const reqData = Object.entries(formData).map(([key, value]) => ({
			trip_name: key,
			cost: value
		}));
		mountPortalModal(
			<ConfirmationModal
				props={{
					header: "Are you sure you want to update these prices?",
					handleRequest: () => updatePrices(reqData, () => { revalidate() })
				}}
			/>
		);
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCost((prev) => ({ ...prev, [name]: value }))
	}

	return (
		<form onSubmit={onSubmit} className="space-y-10">
			<div className="flex justify-between mb-10">
				<h1 className="font-semibold text-lg">Manage Prices</h1>
				<Button
					type="submit"
					// disabled={!isDirty}
					text="Save"
					className="w-40"
				/>
			</div>
			<div className="p-10 rounded-lg bg-white">
				<h2 className="mb-5 font-medium">Rental Pricing</h2>
				<table className="w-full border [&_th]:p-2  [&_th]:border [&_td]:px-2  [&_td]:py-4 [&_td]:text-center   [&_td]:border  ">
					<colgroup>
						<col style={{ 'width': '10%' }} />
						<col style={{ 'width': '30%' }} />
						<col style={{ 'width': '40%' }} />
						<col style={{ 'width': '20%' }} />
					</colgroup>
					<thead>
						<tr>
							<th>S/N</th>
							<th>Rental Package</th>
							<th> Rent Cost</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Within Marina</td>
							<EditableInput
								defaultValue={cost["within_marina"]}
								{...register("within_marina")}
								error={errors}
								formState={{ isSubmitted, state }}
								handleOnChange={handleChange}
							/>
						</tr>
						<tr>
							<td>2</td>
							<td>Calabar to Uyo</td>
							<EditableInput
								defaultValue={defaultValues["calabar_to_uyo"]}
								{...register("calabar_to_uyo")}
								error={errors}
								formState={{ isSubmitted, state }}
								handleOnChange={handleChange}
							/>
						</tr>
						<tr>
							<td>3</td>
							<td>Uyo to Calabar</td>
							<EditableInput
								defaultValue={defaultValues["uyo_to_calabar"]}
								{...register("uyo_to_calabar")}
								error={errors}
								formState={{ isSubmitted, state }}
								handleOnChange={handleChange}

							/>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="p-10 rounded-lg bg-white">
				<h2 className="mb-5 font-medium">Logistics Pricing</h2>
				<table className="w-full border [&_th]:p-2  [&_th]:border [&_td]:px-2  [&_td]:py-4 [&_td]:text-center   [&_td]:border  ">
					<colgroup>
						<col style={{ 'width': '10%' }} />
						<col style={{ 'width': '30%' }} />
						<col style={{ 'width': '40%' }} />
						<col style={{ 'width': '20%' }} />
					</colgroup>
					<thead>
						<tr>
							<th>S/N</th>
							<th>Terminals</th>
							<th>Cost/kg</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Both Terminals</td>
							<EditableInput
								defaultValue={defaultValues["logistics"]}
								{...register("logistics")}
								error={errors}
								formState={{ isSubmitted, state }}
								handleOnChange={handleChange}

							/>
						</tr>
					</tbody>
				</table>
			</div>
		</form>
	);
};

export default Pricing;

const EditableInput = React.forwardRef((props, ref) => {
	const { name, error, formState: { isSubmitted, state }, onChange, defaultValue, handleOnChange, ...prop } = props;
	const errors = error?.[name];
	const [editable, setEditable] = React.useState(false);
	const [value, setValue] = React.useState(defaultValue);
	const toggleEditable = (element) => {
		if (!editable) document.getElementById(element).focus();
		setEditable((prev) => !prev);
	};

	React.useEffect(() => {
		setValue(defaultValue);
	}, [state])

	React.useEffect(() => {
		if (isSubmitted) setEditable(false);
	}, [isSubmitted]);

	const handleChange = (e) => {
		setValue(e.target.value)
	}
	return (
		<>
			<td>
				<div
					className={cn(
						"flex gap-1 items-center rounded-lg border-2 border-transparent px-3 w-60 mx-auto h-12 relative",
						{ "border-gray-600": editable, "border-red-500": errors }
					)}
				>
					<p>₦</p>
					<input
						ref={ref}
						{...prop}
						name={name}
						id={name}
						value={value}
						type="text"
						onChange={(event) => {
							onChange(event);
							handleChange(event)
							handleOnChange(event)
						}}
						disabled={!editable}
						autoFocus={editable ? "autofocus" : ""}
						className="prices w-full h-full bg-transparent focus:outline-none"
					/>
					{errors && (
						<p className="text-[10px] text-red-700 absolute -bottom-4 left-0 ">
							{errors?.message}
						</p>
					)}
				</div>
			</td>
			<td>
				<ButtonUI type="button" onClick={() => toggleEditable(name)}>
					Edit
				</ButtonUI>
			</td>
		</>
	);
});

EditableInput.displayName = EditableInput;

export const PriceLoader = async () => {
	try {
		const response = await axiosInstance.get("/price/get");
		const resData = response.data.prices.map((item) => ({ [item.trip_name]: item.cost }));
		const result = Object.assign({}, ...resData);
		return result;

	} catch (error) {
		if (
			!error.code === "ERR_NETWORK" ||
			!error.code === "ERR_INTERNET_DISCONNECTED" ||
			!error.code === "ECONNABORTED"
		)
			toast.error("Error occurred while retrieving trip details");
		return {
			within_marina: 0,
			calabar_to_uyo: 0,
			uyo_to_calabar: 0,
			logistics: 0
		};
	}
};
