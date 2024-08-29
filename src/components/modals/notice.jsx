import React from "react";
import Logo from "@/assets/logo3.svg";
import { Button } from "../ui/button";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { CancelSquareIcon } from "@/assets/icons";

// eslint-disable-next-line react/prop-types
const NoticeModal = ({ children }) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className="bg-blue-500 w-[800px] relative ">
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-0 top-0"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</Button>
			<div className="bg-white w-full min-h-72 py-16 md:p-10 px-10 flex flex-col gap-5 text-center justify-center font-semibold rounded-br-[200px] rounded-tl-[200px] text-sm md:text-base">
				<img
					alt="logo"
					src={Logo}
					width={200}
					height={150}
					className="ml-auto mb-2 w-40 md:w-52"
				/>
				{children}
				<div className="border-t border-gray-400 md:mx-20 pt-4">
					<a href="https://www.abittoferry.com/">WWW.ABITTOFERRY.COM</a>
				</div>
			</div>
		</div>
	);
};

export default NoticeModal;
