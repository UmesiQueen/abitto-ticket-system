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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BarChart } from "@tremor/react";

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

const chartDataDemo = [
  {
    date: "Jan",
    "first half": 1488,
    "second half": 300,
  },
  {
    date: "Feb",
    "first half": 1445,
    "second half": 900,
  },
  {
    date: "March",
    "first half": 743,
    "second half": 1000,
  },
  {
    date: "April",
    "first half": 281,
    "second half": 1900,
  },
  {
    date: "May",
    "first half": 1501,
    "second half": 1700,
  },
  {
    date: "Jun",
    "first half": 2302,
    "second half": 900,
  },
  {
    date: "July",
    "first half": 1098,
    "second half": 970,
  },
  {
    date: "Aug",
    "first half": 980,
    "second half": 2300,
  },
  {
    date: "Sept",
    "first half": 1998,
    "second half": 1000,
  },
  {
    date: "Oct",
    "first half": 2188,
    "second half": 1300,
  },
  {
    date: "Nov",
    "first half": 98,
    "second half": 2300,
  },
  {
    date: "Dec",
    "first half": 1098,
    "second half": 300,
  },
];

const Dashboard = () => {
  const dataFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  return (
    <div className="">
      <h1 className="text-lg font-semibold">Dashboard Overview</h1>
      <div className="mt-8 flex flex-col gap-5 ">
        <div className="bg-white rounded-lg p-5 ">
          <ul className="border rounded-lg  p-5 flex justify-between items-center h-[100px] ">
            <li className="flex items-center gap-3 ">
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
            <Separator orientation={"vertical"} />
            <li className="flex items-center gap-3 ">
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
            <Separator orientation={"vertical"} />
            <li className="flex items-center gap-3 ">
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
            <Separator orientation={"vertical"} />
            <li className="flex items-center gap-3 w-56 ">
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
          <div className="bg-white rounded-lg basis-9/12 p-5 ">
            {/* <div className="bg-[url(https://i.ibb.co/sCr6jMM/Chart.png)] bg-contain bg-no-repeat bg-center h-[400px]" /> */}
            <div className="flex justify-between mb-7">
              <hgroup className="flex gap-1 items-center">
                <h3 className="font-semibold">Sales Revenue</h3>
                <span>(N1,303,030)</span>
              </hgroup>

              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 border">13, Feb 2024</button>
                <p>to</p>
                <button className="rounded-lg p-2 border">14, Feb 2024</button>
              </div>
            </div>
            <BarChart
              data={chartDataDemo}
              index="date"
              categories={["first half", "second half"]}
              colors={["blue"]}
              valueFormatter={dataFormatter}
              yAxisWidth={48}
              onValueChange={(v) => console.log(v)}
              showLegend={false}
            />
          </div>
          <div className="bg-white rounded-lg basis-3/12 p-5">
            {/* <div className="bg-[url(https://i.ibb.co/km0dbXQ/today-booking.png)] bg-contain bg-no-repeat bg-center h-[400px]" /> */}
            <div className="rounded-lg border h-full p-5 space-y-5">
              <h3 className="font-semibold">Today Booking</h3>
              <div className="relative">
                <div className="arc" />
                <div className="w-fit absolute top-24 left-1/2 right-1/2 -translate-x-1/2 space-y-3">
                  <p className="text-center flex flex-col">
                    <b className=" text-3xl font-semibold">120</b>
                    <span className="text-[#7F7F7F] text-base">
                      Total Bookings
                    </span>
                  </p>
                  <p className=" !mt-16 text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-blue-500 before:mr-3 text-nowrap">
                    0 Offline Booking
                  </p>
                  <p className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-green-500 before:mr-3 text-nowrap">
                    120 Online Booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-lg p-5 mb-5 ">
          <div className="border rounded-lg ">
            <div className="flex items-center gap-5 mb-5 p-5 border-b">
              <h3 className="font-semibold">Latest Booking List</h3>
              <div className="rounded-lg border px-4 p-2 cursor-pointer flex items-center gap-2 ml-auto">
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
