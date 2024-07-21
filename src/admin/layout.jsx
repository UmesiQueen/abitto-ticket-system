import {
  DashboardSquareIcon,
  SettingsIcon,
  TicketIcon,
  InvoiceIcon,
  SearchIcon,
  LogoutIcon,
  UserIcon,
  BookIcon,
} from "@/assets/icons";
import {
  Outlet,
  NavLink,
  Navigate,
  useNavigate,
  Link,
  useLocation,
  useLoaderData,
} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import { Helmet } from "react-helmet-async";
import DefaultProfile from "@/assets/images/default_profile.png";
import axios from "axios";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuth } = React.useContext(GlobalCTX);
  const { setBookingQuery } = React.useContext(BookingCTX);
  const { pathname } = useLocation();
  const dataQuery = useLoaderData();
  const searchBarVisibility = [
    "/admin/booking-details",
    "/admin/customers",
  ].includes(pathname);

  React.useEffect(() => {
    setBookingQuery(dataQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataQuery]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <>
      <Helmet>
        <title>Admin | Abitto Ferry</title>
      </Helmet>
      <div className="relative">
        {/* sidebar */}
        <aside className=" h-screen w-60 bg-black text-white flex flex-col gap-10 fixed">
          <img
            alt="logo"
            src="https://i.ibb.co/17zsqj1/logo2.png"
            width={176}
            height={60}
            className="px-5"
          />
          <nav className="px-5">
            <ul>
              {[
                ["Create", "/admin/create", <TicketIcon key="1" />],
                [
                  "Booking Details",
                  "/admin/booking-details",
                  <BookIcon key="1" />,
                ],
                ["Customers", "/admin/customers", <UserIcon key="1" />],
                [
                  "Journey List",
                  "/admin/journey-list",
                  <InvoiceIcon key="1" />,
                ],
                ["Report", "/admin/report", <DashboardSquareIcon key="1" />],
                ["Settings", "/admin/settings", <SettingsIcon key="1" />],
              ].map(([title, url, icon]) => (
                <li key={title}>
                  <NavLink
                    to={url}
                    className="[&.active]:bg-blue-500 px-5 py-3 rounded-xl hover:bg-gray-700/90 mb-2 transition-all  ease-in-out cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-[#f1f1f1]">{icon}</span>
                    <span className="font-medium text-sm ">{title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className=" px-10 py-5 mt-auto flex items-center gap-2 hover:bg-gray-900/80 "
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </aside>
        <main className="ml-60 bg-[#F7F7F7] min-h-screen ">
          <header className="h-16 w-full bg-white px-8 flex items-center gap-5">
            {searchBarVisibility && (
              <div className="h-10 w-80 bg-blue-50 p-3 border border-blue-500 rounded-lg font-normal text-xs font-poppins flex items-center gap-2">
                <SearchIcon />
                <input
                  type="text"
                  className="bg-transparent w-full focus:outline-none py-1"
                  placeholder="Search by booking Id or name"
                />
              </div>
            )}
            <div className="ml-auto flex gap-3 text-right">
              <div className=" leading-none self-end">
                <p className="font-semibold">{isAuth.first_name}</p>
                <p className="text-sm font-medium text-gray-500">
                  {isAuth.account_type}
                </p>
              </div>
              <Link to="/admin/settings">
                <Avatar
                  alt="profile"
                  src={DefaultProfile}
                  className="bg-gray-300"
                />
              </Link>
            </div>
          </header>
          <section className="p-8">
            <Outlet />
          </section>
        </main>
      </div>
    </>
  );
};

const AdminLayout = () => {
  const { isAuth } = React.useContext(GlobalCTX);
  return <>{isAuth?.isAdmin ? <ProtectedRoute /> : <Navigate to="/login" />}</>;
};

export default AdminLayout;

export const DataQueryLoader = async () => {
  try {
    const response = await axios.get(
      "https://abitto-api.onrender.com/api/booking/querynew"
    );
    return response.data.bookings.reverse();
  } catch (error) {
    console.error(error);
    return [];
  }
};
