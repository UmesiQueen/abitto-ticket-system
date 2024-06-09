import React from "react";
import PropTypes from "prop-types";
import BookingContext from "./BookingContext";
import Alert_ from "@/components/custom/Alert";
import Loader from "@/components/animation/Loader";
import axios from "axios";

export const GlobalCTX = React.createContext();

const GlobalContext = ({ children }) => {
  const about = React.useRef();
  const contact = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({ state: false, variant: null });
  const [dataQuery, setDataQuery] = React.useState([]);

  const store = JSON.parse(localStorage.getItem("admin")) || "";
  const [isAuth, setAuth] = React.useState(store);

  React.useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(isAuth));
    // const BASE_URL = import.meta.env.DEV ?
    //    import.meta.env.VITE_ABITTO_BASE_URL
    //   : import.meta.env.ABITTO_BASE_URL;

    if (isAuth?.isAdmin) {
      axios
        .get("https://abitto-api.onrender.com/api/booking/getbooking")
        .then((res) => {
          setDataQuery(res.data.bookings.reverse());
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isAuth]);

  // React.useEffect(() => {
  //   const totalEarnings = dataQuery
  //     .map((booking) => booking.amount)
  //     .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  // }, [dataQuery]);

  const scrollToSection = (e) => {
    window.scrollTo({
      top: e.current.offsetTop,
      behavior: "smooth",
    });
  };

  const handleAlert = (variant) => {
    setAlert({ state: true, variant });
    setTimeout(() => {
      setAlert({ state: false, variant: null });
    }, 3500);
  };

  const ctxValue = {
    about,
    contact,
    scrollToSection,
    loading,
    setLoading,
    alert,
    handleAlert,
    isAuth,
    setAuth,
    dataQuery,
    setDataQuery,
  };

  return (
    <GlobalCTX.Provider value={ctxValue}>
      <BookingContext>{children}</BookingContext>
      <Alert_ />
      <Loader />
    </GlobalCTX.Provider>
  );
};

GlobalContext.propTypes = {
  children: PropTypes.node,
};

export default GlobalContext;
