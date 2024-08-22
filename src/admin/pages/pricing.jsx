/* eslint-disable react/prop-types */
import React from "react";
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { GlobalCTX } from "@/contexts/GlobalContext";
import ConfirmationModal from "@/components/modals/confirmation";
import SuccessModal from "@/components/modals/success";

const pricingSchema = yup.object().shape({
	within_marina: yup.string().required("Amount cannot be empty."),
	calabar_to_uyo: yup.string().required("Amount cannot be empty."),
	uyo_to_calabar: yup.string().required("Amount cannot be empty."),
	logistics: yup.string().required("Amount cannot be empty."),
});

const Pricing = () => {
	const [cost, setCost] = React.useState({
		within_marina: 200000,
		calabar_to_uyo: 400000,
		uyo_to_calabar: 400000,
		logistics: 1000,
	});
	const { mountPortalModal, setLoading, unMountPortalModal } =
		React.useContext(GlobalCTX);
	const {
		register,
		handleSubmit,
		formState: { isDirty, defaultValues, errors, isSubmitted },
	} = useForm({
		mode: "onSubmit",
		resolver: yupResolver(pricingSchema),
		defaultValues: cost,
	});

	const handleUpdateRequest = (formData) => {
		unMountPortalModal();
		setLoading(true);

		setTimeout(() => {
			setLoading(false);
			setCost(formData);
			mountPortalModal(
				<SuccessModal
					header="Prices Updated"
					text="You have successfully updated prices across the platform."
				/>
			);
		}, 600);
	};

	const onSubmit = handleSubmit((formData) => {
		mountPortalModal(
			<ConfirmationModal
				props={{
					header: "Are you sure you want to update these prices?",
					handleRequest: () => handleUpdateRequest(formData),
				}}
			/>
		);
	});

	return (
		<form onSubmit={onSubmit} className="space-y-10">
			<div className="flex justify-between mb-10">
				<h1 className="font-semibold text-lg">Manage Prices</h1>
				<Button
					type="submit"
					disabled={!isDirty}
					text="Save"
					className="w-40"
				/>
			</div>
			<div className="p-10 rounded-lg bg-white">
				<h2 className="mb-5 font-medium">Rental Pricing</h2>
				<table className="w-full border [&_th]:p-2  [&_th]:border [&_td]:px-2  [&_td]:py-4 [&_td]:text-center   [&_td]:border  ">
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
								defaultValue={defaultValues["within_marina"]}
								{...register("within_marina")}
								error={errors}
								isSubmitted={isSubmitted}
							/>
						</tr>
						<tr>
							<td>2</td>
							<td>Calabar to Uyo</td>
							<EditableInput
								defaultValue={defaultValues["calabar_to_uyo"]}
								{...register("calabar_to_uyo")}
								error={errors}
								isSubmitted={isSubmitted}
							/>
						</tr>
						<tr>
							<td>3</td>
							<td>Uyo to Calabar</td>
							<EditableInput
								defaultValue={defaultValues["uyo_to_calabar"]}
								{...register("uyo_to_calabar")}
								error={errors}
								isSubmitted={isSubmitted}
							/>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="p-10 rounded-lg bg-white">
				<h2 className="mb-5 font-medium">Logistics Pricing</h2>
				<table className="w-full border [&_th]:p-2  [&_th]:border [&_td]:px-2  [&_td]:py-4 [&_td]:text-center   [&_td]:border  ">
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
								isSubmitted={isSubmitted}
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
	const { name, error, isSubmitted } = props;
	const errors = error?.[name];
	const [editable, setEditable] = React.useState(false);

	const toggleEditable = (element) => {
		if (!editable) document.getElementById(element).focus();
		setEditable((prev) => !prev);
	};

	React.useEffect(() => {
		if (isSubmitted) setEditable(false);
	}, [isSubmitted]);

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
						{...props}
						id={name}
						type="number"
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
