import {
  DashboardSquareIcon,
  SettingsIcon,
  UserIcon,
  TicketIcon,
  InvoiceIcon,
} from "@/assets/icons";
import { Outlet, NavLink } from "react-router-dom";

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
              ["Customer", "/admin/customer", <UserIcon key="1" />],
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
                  {icon}
                  <span className="font-medium text-sm ">{title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button className=" py-5 mt-auto flex items-center justify-center gap-2  hover:bg-gray-900/80 ">
          <DashboardSquareIcon />
          <span>Logout</span>
        </button>
      </aside>
      <main className="ml-56">
        <div className="h-16 w-full bg-white px-5 flex items-center" />
        <section className=" bg-[#F7F7F7] h-[calc(100vh-64px)] p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
