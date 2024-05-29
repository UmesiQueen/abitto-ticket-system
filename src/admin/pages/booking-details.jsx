import {
  FilterIcon,
  CloudIcon,
  CaretIcon,
  TickIcon,
  InformationCircleIcon,
  CalendarIcon,
  ClockIcon,
  ChairIcon,
  UsersIcon,
  PrinterIcon,
  Boat2Icon,
  CircleArrowLeftIcon,
} from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { format } from "date-fns";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, humanize } from "@/lib/utils";
import { formatValue } from "react-currency-input-field";
import { GlobalCTX } from "@/context/GlobalContext";

const columns = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.ticket_id}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{format(row.original.departure_date, "PP")}</div>,
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <div>{row.original.departure_time}</div>,
  },
  {
    accessorKey: "origin",
    header: "Origin",
    cell: ({ row }) => <div>{row.original.travel_from}</div>,
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => <div>{row.original.travel_to}</div>,
  },
  {
    accessorKey: "paid with",
    header: "Paid With",
    cell: ({ row }) => <div>{row.original?.medium ?? "Paystack"}</div>,
  },
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => <div>{row.original?.mode ?? "Online"}</div>,
  },
  {
    accessorKey: "passenger",
    header: <div className="text-center">Passenger(s)</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {Number(row.original.adults_number) +
          Number(row.original.children_number)}
      </div>
    ),
  },
  {
    accessorKey: "seat no",
    header: "Seat No.",
    cell: ({ row }) => <div>{humanize(row.original.seat_no)}</div>,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

const BookingDetails = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const { dataQuery, setDataQuery } = React.useContext(GlobalCTX);

  const table = useReactTable({
    data: dataQuery,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    pageCount: Math.ceil(dataQuery.length / 7),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const pageNumbers = Array.from({ length: table.getPageCount() }, (_, i) => i);

  React.useEffect(() => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    axios
      .get(`${BASE_URL}/booking/getbooking`)
      .then((res) => {
        setDataQuery(res.data.bookings);
      })
      .catch((err) => {
        console.error(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex items-center gap-5 mb-5 ">
        <h1 className="text-base font-semibold">Booking Details</h1>
        <div className="rounded-lg border ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-5">
                <span className="mr-1">
                  <FilterIcon />
                </span>
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-lg cursor-pointer bg-blue-500 p-2">
          <CloudIcon />
        </div>
      </div>
      <div className="bg-white rounded-lg px-4 py-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    navigate(row.original._id);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center gap-8  p-4">
          <div className="font-medium text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex gap-2 items-center">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="rotate-180">
                <CaretIcon />
              </span>
            </Button>

            {pageNumbers.map((pageIndex) => (
              <Button
                key={pageIndex}
                size="sm"
                variant="ghost"
                className={cn(
                  "rounded-lg text-xs font-normal w-7 h-8 inline-flex items-center justify-center transition duration-100 ease-in-out",
                  {
                    "bg-blue-500 text-white":
                      pagination.pageIndex === pageIndex,
                  }
                )}
                onClick={() => {
                  table.setPageIndex(pageIndex);
                }}
              >
                {pageIndex + 1}
              </Button>
            ))}

            {/* Next Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <CaretIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

export const CustomerDetails = () => {
  const navigate = useNavigate();
  const { bookingID } = useParams();
  const { dataQuery } = React.useContext(GlobalCTX);

  const currentUser = dataQuery.filter((data) => data._id === bookingID)[0];
  const passenger =
    Number(currentUser.children_number) + Number(currentUser.adults_number);

  return (
    <div>
      <div className="flex gap-1 items-center mb-5 py-2">
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          <CircleArrowLeftIcon />
        </button>
        <h1 className="text-base font-semibold">Booking Details</h1>
      </div>
      <div className="flex gap-5">
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
                <p className="text-xs text-[#7F7F7F]">Booking ID</p>
                <p className="text-base font-semibold">
                  #{currentUser.ticket_id}
                </p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Customer name</p>
                <p className="text-base font-semibold">{`${currentUser.first_name} ${currentUser.surname}`}</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Email</p>
                <p className="text-base font-semibold">{currentUser.email}</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Seat</p>
                <p className="text-base font-semibold">
                  {humanize(currentUser.seat_no)}
                </p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Booking Status</p>
                <p className="text-base font-semibold">Active</p>
              </li>
            </ul>
            <ul className="*:flex *:flex-col *:gap-1 flex gap-16">
              <li>
                <p className="text-xs text-[#7F7F7F] ">Ticket Type</p>
                <p className="text-base font-semibold">
                  {currentUser.trip_type}
                </p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">No. Passenger</p>
                <p className="text-base font-semibold">{passenger}</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">From</p>
                <p className="text-base font-semibold">
                  {currentUser.travel_from}
                </p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">To</p>
                <p className="text-base font-semibold">
                  {currentUser.travel_to}
                </p>
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
                <p className="text-base font-semibold">
                  #{currentUser.ticket_id}
                </p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Transaction Reference</p>
                <p className="text-base font-semibold">TRX123456</p>
              </li>
            </ul>
            <ul className="*:flex *:flex-col *:gap-1 flex gap-16">
              <li>
                <p className="text-xs text-[#7F7F7F] ">Ticket Price</p>
                <p className="text-base font-semibold">
                  N
                  {formatValue({
                    value: String(
                      Number(passenger) * currentUser.trip_type ===
                        "One-Way Trip"
                        ? 8500
                        : 17000
                    ),
                  })}
                </p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Ride Insurance</p>
                <p className="text-base font-semibold">N0</p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Date</p>
                <p className="text-base font-semibold">
                  {format(currentUser.departure_date, "PP")}
                </p>
              </li>
              <li>
                <p className="text-xs text-[#7F7F7F]">Time</p>
                <p className="text-base font-semibold">
                  {currentUser.departure_time}
                </p>
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
                {format(currentUser.departure_date, "PP")}
              </p>
              <p>
                <ClockIcon />
                {currentUser.departure_time}
              </p>
              <p>
                <ChairIcon /> Seats: {humanize(currentUser.seat_no)}
              </p>
              <p>
                <UsersIcon /> {passenger} passenger(s)
              </p>
              <p>
                <Boat2Icon />
                {currentUser.trip_type}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Terminals</h4>
            <p className="text-xs">
              {currentUser.travel_from} - {currentUser.travel_to}
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
                  <td className="text-xs text-[#444444]">₦8,500</td>
                </tr>
                <tr>
                  <td className="font-medium text-base">Ticket:</td>
                  <td className="font-medium text-base">
                    ₦
                    {formatValue({
                      value: String(
                        Number(passenger) * currentUser.trip_type ===
                          "One-Way Trip"
                          ? 8500
                          : 17000
                      ),
                    })}
                  </td>
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
