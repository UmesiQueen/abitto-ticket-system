import React from "react";
import { Helmet } from "react-helmet-async";
// import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ReactPaginate from "react-paginate";
// import { formatValue } from "react-currency-input-field";
// import { capitalize } from "lodash";
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
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { CaretIcon, CalendarIcon } from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import SelectField from "@/components/custom/SelectField";
import { BookingCTX } from "@/contexts/BookingContext";

const JourneyList = () => {
  return (
    <>
      <Helmet>
        <title>Jounery List | Admin</title>
      </Helmet>
      <h1 className=" text-lg font-semibold">Journey List</h1>
      <SearchForm />
      <div>
        <h2 className="mt-14 mb-5 font-semibold">Recent Trips</h2>
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
    id: "001",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "12 May,2024",
    time: "08:00 AM",
    booked: "18",
    bookedSeats: [],
  },
  {
    id: "001",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "24 June,2024",
    time: "12:45 PM",
    booked: "9",
    bookedSeats: [],
  },
  {
    id: "001",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "12 May,2024",
    time: "08:00 AM",
    booked: "18",
    bookedSeats: [],
  },
  {
    id: "001",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "24 June,2024",
    time: "12:45 PM",
    booked: "9",
    bookedSeats: [],
  },
  {
    id: "001",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "12 May,2024",
    time: "08:00 AM",
    booked: "18",
    bookedSeats: [],
  },
  {
    id: "001",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "24 June,2024",
    time: "12:45 PM",
    booked: "9",
    bookedSeats: [],
  },
  {
    id: "001",
    departure: "Calabar Terminal",
    arrival: "Uyo Terminal",
    date: "12 May,2024",
    time: "08:00 AM",
    booked: "18",
    bookedSeats: [],
  },
  {
    id: "001",
    departure: "Uyo Terminal",
    arrival: "Calabar Terminal",
    date: "24 June,2024",
    time: "12:45 PM",
    booked: "9",
    bookedSeats: [],
  },
];

const JourneyTable = () => {
  // const navigate = useNavigate();
  const { setCurrentPageIndex, currentPageIndex } = React.useContext(GlobalCTX);
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
      accessorKey: "id",
      header: "S/N",
      cell: ({ row }) => row.getValue("id"),
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
      id: "action",
      header: <div className="text-center">Action</div>,
      cell: ({ row }) => (
        <Button
          onClick={() => console.log(row.original.id)}
          className="px-3 h-8 !text-xs mx-auto"
          text="View"
        />
      ),
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
                <TableRow key={row.id} className="h-[65px]">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
          {table.getFilteredRowModel().rows.length} Total scheduled trips.
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
      className="flex gap-5 justify-between items-start bg-white rounded-lg my-8 p-6"
    >
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
                      <span className="text-xs text-[#9fa6b2]">dd/mm/yyyy</span>
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
      <Button
        text="Search"
        type="submit"
        loading={loading}
        className="w-96 py-6 self-end"
      />
    </form>
  );
};
