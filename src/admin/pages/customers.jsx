import React from "react";
import { Helmet } from "react-helmet-async";
import { CaretIcon } from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { capitalize } from "lodash";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { formatValue } from "react-currency-input-field";
import { v4 as uuid } from "uuid";
import { BookingCTX } from "@/contexts/BookingContext";
import { toast } from "sonner";

const Customers = () => {
  const navigate = useNavigate();
  const { setCurrentPageIndex, currentPageIndex } = React.useContext(GlobalCTX);
  const { customersData, setCustomersData } = React.useContext(BookingCTX);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7,
  });

  React.useEffect(() => {
    axios
      .get("https://abitto-api.onrender.com/api/booking/customerdetails")
      .then((res) => {
        if (res.status == 200) {
          const response = res.data.customerDetails;
          const customersData_ = Object.entries(response).map(
            ([email, data]) => {
              const {
                details: { first_name, last_name, phone_number },
                bookings,
              } = data;

              const total_spent = bookings
                .map((booking) => Number(booking.totalTicketCost ?? 0))
                .reduce((a, c) => a + c, 0);

              return {
                _id: `CUS_${uuid().slice(0, 10)}`,
                email,
                first_name,
                last_name,
                phone_number,
                total_spent,
                total_trips: bookings.length,
                bookings,
              };
            }
          );
          setCustomersData(customersData_);
        }
      })
      .catch((err) => {
        console.error(err, "Error occurred while fetching customers data.");
        toast.error(
          "Error occurred while fetching customers data. Refresh page."
        );
      });
  }, []);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => Number(row.id) + 1,
    },
    {
      accessorKey: "full_name",
      header: "Full name",
      cell: ({ row }) => (
        <p className="text-[15px] font-semibold capitalize">
          {capitalize(`${row.original.first_name} ${row.original.last_name}`)}
        </p>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <p className="lowercase">{row.getValue("email")}</p>,
    },
    {
      accessorKey: "phone_number",
      header: "Phone number",
      cell: ({ row }) => row.getValue("phone_number"),
    },
    {
      accessorKey: "total_trips",
      header: "Total trips",
      cell: ({ row }) => row.getValue("total_trips"),
    },
    {
      accessorKey: "total_spent",
      header: "Total spent",
      cell: ({ row }) =>
        formatValue({
          value: String(row.getValue("total_spent")),
          prefix: "₦",
        }),
    },
    {
      id: "action",
      header: <div className="text-center">Action</div>,
      cell: ({ row }) => (
        <Button
          onClick={() => navigate(row.original._id)}
          className="px-2 h-8 !text-xs mx-auto"
          text="View"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: customersData,
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
    pageCount: Math.ceil(customersData.length / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <>
      <Helmet>
        <title>Customers | Admin</title>
      </Helmet>
      <h1 className="text-base font-semibold mb-5">Customers</h1>
      <div className="bg-white rounded-lg p-2">
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
            {table.getFilteredRowModel().rows.length} result(s).
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
    </>
  );
};

export default Customers;

// export const CustomerLoader = async () => {
//   try {
//     const response = await axios.get(
//       "https://abitto-api.onrender.com/api/booking/customerdetails"
//     );
//     return response.data.customerDetails;
//   } catch (error) {
//     console.error(error, "Error occurred while fetching customers data.");
//     return [];
//   }
// };
