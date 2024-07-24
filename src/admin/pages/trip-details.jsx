/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLoaderData } from "react-router-dom";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { capitalize, truncate } from "lodash";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import { Button as IconButton } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { cn } from "@/lib/utils";
import {
  DeleteIcon,
  PrinterIcon,
  CircleArrowLeftIcon,
  CaretIcon,
} from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import Logo from "@/assets/logo.svg";
import RescheduleEditModal from "@/components/modals/reschedule.edit";
import ConfirmationModal from "@/components/modals/confirmation";
import { useScheduleTrip } from "@/hooks/useScheduleTrip";
import axios from "axios";

const TripDetails = () => {
  const { mountPortalModal, setLoading } = React.useContext(GlobalCTX);
  const { tripDetails, setTripDetails } = React.useContext(BookingCTX);
  const navigate = useNavigate();
  const selectedTrip = useLoaderData();
  const { cancelRequest } = useScheduleTrip();

  React.useEffect(() => {
    setLoading(false);
    if (selectedTrip) setTripDetails(selectedTrip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip]);

  const getTotalBooked = () => {
    let totalSeats = 29;
    const totalBooked = totalSeats - selectedTrip?.available_seats.length;
    return totalBooked;
  };

  const handleCancel = () => {
    mountPortalModal(
      <ConfirmationModal
        props={{
          header: "Are you sure you want to delete Journey List?",
          handleRequest: () => {
            cancelRequest({
              ...tripDetails,
              trip_status: "Canceled",
            });
          },
          severity: "delete",
        }}
      />
    );
  };

  return (
    <>
      <Helmet>
        <title>Journey Details | Admin</title>
      </Helmet>

      <section>
        <div className="flex gap-1 items-center mb-8 ">
          <IconButton
            size="icon"
            variant="ghost"
            onClick={() => navigate("/admin/journey-list")}
          >
            <CircleArrowLeftIcon />
          </IconButton>{" "}
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
                {selectedTrip?.departure} - {selectedTrip?.arrival}
              </p>
              <p>
                <strong>Date:</strong>
                {format(selectedTrip?.date, "PPPP")}
              </p>
              <p>
                <strong>Time:</strong>
                {selectedTrip?.time}
              </p>
              <p>
                <strong>Trip Status:</strong>
                <span
                  className={cn("font-semibold", {
                    "text-green-700": selectedTrip?.trip_status === "Completed",
                    "text-[#E78913] ": selectedTrip?.trip_status === "Upcoming",
                    "text-[#F00000] ": selectedTrip?.trip_status === "Canceled",
                  })}
                >
                  {selectedTrip?.trip_status}
                </span>
              </p>
              <p>
                <strong>Total Booked:</strong>
                {getTotalBooked()}
              </p>
            </li>
            <li className="basis-3/12 self-end ml-auto flex justify-end gap-2">
              <Button
                text="Re-schedule Trip"
                variant="outline"
                className="text-nowrap h-10"
                onClick={() => {
                  mountPortalModal(<RescheduleEditModal />);
                }}
              />
              <IconButton
                variant="destructive"
                size="icon"
                onClick={handleCancel}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton size="icon" className="bg-blue-500">
                <PrinterIcon />
              </IconButton>
            </li>
          </ul>
          <div
            className={cn("border-t-4 mt-5", {
              "border-green-700": selectedTrip?.trip_status === "Completed",
              "border-[#E78913] ": selectedTrip?.trip_status === "Upcoming",
              "border-[#F00000] ": selectedTrip?.trip_status === "Canceled",
            })}
          />
        </div>
        <TripDetailsTable />
      </section>
    </>
  );
};

export default TripDetails;

const TripDetailsTable = () => {
  const navigate = useNavigate();
  const { bookingQuery, tripDetails, setCurrentPageIndex, currentPageIndex } =
    React.useContext(BookingCTX);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const [currentDataQuery, setCurrentDataQuery] = React.useState([]);

  React.useEffect(() => {
    if (tripDetails) {
      const sortedQuery = bookingQuery.filter(
        (booking) => booking.departure_trip_code == tripDetails.trip_code
      );
      setCurrentDataQuery(sortedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripDetails]);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="uppercase">
          #
          {truncate(row.original.ticket_id, {
            length: 6,
          })}
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="text-[15px] font-semibold capitalize">
            {capitalize(
              `${row.original.passenger1_first_name} ${row.original.passenger1_last_name}`
            )}
          </p>
          <p className="italic  lowercase">{row.original.passenger1_email}</p>
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
      header: <div className="text-center">Medium</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original?.medium}</div>
      ),
    },
    {
      accessorKey: "booked_by",
      header: "Booked By",
      cell: ({ row }) => <div>{row.original.booked_by}</div>,
    },
    {
      accessorKey: "passenger",
      header: <div className="text-center">Passengers</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.total_passengers}</div>
      ),
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
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div>
          ₦
          {formatValue({
            value: String(row.original.total_ticket_cost ?? 0),
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
          className="px-2 h-8 !text-xs"
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

  const table = useReactTable({
    data: currentDataQuery,
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
    pageCount: Math.ceil(currentDataQuery.length / pagination.pageSize),
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

  return (
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

      {/* Pagination */}
      <div className="flex items-center gap-8  p-4">
        <div className="font-medium text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <ReactPaginate
          breakLabel={<PaginationEllipsis />}
          nextLabel={
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <CaretIcon />
            </IconButton>
          }
          onPageChange={(val) => {
            table.setPageIndex(val.selected);
            setCurrentPageIndex(val.selected);
          }}
          initialPage={currentPageIndex}
          pageRangeDisplayed={3}
          pageCount={table.getPageCount()}
          previousLabel={
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="rotate-180">
                <CaretIcon />
              </span>
            </IconButton>
          }
          renderOnZeroPageCount={null}
          className="flex gap-2 items-center text-xs font-normal [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:min-w-7 [&_a]:h-8 [&_a]:rounded-lg *:text-center *:[&_.selected]:bg-blue-500  *:[&_.selected]:text-white [&_.disabled]:pointer-events-none "
        />
      </div>
    </div>
  );
};

//  Post: query trip detail by trip_code
export const TripDetailsLoader = async ({ params }) => {
  try {
    const response = await axios.post(
      "https://abitto-api.onrender.com/api/ticket/tripcode",
      { trip_code: params.tripCode }
    );
    return response.data.ticket;
  } catch (err) {
    console.error(err, "Error occurred while retrieving trip details");
    return null;
  }
};
