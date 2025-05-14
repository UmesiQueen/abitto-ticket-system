import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import GlobalContext from "@/contexts/GlobalContext";
import "./index.css";
import ModalPortal from "./components/ModalPortal";
import { ErrorBoundary } from "react-error-boundary";

const App = () => {
	const pathname = useLocation();

	React.useEffect(() => {
		if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "smooth" });
	}, [pathname]);

	return (
		<ErrorBoundary FallbackComponent={Fallback}>
			<GlobalContext>
				<div className="font-poppins overflow-hidden">
					<Outlet />
					<Toaster
						position="top-center"
						expand={true}
						richColors
						toastOptions={{
							className: "p-3",
						}}
					/>
					<ModalPortal />
				</div>
			</GlobalContext>
		</ErrorBoundary>
	);
};

const Fallback = ({
	error,
	resetErrorBoundary,
}) => {
	// Call resetErrorBoundary() to reset the error boundary and retry the render.
	setTimeout(() => resetErrorBoundary(), 5000);
	return (
		<div>
			<p>Something went wrong:</p>
			<pre style={{ color: "red" }}>{error.message}</pre>
		</div>
	);
};

export default App;
