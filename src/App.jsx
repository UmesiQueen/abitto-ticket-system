import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import GlobalContext from "@/contexts/GlobalContext";
import "./index.css";
import ModalPortal from "./components/ModalPortal";

const App = () => {
	const pathname = useLocation();

	React.useEffect(() => {
		if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "smooth" });
	}, [pathname]);

	return (
		<GlobalContext>
			<div className="font-poppins overflow-hidden">
				<Outlet />
				<Toaster
					position="top-center"
					expand={true}
					richColors
					toastOptions={{
						className: "p-2",
					}}
				/>
				<ModalPortal />
			</div>
		</GlobalContext>
	);
};

export default App;
