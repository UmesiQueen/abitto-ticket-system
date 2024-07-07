/* eslint-disable react/prop-types */
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
import { formatValue } from "react-currency-input-field";
import { capitalize } from "lodash";
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
import { cn } from "@/lib/utils";
import {
  CaretIcon,
  DeleteIcon,
  PrinterIcon,
  CircleArrowLeftIcon,
} from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import Logo from "@/assets/logo.svg";

const TripDetails = () => {
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

  return (
    <>
      <Helmet>
        <title> Trip Details - trip_code | Admin</title>
      </Helmet>

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

export default TripDetails;
