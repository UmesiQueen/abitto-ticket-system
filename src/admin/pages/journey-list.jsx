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
import { cn } from "@/lib/utils";
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
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { CaretIcon, CalendarIcon } from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import SelectField from "@/components/custom/SelectField";
import { BookingCTX } from "@/contexts/BookingContext";
import { Refresh } from "iconsax-react";

const JourneyList = () => {
  return (
    <>
      <Helmet>
        <title>Journey List | Admin</title>
      </Helmet>
      <h1 className=" text-lg font-semibold">Journey List</h1>
      <SearchForm />
      <JourneyTable />
    </>
  );
};

export default JourneyList;

const SearchForm = () => {
  const searchSchema = yup
    .object()
    .shape({
      departure: yup
        .string()
        .when("arrival", ([arrival], schema) =>
          arrival
            ? schema.notOneOf(
                [yup.ref("arrival")],
                "Departure and arrival cannot be the same."
              )
            : schema
        ),
      arrival: yup.string(),
      date: yup.string(),
    })
    .test(
      "require at least one field",
      function ({ departure, arrival, date }) {
        const a = !!(departure || arrival || date); // At least one must be non-empty

        if (!a) {
          return new yup.ValidationError(
            "At least one of the three fields must be filled.", //Message
            "null",
            "departure", //error name
            "required" //type
          );
        }
        return true;
      }
    );
  const { loading, setLoading, setSearchParams, searchParams } =
    React.useContext(BookingCTX);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(searchSchema),
  });

  React.useEffect(() => {
    if (!Object.keys(searchParams).length) {
      reset({});
    }
  }, [searchParams, reset]);

  const onSubmit = handleSubmit((formData) => {
    setLoading(true);
    setTimeout(() => {
      setSearchParams({
        ...formData,
        ...(formData?.date && {
          date: new Date(addDays(formData.date, 1)).toISOString().split("T")[0],
        }),
      });
      setLoading(false);
    }, 650);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex gap-5 justify-between bg-white rounded-lg my-8 p-6"
    >
      <div className="flex gap-5 w-full ">
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
        className="w-40 py-6  md:mt-7 "
      />
    </form>
  );
};

const journeyListDemo = [
  {
    trip_code: "19404d7",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "Jul 5, 2024",
    time: "10:30 AM",
    booked: "N/A",
    availableSeats: [],
    status: "Upcoming",
  },
  {
    trip_code: "903573d",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "Jul 1, 2024",
    time: "12:30 PM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "410042f0",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "Jul 1, 2024",
    time: "02:00 PM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "0083246s",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "Jul 1, 2024",
    time: "08:30 AM",
    booked: "N/A",
    availableSeats: [],
    status: "Canceled",
  },
  {
    trip_code: "84s9983",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "Jun 30, 2024",
    time: "12:00 PM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "739q03p",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "Jun 30, 2024",
    time: "01:30 PM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "984281e",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "Jun 29, 2024",
    time: "01:30 PM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "730010a",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "Jun 29, 2024",
    time: "12:00 PM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "49492a3",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "Jun 29, 2024",
    time: "09:00 AM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "4982820a",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "Jun 28, 2024",
    time: "09:00 AM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "4927492a",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "Jun 28, 2024",
    time: "11:00 AM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
  {
    trip_code: "842042q",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "Jun 27, 2024",
    time: "11:00 AM",
    booked: "N/A",
    availableSeats: [],
    status: "Completed",
  },
];

const JourneyTable = () => {
  const navigate = useNavigate();
  const { setCurrentPageIndex, currentPageIndex } = React.useContext(GlobalCTX);
  const { setTripSelected, searchParams, setSearchParams } =
    React.useContext(BookingCTX);
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7,
  });
  // set pageIndex on render only if previous location path includes current page path
  React.useEffect(() => {
    table.setPageIndex(currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (searchParams) {
      table.getColumn("departure").setFilterValue(searchParams?.departure);
      table.getColumn("arrival").setFilterValue(searchParams?.arrival);
      table
        .getColumn("date")
        .setFilterValue(searchParams?.date && format(searchParams?.date, "PP"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const columns = [
    {
      accessorKey: "trip_code",
      header: "Trip Code",
      cell: ({ row }) => (
        <p className="uppercase">#{row.getValue("trip_code")}</p>
      ),
    },
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
        let status = row.original.status;
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
              navigate(row.original.trip_code);
            }}
            className="px-3 h-8 !text-xs mx-auto"
            text="View"
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: journeyListDemo,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    pageCount: Math.ceil(journeyListDemo.length / pagination.pageSize),
    state: {
      rowSelection,
      pagination,
    },
  });

  return (
    <div>
      {Object.keys(searchParams).length ? (
        <div className="flex justify-between items-center mt-14 mb-5">
          <div className="inline-flex gap-1">
            <h2 className="font-semibold">Trip search results </h2>
            <p className="divide-x divide-black flex gap-2 [&>*:not(:first-of-type)]:pl-2">
              ({" "}
              {searchParams?.departure && (
                <span>{searchParams.departure} </span>
              )}
              {searchParams?.arrival && <span>{searchParams.arrival}</span>}
              {searchParams?.date && <span>{searchParams.date}</span>})
            </p>
          </div>

          <ButtonUI
            className="inline-flex gap-1 ml-5"
            onClick={() => {
              table.resetColumnFilters(true);
              setSearchParams({});
            }}
          >
            <Refresh /> Reset
          </ButtonUI>
        </div>
      ) : (
        <h2 className="font-semibold mt-14 mb-5">Recent Scheduled Trips</h2>
      )}
      <div className="bg-white rounded-lg p-5">
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
                <TableRow key={row.id} className="h-[65px]">
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

        <div className="flex items-center gap-8  p-4">
          <p className="font-medium text-sm">
            {table.getFilteredRowModel().rows.length} Trip results.
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
    </div>
  );
};
