import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { addDays, format } from "date-fns";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ReactPaginate from "react-paginate";
import { v4 as uuid } from "uuid";
import { formatValue } from "react-currency-input-field";
import { capitalize } from "lodash";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import { PaginationEllipsis } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import {
  CaretIcon,
  CalendarIcon,
  DeleteIcon,
  PrinterIcon,
  CircleArrowLeftIcon,
} from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import SelectField from "@/components/custom/SelectField";
import { BookingCTX } from "@/contexts/BookingContext";
import Logo from "@/assets/logo.svg";

const JourneyList = () => {
  return (
    <>
      <Helmet>
        <title>Jounery List | Admin</title>
      </Helmet>
      <h1 className=" text-lg font-semibold">Journey List</h1>
      <SearchForm />
      <div>
        <h2 className="mt-14 mb-5 font-semibold">Recent Scheduled Trips</h2>
        <div className="bg-white rounded-lg p-5">
          <JourneyTable />
        </div>
      </div>
    </>
  );
};

export default JourneyList;

const journeyList = [
  {
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "July 5, 2024",
    time: "10:30 AM",
    booked: "18",
    bookedSeats: [],
    status: "Upcoming",
  },
  {
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "July 1, 2024",
    time: "12:30 PM",
    booked: "18",
    bookedSeats: [],
    status: "Completed",
  },
  {
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "July 1, 2024",
    time: "02:00 PM",
    booked: "9",
    bookedSeats: [],
    status: "Completed",
  },
  {
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "July 1, 2024",
    time: "08:30 AM",
    booked: "9",
    bookedSeats: [],
    status: "Canceled",
  },
  {
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "June 30, 2024",
    time: "12:00 PM",
    booked: "18",
    bookedSeats: [],
    status: "Completed",
  },
  {
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "June 30, 2024",
    time: "01:30 PM",
    booked: "9",
    bookedSeats: [],
    status: "Completed",
  },
  {
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "June 29, 2024",
    time: "01:30 PM",
    booked: "9",
    bookedSeats: [],
    status: "Completed",
  },
  {
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "June 29, 2024",
    time: "12:00 PM",
    booked: "18",
    bookedSeats: [],
    status: "Completed",
  },
  {
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "June 29, 2024",
    time: "09:00 AM",
    booked: "9",
    bookedSeats: [],
    status: "Completed",
  },
  {
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "June 28, 2024",
    time: "09:00 AM",
    booked: "9",
    bookedSeats: [],
    status: "Completed",
  },

  {
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "June 28, 2024",
    time: "11:00 AM",
    booked: "18",
    bookedSeats: [],
    status: "Completed",
  },
  {
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "June 27, 2024",
    time: "11:00 AM",
    booked: "9",
    bookedSeats: [],
    status: "Completed",
  },
];

const JourneyTable = () => {
  const navigate = useNavigate();
  const { setCurrentPageIndex, currentPageIndex } = React.useContext(GlobalCTX);
  const { setTripSelected } = React.useContext(BookingCTX);
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const [extraRows, setExtraRows] = React.useState(0);

  React.useEffect(() => {
    table.setPageIndex(currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const pageRowCount = table.getRowModel().rows.length;
    if (pageRowCount) {
      const extraRows = pagination.pageSize - pageRowCount;
      setExtraRows(extraRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex]);

  const columns = [
    {
      accessorKey: "departure",
      header: "Departure",
      cell: ({ row }) => row.getValue("departure"),
    },
    {
      accessorKey: "arrival",
      header: "Arrival",
      cell: ({ row }) => row.getValue("arrival"),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => row.getValue("date"),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => row.getValue("time"),
    },
    {
      accessorKey: "passengers",
      header: <p className="text-center">Passengers</p>,
      cell: ({ row }) => <p className="text-center">{row.original.booked}</p>,
    },
    {
      accessorKey: "status",
      header: <div className="text-center">Trip Status</div>,
      cell: ({ row }) => {
        const {
          original: { status },
        } = row;

        return (
          <div
            className={cn(
              "rounded-lg w-20 mx-auto py-1 text-[10px] text-center",
              {
                "text-green-500 bg-green-100": status === "Completed",
                "text-[#E78913] bg-[#F8DAB6]": status === "Upcoming",
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
      id: "action",
      header: <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const departureDate = addDays(row.original.date, 1);

        return (
          <Button
            onClick={() => {
              setTripSelected({
                departure: row.original.departure,
                arrival: row.original.arrival,
                time: row.original.time,
                date: departureDate.toISOString().split("T")[0],
                status: row.original.status,
              });
              navigate(row.id);
            }}
            className="px-3 h-8 !text-xs mx-auto"
            text="View"
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: journeyList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    pageCount: Math.ceil(journeyList.length / pagination.pageSize),
    state: {
      rowSelection,
      pagination,
    },
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead>Trip Code</TableHead>
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
            <>
              {table.getRowModel().rows.map((row) => {
                const trip_code = uuid();
                return (
                  <TableRow key={row.id} className="h-[65px]">
                    <TableCell className="uppercase">
                      #{trip_code.slice(0, 7)}
                    </TableCell>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <>
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        </>
                      );
                    })}
                  </TableRow>
                );
              })}
              {extraRows
                ? Array.from({ length: extraRows }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell
                        colSpan={columns.length}
                        className="h-[65px]"
                      />
                    </TableRow>
                  ))
                : ""}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-8  p-4">
        <p className="font-medium text-sm">
          {table.getFilteredRowModel().rows.length} Total trip results.
        </p>
        <ReactPaginate
          breakLabel={<PaginationEllipsis />}
          nextLabel={
            <ButtonUI
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <CaretIcon />
            </ButtonUI>
          }
          onPageChange={(val) => {
            table.setPageIndex(val.selected);
            setCurrentPageIndex(val.selected);
          }}
          initialPage={currentPageIndex}
          pageRangeDisplayed={3}
          pageCount={table.getPageCount()}
          previousLabel={
            <ButtonUI
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="rotate-180">
                <CaretIcon />
              </span>
            </ButtonUI>
          }
          renderOnZeroPageCount={null}
          className="flex gap-2 items-center text-xs font-normal [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:min-w-7 [&_a]:h-8 [&_a]:rounded-lg *:text-center *:[&_.selected]:bg-blue-500  *:[&_.selected]:text-white [&_.disabled]:pointer-events-none"
        />
      </div>
    </div>
  );
};

const SearchForm = () => {
  const searchSchema = yup.object().shape({
    departure: yup.string().required("Departure field is required."),
    arrival: yup
      .string()
      .required("Arrival field is required.")
      .when("departure", (departure, schema) =>
        departure[0]
          ? schema.notOneOf(
              [yup.ref("departure")],
              "Departure and arrival terminals cannot be the same."
            )
          : schema
      ),
    date: yup.string().required("Date field is required."),
  });
  const { loading, setLoading } = React.useContext(BookingCTX);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(searchSchema),
  });

  const onSubmit = handleSubmit((formData) => {
    setLoading(true);

    setTimeout(() => {
      console.log(formData);
      toast.info("Search is not functional yet.lol");
      setLoading(false);
    }, 1000);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex gap-5 justify-between bg-white rounded-lg my-8 p-6"
    >
      <div className="flex gap-5 w-full min-h-[100px]">
        <SelectField
          {...register("departure")}
          label="Departure"
          placeholder="Select Departure Terminal"
          options={["Calabar Terminal", "Uyo Terminal"]}
          errors={errors}
        />
        <SelectField
          {...register("arrival")}
          label="Arrival"
          placeholder="Select Arrival Terminal"
          options={["Calabar Terminal", "Uyo Terminal"]}
          errors={errors}
        />
        <div className="flex flex-col w-full">
          <label className="text-xs md:text-sm !w-full flex flex-col ">
            Choose Date
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  icon={<CalendarIcon />}
                  showIcon
                  toggleCalendarOnIconClick={true}
                  closeOnScroll
                  className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                  customInput={
                    <button type="button">
                      {field?.value ? (
                        format(field?.value, "P")
                      ) : (
                        <span className="text-xs text-[#9fa6b2]">
                          dd/mm/yyyy
                        </span>
                      )}
                    </button>
                  }
                />
              )}
            />
          </label>
          {errors?.date && (
            <p className="text-xs pt-2 text-red-700">{errors?.date.message}</p>
          )}
        </div>
      </div>
      <Button
        text="Search"
        type="submit"
        loading={loading}
        className="w-40 py-6 self-center"
      />
    </form>
  );
};

export const TripDetails = () => {
  const navigate = useNavigate();
  const { dataQuery, currentPageIndex, setCurrentPageIndex } =
    React.useContext(GlobalCTX);
  const { tripSelected } = React.useContext(BookingCTX);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const [extraRows, setExtraRows] = React.useState(0);
  const [sortedQuery, setSortedQuery] = React.useState([]);

  const columns = [
    {
      accessorKey: "sn",
      header: "S/N",
      cell: ({ row }) => <p className="text-center">{Number(row.id) + 1}</p>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => (
        <div className="uppercase">#{row.original.ticket_id}</div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="text-[15px] font-semibold capitalize">
            {capitalize(`${row.original.first_name} ${row.original.surname}`)}
          </p>
          <p className="italic  lowercase">{row.original?.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "phone_number",
      header: <p className="">Phone Number</p>,
      cell: ({ row }) => <p className="">{row.original.phone_number}</p>,
    },
    // {
    //   accessorKey: "departure",
    //   header: "Departure",
    //   cell: ({ row }) => row.original.travel_from,
    // },
    {
      accessorKey: "passengers",
      header: <p className="text-center">Passengers</p>,
      cell: ({ row }) => (
        <p className="text-center">{row.original.total_passengers}</p>
      ),
    },
    {
      accessorKey: "medium",
      header: <div className="text-center">Medium</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original?.medium}</div>
      ),
    },
    // {
    //   accessorKey: "status",
    //   header: <div className="text-center">Status</div>,
    //   cell: ({ row }) => {
    //     const {
    //       original: { status = "Success" },
    //     } = row;

    //     return (
    //       <div
    //         className={cn(
    //           "rounded-lg w-20 mx-auto py-1 text-[10px] text-center",
    //           {
    //             "text-green-500 bg-green-100": status === "Success",
    //             "text-[#E78913] bg-[#F8DAB6]": status === "Pending",
    //             "text-[#F00000] bg-[#FAB0B0]": status === "Canceled",
    //           }
    //         )}
    //       >
    //         {status}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div>
          ₦
          {formatValue({
            value: String(row.getValue("amount")),
          })}
        </div>
      ),
    },
    {
      id: "action",
      header: <div className="text-center">Action</div>,
      cell: ({ row }) => (
        <Button
          onClick={() => navigate(`/admin/booking-details/${row.original._id}`)}
          className="px-2 h-8 !text-xs mx-auto"
          text="View"
        />
      ),
      enableSorting: false,
      enableHiding: false,
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
          className="mr-4"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  React.useEffect(() => {
    const sortedData = dataQuery.filter((booking) => {
      const departure_date = new Date(addDays(booking.departure_date, 1))
        .toISOString()
        .split("T")[0];
      return (
        tripSelected.time === booking.departure_time &&
        tripSelected.date === departure_date &&
        booking.status === "Success"
      );
    });
    setSortedQuery(sortedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataQuery]);

  const table = useReactTable({
    data: sortedQuery,
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
    pageCount: Math.ceil(sortedQuery.length / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  React.useEffect(() => {
    table.setPageIndex(currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const pageRowCount = table.getRowModel().rows.length;
    if (pageRowCount) {
      const extraRows = pagination.pageSize - pageRowCount;
      setExtraRows(extraRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex]);

  return (
    <>
      <div>
        <div className="flex gap-1 items-center mb-8 ">
          <ButtonUI size="icon" variant="ghost" onClick={() => navigate(-1)}>
            <CircleArrowLeftIcon />
          </ButtonUI>
          <h1 className="text-lg font-semibold">Journey Details</h1>
        </div>
        <div className="bg-white rounded-lg">
          <ul className="p-5 flex items-center">
            <li className="basis-2/12">
              <img
                src={Logo}
                alt="logo"
                className="w-1/2 mx-auto object-cover"
              />
            </li>
            <li className="basis-6/12 [&_strong]:pr-2 [&_strong]:font-semibold ">
              <p>
                <strong>Route: </strong>
                {tripSelected.departure} - {tripSelected.arrival}
              </p>
              <p>
                <strong>Date:</strong>
                {format(tripSelected.date, "PPPP")}
              </p>
              <p>
                <strong>Time:</strong>
                {tripSelected.time}
              </p>
              <p>
                <strong>Trip Status:</strong>
                <span
                  className={cn("font-semibold", {
                    "text-green-700": tripSelected?.status === "Completed",
                    "text-[#E78913] ": tripSelected?.status === "Upcoming",
                    "text-[#F00000] ": tripSelected?.status === "Canceled",
                  })}
                >
                  {tripSelected?.status ?? "N/A"}
                </span>
              </p>
              <p>
                <strong>Total Booked:</strong>
                {sortedQuery.length}
              </p>
            </li>
            <li className="basis-3/12 flex self-end ml-auto  justify-end gap-2">
              <Button
                text="Re-schedule Trip"
                variant="outline"
                className="px-3"
              />
              <ButtonUI variant="destructive" size="icon">
                <DeleteIcon />
              </ButtonUI>
              <ButtonUI size="icon" className="bg-blue-500">
                <PrinterIcon />
              </ButtonUI>
            </li>
          </ul>
          <div
            className={cn("border-t-4 mt-5", {
              "border-green-700": tripSelected?.status === "Completed",
              "border-[#E78913] ": tripSelected?.status === "Upcoming",
              "border-[#F00000] ": tripSelected?.status === "Canceled",
            })}
          >
            <Table>
              <TableHeader
                className={cn("[&_tr]:h-14 [&_th]:hover:text-gray-500", {
                  "bg-green-50 [&_tr]:hover:bg-green-50":
                    tripSelected?.status === "Completed",
                  "bg-orange-50 [&_tr]:hover:bg-orange-50":
                    tripSelected?.status === "Upcoming",
                  "bg-red-100 [&_tr]:hover:bg-red-100 ":
                    tripSelected?.status === "Canceled",
                })}
              >
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
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="h-[77px]">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {extraRows
                      ? Array.from({ length: extraRows }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell
                              colSpan={columns.length}
                              className="h-[77px]"
                            />
                          </TableRow>
                        ))
                      : ""}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No booking results for this trip.
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
              <ReactPaginate
                breakLabel={<PaginationEllipsis />}
                nextLabel={
                  <ButtonUI
                    variant="ghost"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <CaretIcon />
                  </ButtonUI>
                }
                onPageChange={(val) => {
                  table.setPageIndex(val.selected);
                  setCurrentPageIndex(val.selected);
                }}
                initialPage={currentPageIndex}
                pageRangeDisplayed={3}
                pageCount={table.getPageCount()}
                previousLabel={
                  <ButtonUI
                    variant="ghost"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="rotate-180">
                      <CaretIcon />
                    </span>
                  </ButtonUI>
                }
                renderOnZeroPageCount={null}
                className="flex gap-2 items-center text-xs font-normal [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:min-w-7 [&_a]:h-8 [&_a]:rounded-lg *:text-center *:[&_.selected]:bg-blue-500  *:[&_.selected]:text-white [&_.disabled]:pointer-events-none "
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
