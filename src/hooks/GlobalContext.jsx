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

  const store = JSON.parse(localStorage.getItem("admin")) || {};
  const [isAuth, setAuth] = React.useState(store);

  React.useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(isAuth));
  }, [isAuth]);

  React.useEffect(() => {
    // const BASE_URL = import.meta.env.ABITTO_BASE_URL;
    axios
      .get(`https://abitto-api.onrender.com/api/booking/getbooking`)
      .then((res) => {
        setDataQuery(res.data.bookings);
      })
      .catch((err) => {
        console.error(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <GlobalCTX.Provider
      value={{
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
      }}
    >
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
