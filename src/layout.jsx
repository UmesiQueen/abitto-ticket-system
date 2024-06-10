import React from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Loader from "@/components/animation/Loader";
import { Toaster } from "sonner";

const GlobalLayout = ({ children }) => {
  const pathname = useLocation();

  React.useEffect(() => {
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <div className="font-poppins overflow-hidden">
      {children}
      <Loader />
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
};

export default GlobalLayout;

GlobalLayout.propTypes = {
  children: PropTypes.node,
};
