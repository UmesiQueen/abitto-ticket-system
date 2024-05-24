import {
  FilterIcon,
  CaretIcon,
  CloudIcon,
  RadioButtonIcon,
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
];

const Payments = () => {
  return (
    <div>
      <h2 className=" font-semibold text-sm ">Payments history</h2>
      <div className="bg-white rounded-lg p-5 mb-5 mt-8 ">
        <div className="flex items-center gap-5 mb-5 py-35">
          <div className="bg-blue-50 rounded-lg p-2">
            <ul className="flex gap-1 *:py-1 *:px-2 *:rounded-lg [&_.active]:bg-blue-500 [&_.active]:text-white">
              <li className="active">All</li>
              <li>Online</li>
              <li>Offline</li>
            </ul>
          </div>
          <div className="rounded-lg border px-4 p-2 cursor-pointer flex items-center gap-2 ml-auto">
            <FilterIcon />
            Filter
          </div>
          <div className="rounded-lg cursor-pointer bg-blue-500 p-2">
            <CloudIcon />
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
              <TableHead>
                <RadioButtonIcon />
              </TableHead>
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
                      "text-green-500 bg-green-100": user.status === "Success",
                      "text-[#E78913] bg-[#F8DAB6]": user.status === "Pending",
                      "text-[#F00000] bg-[#FAB0B0]": user.status === "Canceled",
                    })}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.dateTime}</TableCell>
                <TableCell>
                  <RadioButtonIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="py-5 flex items-center gap-8 px-5">
          <p className="font-medium text-sm">Showing 1 of 7 of 10 items </p>
          <div className="flex gap-4 text-xs">
            <button className="rotate-180">
              <CaretIcon />
            </button>
            <ul className="flex gap-1 *:py-2 *:px-3 *:rounded-lg [&_.active]:bg-blue-500 [&_.active]:text-white">
              <li className="active">1</li>
              <li>2</li>
              <li>3</li>
              <li>...</li>
              <li>5</li>
            </ul>
            <button>
              <CaretIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
