import React from "react";
import PropTypes from "prop-types";
import BookingContext from "./BookingContext";
import axios from "axios";

export const GlobalCTX = React.createContext();

const adminStore = JSON.parse(localStorage.getItem("admin")) || null;
const GlobalContext = ({ children }) => {
  const about = React.useRef();
  const contact = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [dataQuery, setDataQuery] = React.useState([]);
  const [isAuth, setAuth] = React.useState(adminStore);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);

  React.useEffect(() => {
    if (isAuth) localStorage.setItem("admin", JSON.stringify(isAuth));
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

  const scrollToSection = (e) => {
    window.scrollTo({
      top: e.current.offsetTop - 70,
      behavior: "smooth",
    });
  };

  const ctxValue = {
    about,
    contact,
    scrollToSection,
    loading,
    setLoading,
    isAuth,
    setAuth,
    dataQuery,
    setDataQuery,
    currentPageIndex,
    setCurrentPageIndex,
  };

  return (
    <GlobalCTX.Provider value={ctxValue}>
      <BookingContext>{children}</BookingContext>
    </GlobalCTX.Provider>
  );
};

GlobalContext.propTypes = {
  children: PropTypes.node,
};

export default GlobalContext;
