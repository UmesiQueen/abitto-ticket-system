import React from "react";
import { useLocation } from "react-router-dom";
import { GlobalCTX } from "@/contexts/GlobalContext";
import "./styles.css";
import { cn } from "@/lib/utils";

const Loader = () => {
	const { loading } = React.useContext(GlobalCTX);
	const { pathname } = useLocation();

	return (
		<>
			{loading && (
				<div
					className={cn(
						"w-full h-full top-0 z-[999] bg-black/20 backdrop-blur-[1px]  flex items-center justify-center",
						pathname.includes("/backend") ? "absolute" : "fixed"
					)}
				>
					<div className="w-20 rounded-xl h-20 bg-[#E9EBF8CC] flex items-center justify-center">
						<svg
							width="58"
							height="50"
							viewBox="0 0 58 50"
							fill="none"
							className="fadeIn"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M11 32.5L1 49.5H20.5L11 32.5Z" fill="#669900" />
							<path d="M16 23L13 28.5L24 46.5L27 41.5L16 23Z" fill="#3366CC" />
							<path
								d="M21.5 14L18.5 19L29 37.5L32.5 32.5L21.5 14Z"
								fill="#669900"
							/>
							<path
								d="M29.5 0L24 9.5L37 32.5L30 43.5H43.5L47 49.5H58L29.5 0Z"
								fill="#3366CC"
							/>
						</svg>
					</div>
				</div>
			)}
		</>
	);
};

export default Loader;
