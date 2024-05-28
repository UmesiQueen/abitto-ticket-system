import {
  FilterIcon,
  CloudIcon,
  RadioButtonIcon,
  CaretIcon,
  TickIcon,
  InformationCircleIcon,
  CalendarIcon,
  ClockIcon,
  ChairIcon,
  UsersIcon,
  PrinterIcon,
  Boat2Icon,
} from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  {
    code: "TRX123456",
    date: "12 May, 2024",
    time: "08:00 AM",
    origin: "Marina Terminal",
    destination: "Nwaniba Timber Beach Terminal, Uyo",
    paidWith: "Paystack",
    mode: "Online",
    passenger: 1,
    seatNo: 12,
  },
  {
    code: "TRX123456",
    date: "12 May, 2024",
    time: "08:00 AM",
    origin: "Marina Terminal",
    destination: "Nwaniba Timber Beach Terminal, Uyo",
    paidWith: "Paystack",
    mode: "Offline",
    passenger: 2,
    seatNo: 12,
  },
  {
    code: "TRX123456",
    date: "12 May, 2024",
    time: "08:00 AM",
    origin: "Marina Terminal",
    destination: "Nwaniba Timber Beach Terminal, Uyo",
    paidWith: "Paystack",
    mode: "Online",
    passenger: 1,
    seatNo: 12,
  },
  {
    code: "TRX123456",
    date: "12 May, 2024",
    time: "08:00 AM",
    origin: "Marina Terminal",
    destination: "Nwaniba Timber Beach Terminal, Uyo",
    paidWith: "Paystack",
    mode: "Offline",
    passenger: 2,
    seatNo: 12,
  },
  {
    code: "TRX123456",
    date: "12 May, 2024",
    time: "08:00 AM",
    origin: "Marina Terminal",
    destination: "Nwaniba Timber Beach Terminal, Uyo",
    paidWith: "Paystack",
    mode: "Online",
    passenger: 1,
    seatNo: 12,
  },
  {
    code: "TRX123456",
    date: "12 May, 2024",
    time: "08:00 AM",
    origin: "Marina Terminal",
    destination: "Nwaniba Timber Beach Terminal, Uyo",
    paidWith: "Paystack",
    mode: "Offline",
    passenger: 2,
    seatNo: 12,
  },
  {
    code: "TRX123456",
    date: "12 May, 2024",
    time: "08:00 AM",
    origin: "Marina Terminal",
    destination: "Nwaniba Timber Beach Terminal, Uyo",
    paidWith: "Paystack",
    mode: "Online",
    passenger: 1,
    seatNo: 12,
  },
];

const BookingDetails = () => {
  return (
    <div>
      <div className="flex items-center gap-5 mb-5 ">
        <h1 className="text-base  font-semibold">Booking Details</h1>
        <div className="rounded-lg border px-4 p-2 cursor-pointer flex items-center gap-2 ml-auto">
          <span>
            <FilterIcon />
          </span>
          Sort by
        </div>
        <div className="rounded-lg cursor-pointer bg-blue-500 p-2">
          <CloudIcon />
        </div>
      </div>
      <div className="bg-white rounded-lg p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Paid With</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Passenger</TableHead>
              <TableHead>Seat No.</TableHead>
              <TableHead>
                <RadioButtonIcon />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.code}>
                <TableCell>{user.code}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell>{user.time}</TableCell>
                <TableCell>{user.origin}</TableCell>
                <TableCell>{user.destination}</TableCell>
                <TableCell>{user.paidWith}</TableCell>
                <TableCell>{user.mode}</TableCell>
                <TableCell>{user.passenger}</TableCell>
                <TableCell>{user.seatNo}</TableCell>
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

      <div className="mt-5 flex gap-5">
        <div className="bg-white rounded-lg overflow-hidden basis-8/12">
          <div className="bg-blue-50 flex  gap-3 p-5 ">
            <div className="bg-white rounded-lg p-2 ">
              <TickIcon />
            </div>
            <div>
              <h2 className="text-blue-500 text-sm font-semibold">
                Booking Confirmed!
              </h2>
              <p className="text-[10px]">
                Great news! The ferry trip has been successfully confirmed from
                our salespoint.
              </p>
            </div>
          </div>
          <div className="p-5 pb-20 space-y-10">
            <ul className="*:flex *:flex-col *:gap-1 flex gap-16">
              <li>
                <p className="text-xs text-[#7F7F7F] ">Booking ID</p>
                <p className="text-base font-semibold">#00001234</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Customer name</p>
                <p className="text-base font-semibold">Surname name</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Email</p>
                <p className="text-base font-semibold">mail@gmail.com</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Seat</p>
                <p className="text-base font-semibold">4</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Booking Status</p>
                <p className="text-base font-semibold">Active</p>
              </li>
            </ul>

            <ul className="*:flex *:flex-col *:gap-1 flex gap-16">
              <li>
                <p className="text-xs text-[#7F7F7F] ">Ticket Type</p>
                <p className="text-base font-semibold">One-way</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">No. Passenger</p>
                <p className="text-base font-semibold">1</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">From</p>
                <p className="text-base font-semibold">
                  Nwaniba Timber Beach Terminal, Uyo
                </p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">To</p>
                <p className="text-base font-semibold">Marina Terminal</p>
              </li>
            </ul>

            <ul className="*:flex *:flex-col *:gap-1 flex gap-16">
              <li>
                <p className="text-xs text-[#7F7F7F] ">Payment Medium</p>
                <p className="text-base font-semibold">Online</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Paid with</p>
                <p className="text-base font-semibold">Paystack</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Ticket ID</p>
                <p className="text-base font-semibold">#00001234</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Transaction Reference</p>
                <p className="text-base font-semibold">TRX123456</p>
              </li>
            </ul>

            <ul className="*:flex *:flex-col *:gap-1 flex gap-16">
              <li>
                <p className="text-xs text-[#7F7F7F] ">Ticket Price</p>
                <p className="text-base font-semibold">N16,000</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Ride Insurance</p>
                <p className="text-base font-semibold">N2010</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Date</p>
                <p className="text-base font-semibold">May 16, 2024</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Time</p>
                <p className="text-base font-semibold">08:00 PM</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg basis-4/12 p-5 flex flex-col gap-6">
          <div>
            <h3 className="text-blue-500 font-semibold  text-base md:text-xl ">
              Abiito Ferry Terminal
            </h3>
            <p className="text-[#8E98A8] text-sm inline-flex items-center gap-1">
              Non-refundable <InformationCircleIcon />
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-1">Departure Details</h5>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
              <p>
                <CalendarIcon />
                29 Apr, 2024
              </p>
              <p>
                <ClockIcon />
                03:00 PM
              </p>
              <p>
                <ChairIcon /> Seats: B2
              </p>
              <p>
                <UsersIcon /> 1 passenger(s)
              </p>
              <p>
                <Boat2Icon />
                Round Trip
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Terminals</h4>
            <p className="text-xs">
              Marina Terminal, Calabar - Nwaniba Timber Beach Terminal, Uyo
            </p>
          </div>

          <p className="font-medium text-xs">Booking ID: TRX123456</p>

          <div className="border-y-2 border-dashed py-2">
            <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
              <tbody>
                <tr>
                  <td className="text-xs text-[#444444]">Ride Insurance</td>
                  <td className="text-xs text-[#444444]">₦0</td>
                </tr>
                <tr>
                  <td className="text-xs text-[#444444]">Ticket Price</td>
                  <td className="text-xs text-[#444444]">₦1,000</td>
                </tr>
                <tr>
                  <td className="font-medium text-base">Ticket:</td>
                  <td className="font-medium text-base">₦ 000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className=" bg-blue-500 w-56 py-3 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center gap-2 mx-auto rounded-lg ">
            <PrinterIcon />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
