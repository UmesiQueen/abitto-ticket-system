import {
  FerryBoatIcon,
  UserGroupIcon,
  WalletIcon,
  TicketIcon,
  FilterIcon,
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
import { cn, getTicketCost } from "@/lib/utils";
import { BarChart } from "@tremor/react";
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
import { format } from "date-fns";
import React from "react";
import { GlobalCTX } from "@/context/GlobalContext";

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
    <div>
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
        <LatestBookingsTable />
      </div>
    </div>
  );
};

export default Dashboard;

const columns = [
  {
    accessorKey: "code",
    header: "Booking ID",
    cell: ({ row }) => (
      <div className="capitalize">#{row.original.ticket_id}</div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="text-lg">{`${row.original.first_name} ${row.original.surname}`}</p>{" "}
        <p className="italic">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div>
        ₦{getTicketCost(row.original.adults_number, row.original.trip_type)}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.original.trip_type}</div>,
  },
  {
    accessorKey: "medium",
    header: "Medium",
    cell: ({ row }) => <div>{row.original?.mode ?? "Online"}</div>,
  },
  {
    accessorKey: "paid with",
    header: "Paid With",
    cell: ({ row }) => <div>{row.original?.medium ?? "Paystack"}</div>,
  },
  {
    accessorKey: "status",
    header: <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const {
        original: { status = "Success" },
      } = row;

      return (
        <div
          className={cn(
            "rounded-lg w-20 mx-auto py-1 text-[10px] text-center",
            {
              "text-green-500 bg-green-100": status === "Success",
              "text-[#E78913] bg-[#F8DAB6]": status === "Pending",
              "text-[#F00000] bg-[#FAB0B0]": status === "Canceled",
            }
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "date_time",
    header: "Date & Time",
    cell: ({ row }) => (
      <div>{`${format(row.original.departure_date, "PP")} ${
        row.original.departure_time
      }`}</div>
    ),
  },
];

const LatestBookingsTable = () => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { dataQuery } = React.useContext(GlobalCTX);

  const table = useReactTable({
    data: dataQuery.slice(0, 3),
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="bg-white rounded-lg p-5 mb-5 ">
      <div className="border rounded-lg ">
        <div className="flex items-center gap-5 mb-5 p-5 border-b">
          <h3 className="font-semibold">Latest Booking List</h3>
          <div className="rounded-lg border ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-5" disabled>
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
        </div>
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
      </div>
    </div>
  );
};
