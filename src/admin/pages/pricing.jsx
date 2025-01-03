/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/custom/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn, customError } from "@/lib/utils";
import { GlobalCTX } from "@/contexts/GlobalContext";
import ConfirmationModal from "@/components/modals/confirmation";
import axiosInstance from "@/api";
import { useUpdate } from "@/hooks/useUpdate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { NumericFormat } from "react-number-format";

const pricingSchema = yup.object().shape({
	within_marina: yup.string().required("Amount cannot be empty."),
	calabar_to_uyo: yup.string().required("Amount cannot be empty."),
	uyo_to_calabar: yup.string().required("Amount cannot be empty."),
	logistics: yup.string().required("Amount cannot be empty."),
});

const Pricing = () => {
	const { mountPortalModal } = React.useContext(GlobalCTX);
	const [cost, setCost] = React.useState({
		within_marina: 0,
		calabar_to_uyo: 0,
		uyo_to_calabar: 0,
		logistics: 0
	});
	const { updatePrices } = useUpdate();
	const queryClient = useQueryClient();

	const { data, isSuccess, isPending } = useQuery({
		queryKey: ["prices"],
		queryFn: PriceLoader
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitted, defaultValues },
	} = useForm({
		mode: "onSubmit",
		resolver: yupResolver(pricingSchema),
		defaultValues: cost
	});

	React.useEffect(() => {
		if (isSuccess) {
			reset(data)
			setCost(data)
		}
	}, [data, isSuccess, reset])

	const onSubmit = handleSubmit((formData) => {
		const reqData = Object.entries(formData).map(([key, value]) => ({
			trip_name: key,
			cost: value.replace("₦", "")
				.split("")
				.filter((cost) => cost !== ",")
				.join("")
		}));

		mountPortalModal(
			<ConfirmationModal
				props={{
					header: "Update prices?",
					handleRequest: () => updatePrices(reqData, () => { queryClient.invalidateQueries("prices") })
				}}
			/>
		);
	});

	const handleChange = ({ name, value }) => {
		setCost((prev) => ({ ...prev, [name]: value }))
	}

	return (
		<form onSubmit={onSubmit} className="space-y-10">
			<div className="flex justify-between">
				<h1 className="font-semibold text-lg">Manage Prices</h1>
				<CustomButton
					type="submit"
					disabled={!!Object.keys(errors).length}
					className="w-40"
				>Save</CustomButton>
			</div>
			{isPending && <p className="inline-flex gap-2 items-center text-xs">Fetching data <Loader2 className="animate-spin" /></p>}
			<div className="p-10 rounded-lg bg-white mt-10">
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
							<th className="text-left !px-10">Rent Cost</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Within Marina</td>
							<EditableInput
								defaultValue={defaultValues.within_marina}
								{...register("within_marina")}
								error={errors}
								isSubmitted={isSubmitted}
								handleOnChange={handleChange}
							/>
						</tr>
						<tr>
							<td>2</td>
							<td>Calabar to Uyo</td>
							<EditableInput
								defaultValue={defaultValues.calabar_to_uyo}
								{...register("calabar_to_uyo")}
								error={errors}
								isSubmitted={isSubmitted}
								handleOnChange={handleChange}
							/>
						</tr>
						<tr>
							<td>3</td>
							<td>Uyo to Calabar</td>
							<EditableInput
								defaultValue={defaultValues.uyo_to_calabar}
								{...register("uyo_to_calabar")}
								error={errors}
								isSubmitted={isSubmitted}
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
							<th className="text-left !px-10">Cost/kg</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Both Terminals</td>
							<EditableInput
								defaultValue={defaultValues.logistics}
								{...register("logistics")}
								error={errors}
								isSubmitted={isSubmitted}
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
	const { name, error, isSubmitted, onChange, defaultValue, handleOnChange, onBlur } = props;
	const errors = error?.[name];
	const [editable, setEditable] = React.useState(false);
	const [value, setValue] = React.useState(defaultValue);

	const toggleEditable = (element) => {
		if (!editable) document.getElementById(element).focus();
		setEditable((prev) => !prev);
	};

	React.useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue])

	React.useEffect(() => {
		if (isSubmitted) setEditable(false);
	}, [isSubmitted]);

	const handleChange = (sourceInfo) => {
		const event = sourceInfo?.event;
		if (event) {
			onChange(event);
			const value = event.target.value.replace("₦", "")
				.split("")
				.filter((cost) => cost !== ",")
				.join("");
			setValue(value);
			handleOnChange({ name, value });
		}
	}

	return (
		<>
			<td>
				<div
					className={cn(
						"flex gap-1 items-center rounded-lg border-2 border-transparent px-3 w-60 mx-5  h-12 relative",
						{ "border-gray-600": editable, "border-red-500": errors }
					)}
				>
					<NumericFormat
						prefix="₦"
						getInputRef={ref}
						name={name}
						id={name}
						value={value}
						placeholder="0.0"
						thousandSeparator=","
						allowNegative={false}
						onValueChange={(_, sourceInfo) => handleChange(sourceInfo)}
						onBlur={(event) => {
							setEditable(false);
							onBlur(event);
						}}
						disabled={!editable}
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
				<Button type="button" onClick={() => toggleEditable(name)}>
					Edit
				</Button>
			</td>
		</>
	);
});

EditableInput.displayName = EditableInput;

export const PriceLoader = async () => {
	try {
		const response = await axiosInstance.get("/price/get");
		const resData = response.data.prices.map((item) => ({ [item.trip_name]: String(item.cost) }));
		const result = Object.assign({}, ...resData);
		return result;
	} catch (error) {
		customError(error, "Error occurred while retrieving trip details");
		return {
			within_marina: 0,
			calabar_to_uyo: 0,
			uyo_to_calabar: 0,
			logistics: 0
		};
	}
};
