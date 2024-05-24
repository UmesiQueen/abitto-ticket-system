import {
  DashboardSquareIcon,
  SettingsIcon,
  UserIcon,
  TicketIcon,
  InvoiceIcon,
  NotificationIcon,
  CaretIcon,
  SearchIcon,
  LogoutIcon,
} from "@/assets/icons";
import { Outlet, NavLink } from "react-router-dom";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";

const AdminLayout = () => {
  return (
    <div className="font-poppins">
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
              [
                "Dashboard",
                "/admin/dashboard",
                <DashboardSquareIcon key="1" />,
              ],
              [
                "Booking Details",
                "/admin/booking-details",
                <TicketIcon key="1" />,
              ],
              ["Customer", "/admin/customers", <UserIcon key="1" />],
              ["Payments", "/admin/payments", <InvoiceIcon key="1" />],
              ["Settings", "/admin/settings", <SettingsIcon key="1" />],
            ].map(([title, url, icon]) => (
              <li key={title}>
                <NavLink
                  to={url}
                  className={`[&.active]:bg-blue-500 px-5 py-3 rounded-xl hover:bg-gray-700/90 mb-2 transition-all  ease-in-out cursor-pointer flex items-center gap-2  ${({
                    isActive,
                  }) => (isActive ? "active" : "")}`}
                >
                  <span className="text-[#f1f1f1]">{icon}</span>
                  <span className="font-medium text-sm ">{title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button className=" px-10 py-5 mt-auto flex items-center gap-2  hover:bg-gray-900/80 ">
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </aside>
      <main className="ml-60 bg-[#F7F7F7] min-h-screen ">
        <header className="h-16 w-full bg-white px-8 flex items-center gap-5">
          <div className="h-10 w-80 bg-blue-50 p-3 border border-blue-500 rounded-lg font-normal text-xs font-poppins flex items-center gap-2">
            <SearchIcon />
            <input
              type="text"
              className="bg-transparent w-full focus:outline-none py-1"
              placeholder="Search for id, destination, date, or status"
            />
          </div>
          <div className="rounded-full bg-[#F1F1F1] p-2 ml-auto">
            <Badge color="error" overlap="circular" variant="dot">
              <NotificationIcon />
            </Badge>
          </div>
          <div className=" bg-[#5e548e] rounded-full">
            <Avatar alt="profile" src="https://i.ibb.co/bKKvY14/Queen.png" />
          </div>
          <button className="text-black rotate-90 ">
            <CaretIcon />
          </button>
        </header>
        <section className="p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
