import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Loader from "@/components/animation/Loader";
import { Toaster } from "sonner";

import GlobalContext from "./hooks/GlobalContext";
import "./index.css";

const App = () => {
  const pathname = useLocation();

  React.useEffect(() => {
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <GlobalContext>
      <div className="font-poppins overflow-hidden">
        <Outlet />
        <Loader />
        <Toaster position="top-center" expand={true} richColors />
      </div>
    </GlobalContext>
  );
};

export default App;
