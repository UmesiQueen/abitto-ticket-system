/* eslint-disable react/prop-types */
import React from "react";
import { Warning2 } from "iconsax-react";
import CustomButton from "@/components/custom/Button";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import { cn } from "@/lib/utils";
import { CancelSquareIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";

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
		<div className="w-96 p-5 rounded-lg bg-white flex flex-col gap-4 relative">
			<Button
				variant="ghost"
				size="icon"
				className="absolute top-0 right-0 scale-[.8]"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</Button>
			<h2 className="font-bold text-lg text-black/90">{header}</h2>
			<div className={cn("p-3 text-sm inline-flex gap-1", variant[severity])}>
				<Warning2 />
				<p>
					Whatever changes you make{" "}
					<strong> will reflect across the entire platform</strong>.
				</p>
			</div>

			<div className="flex gap-3 justify-between !mt-5">
				<CustomButton
					variant="outline"
					className={cn("w-56", {
						" !text-black/50 hover:!text-blue-700 border-black/50":
							severity === "delete",
					})}
					onClick={unMountPortalModal}
				>
					Cancel
				</CustomButton>
				<CustomButton
					className={cn("w-56", {
						"!bg-[#E71F1F] border-[#E71F1F] hover:!bg-red-700 hover:!border-red-700":
							severity === "delete",
					})}
					loading={loading}
					onClick={handleRequest}
				>
					{severity === "delete" ? "Delete" : "Save Changes"}
				</CustomButton>
			</div>
		</div>
	);
};

export default ConfirmationModal;
