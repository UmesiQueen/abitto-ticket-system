/* eslint-disable react/prop-types */
import React from "react";
import { Warning2 } from "iconsax-react";
import Button from "@/components/custom/Button";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import { cn } from "@/lib/utils";

const ConfirmationModal = ({
	props: { header, handleRequest, severity = "warning" },
}) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const { loading } = React.useContext(BookingCTX);
	const variant = {
		warning: "bg-blue-50 text-blue-500",
		delete: "bg-red-100 text-red-500",
	};

	return (
		<div className="w-96 px-5 py-10 rounded-lg bg-white space-y-5">
			<h2 className="font-semibold text-center">{header}</h2>
			<div className={cn("p-3 text-sm inline-flex gap-1", variant[severity])}>
				<Warning2 />
				<p>
					Whatever changes you make{" "}
					<strong> will reflect across the entire platform</strong>.
				</p>
			</div>

			<div className="flex gap-5 justify-between !mt-10">
				<Button
					text="Cancel"
					variant="outline"
					className={cn("w-56", {
						" !text-black/50 hover:!text-blue-700 border-black/50":
							severity == "delete",
					})}
					onClick={unMountPortalModal}
				/>
				<Button
					text={severity == "delete" ? "Delete" : "Save Changes"}
					className={cn("w-56", {
						"!bg-[#E71F1F] border-[#E71F1F] hover:!bg-red-700 hover:!border-red-700":
							severity == "delete",
					})}
					loading={loading}
					onClick={handleRequest}
				/>
			</div>
		</div>
	);
};

export default ConfirmationModal;
