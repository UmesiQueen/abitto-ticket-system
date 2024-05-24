import {
  FerryBoatIcon,
  UserGroupIcon,
  WalletIcon,
  TicketIcon,
  FilterIcon,
  CaretIcon,
} from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const users = [
  {
    bookingID: "#00001234",
    name: "Name & Surname",
    email: "abitto@email.com",
    amount: "₦16,000",
    type: "One-way",
    medium: "Offline",
    paidWith: "Cash",
    status: "Success",
    dateTime: "May 19,2024",
  },
  {
    bookingID: "#00002234",
    name: "Name & Surname",
    email: "abitto@email.com",
    amount: "₦16,000",
    type: "One-way",
    medium: "Online",
    paidWith: "Paystack",
    status: "Pending",
    dateTime: "May 19,2024",
  },
  {
    bookingID: "#00003234",
    name: "Name & Surname",
    email: "abitto@email.com",
    amount: "₦16,000",
    type: "Round-trp",
    medium: "Online",
    paidWith: "Paystack",
    status: "Canceled",
    dateTime: "May 19,2024",
  },
];

const Dashboard = () => {
  return (
    <div className="">
      <h1 className="text-base  font-semibold">Dashboard Overview</h1>{" "}
      <div className="mt-8 flex flex-col gap-5 ">
        <div className="bg-white rounded-lg p-5 ">
          <ul className="border rounded-lg  p-5 flex justify-between divide-x-reverse ">
            <li className="flex items-center gap-3 w-52 ">
              <div className="rounded-lg bg-blue-50 p-2">
                <WalletIcon />
              </div>
              <div>
                <p className="text-xs text-[#7F7F7F] ">Total Earnings (MRR)</p>
                <p className="text-base">
                  <b>₦2,654,002.01</b>
                </p>
              </div>
            </li>
            <li className="flex items-center gap-3 w-52 ">
              <div className="rounded-lg bg-blue-50 p-2">
                <UserGroupIcon />
              </div>
              <div>
                <p className="text-xs text-[#7F7F7F] ">Total Passengers</p>
                <p className="text-base">
                  <b>1020</b>
                </p>
              </div>
            </li>
            <li className="flex items-center gap-3 w-52 ">
              <div className="rounded-lg bg-blue-50 p-2">
                <FerryBoatIcon />
              </div>
              <div>
                <p className="text-xs text-[#7F7F7F] ">Total Completed Trips</p>
                <p className="text-base">
                  <b>204</b>
                </p>
              </div>
            </li>
            <li className="flex items-center gap-3 w-52 ">
              <div className="rounded-lg bg-blue-50 p-2">
                <span className="text-blue-500">
                  <TicketIcon />
                </span>
              </div>
              <div>
                <p className="text-xs text-[#7F7F7F] ">New Bookings</p>
                <p className="text-base">
                  <b>120</b>
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* charts */}
        <div className="flex gap-5">
          <div className="bg-white rounded-lg p-5 basis-9/12 self-center ">
            <img alt="chart" src="/src/assets/Chart.png" />
          </div>
          <div className="bg-white rounded-lg p-5 basis-3/12">
            <img
              alt="booking"
              src="/src/assets/today-booking.png"
              className="mx-auto"
            />
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-lg p-5 mb-5 ">
          <div className="border rounded-lg ">
            <div className="flex items-center gap-5 mb-5 p-5 border-b">
              <h2 className=" font-semibold text-sm ">Latest Booking List</h2>
              <div className="rounded-lg border px-4 p-2 cursor-pointer flex items-center gap-3 ml-auto">
                <span>
                  <FilterIcon />
                </span>
                Filter
              </div>
              <div className="rounded-lg border px-4 p-2 cursor-pointer flex items-center gap-3">
                View all
                <span className="rotate-90 ">
                  <CaretIcon />
                </span>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Paid with</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.bookingID}>
                    <TableCell>{user.bookingID}</TableCell>
                    <TableCell>
                      <p>{user.name}</p>
                      <p>{user.email}</p>
                    </TableCell>
                    <TableCell>{user.amount}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>{user.medium}</TableCell>
                    <TableCell>{user.paidWith}</TableCell>
                    <TableCell>
                      <span
                        className={cn("rounded-lg px-4 py-1 text-[10px]", {
                          "text-green-500 bg-green-100":
                            user.status === "Success",
                          "text-[#E78913] bg-[#F8DAB6]":
                            user.status === "Pending",
                          "text-[#F00000] bg-[#FAB0B0]":
                            user.status === "Canceled",
                        })}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>{user.dateTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
