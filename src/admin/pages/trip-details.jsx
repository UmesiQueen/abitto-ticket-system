/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import {
    useNavigate,
    useLoaderData,
    Navigate,
    useParams,
} from "react-router-dom";
import { format } from "date-fns";
import { capitalize } from "lodash";
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
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { cn, customError } from "@/lib/utils";
import { DeleteIcon, CircleArrowLeftIcon, CaretIcon } from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import Logo from "@/assets/logo.svg";
import RescheduleEditModal from "@/components/modals/reschedule.edit";
import ConfirmationModal from "@/components/modals/confirmation";
import { useScheduleTrip } from "@/hooks/useScheduleTrip";
import axiosInstance from "@/api";
import { formatValue } from "react-currency-input-field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const TripDetails = () => {
    const { mountPortalModal, adminProfile } = React.useContext(GlobalCTX);
    const { tripDetails, setTripDetails, bookingQuery, setCurrentPageIndex, currentPageIndex } =
        React.useContext(BookingCTX);
    const navigate = useNavigate();
    const selectedTrip = useLoaderData();
    const { cancelRequest } = useScheduleTrip();
    const { accountType } = useParams();
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 7,
    });
    const [pageCount, setPageCount] = React.useState(0);
    const [currentDataQuery, setCurrentDataQuery] = React.useState([]);
    const queryClient = useQueryClient();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
        if (tripDetails) {
            const sortedQuery = bookingQuery.filter(
                (booking) =>
                    booking.departure_trip_code === tripDetails.trip_code
            );
            if (sortedQuery) {
                setPageCount(sortedQuery.length / pagination.pageSize);
                setCurrentDataQuery(sortedQuery);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tripDetails, bookingQuery]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
        if (selectedTrip) setTripDetails(selectedTrip);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTrip]);

    const columns = [
        {
            accessorKey: "id",
            header: "ID",
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
                        {capitalize(
                            `${row.original.passenger1_first_name} ${row.original.passenger1_last_name}`
                        )}
                    </p>
                    <p className="italic lowercase">{row.original.passenger1_email}</p>
                </div>
            ),
        },
        {
            accessorKey: "phone_number",
            header: "Phone Number",
            cell: ({ row }) => <div>{row.original.passenger1_phone_number}</div>,
        },
        {
            accessorKey: "payment_status",
            header: <div className="text-center text-nowrap">Payment</div>,
            cell: ({ row }) => {
                const { payment_status } = row.original;
                return (
                    <div
                        className={cn(
                            "rounded-lg w-20 mx-auto py-1 text-[10px] text-center font-semibold",
                            {
                                "text-green-500 bg-green-100": payment_status === "Success",
                                "text-[#E78913] bg-[#F8DAB6]": payment_status === "Pending",
                                "text-[#F00000] bg-[#FAB0B0]": payment_status === "Canceled",
                            }
                        )}
                    >
                        {payment_status}
                    </div>
                );
            },
            enableGlobalFilter: false,
        },
        {
            accessorKey: "passenger",
            header: <div className="text-center">Passengers</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original.total_passengers}</div>
            ),
        },
        {
            accessorKey: "trip_status",
            header: <div className="text-center">Trip Status</div>,
            cell: ({ row }) => {
                const { trip_status } = row.original;
                return (
                    <div
                        className={cn(
                            " rounded-lg w-20 mx-auto py-1 text-[10px] px-2 text-center font-semibold",
                            {
                                "text-green-500 bg-green-100": trip_status === "Completed",
                                "text-[#E78913] bg-[#F8DAB6]": trip_status === "Upcoming",
                                "text-[#F00000] bg-[#FAB0B0]": trip_status === "Canceled",
                                "text-black bg-slate-500/50 ": trip_status === "Rescheduled",
                                "text-purple-900 bg-purple-300/30 ": trip_status === "Missed",
                            }
                        )}
                    >
                        {trip_status}
                    </div>
                );
            },
            enableGlobalFilter: false,
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
        onPaginationChange: setPagination,
        pageCount,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
        },
    });

    const getTotalPassengers = () => {
        if (currentDataQuery.length)
            return table.getFilteredRowModel().rows
                .map(({ original }) => original.total_passengers)
                .reduce((a, c) => a + c, 0);
        return 0;
    };

    const handleCancel = () => {
        mountPortalModal(
            <ConfirmationModal
                props={{
                    header: "Delete journey list",
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
        setPageCount(
            Math.ceil(table.getFilteredRowModel().rows.length / pagination.pageSize)
        );
        setCurrentPageIndex((prev) => ({
            ...prev,
            tripDetails: 0,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnFilters]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
        table.setPageIndex(currentPageIndex.tripDetails);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!selectedTrip?.trip_code) return <Navigate to={`/backend/${adminProfile.account_type}/journey-list`} />;

    return (
        <>
            <Helmet>
                <title>Journey Details | Admin</title>
            </Helmet>

            <section >
                <div
                    className="flex gap-1 items-center mb-8"
                >
                    <ButtonUI
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                            navigate(`/backend/${adminProfile.account_type}/journey-list`)
                        }
                    >
                        <CircleArrowLeftIcon />
                    </ButtonUI>
                    <h1 className="text-lg font-semibold ">Journey Details</h1>
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
                        <li className="basis-6/12 [&_strong]:pr-2 [&_strong]:font-semibold">
                            <hgroup className="flex gap-1">
                                <h2 className="font-bold uppercase">Abitto Ferry</h2>
                                <p>({selectedTrip?.trip_code})</p>
                            </hgroup>
                            <p>
                                <strong>Route: </strong>
                                {selectedTrip?.departure} - {selectedTrip?.arrival}
                            </p>
                            <p>
                                <strong>Date:</strong>
                                {format(selectedTrip?.date, "PPPP")} , {selectedTrip?.time}
                            </p>
                            <p>
                                <strong>Capacity:</strong>
                                {selectedTrip?.trip_capacity}
                            </p>
                            <p>
                                <strong>Ticket Cost:</strong>
                                {formatValue({
                                    value: String(selectedTrip?.ticket_cost),
                                    prefix: "₦",
                                })}
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
                                <strong>{table.getColumn("payment_status")?.getFilterValue() ?? "All Passengers"}:</strong>
                                {getTotalPassengers()}
                            </p>
                        </li>
                        <li className="basis-3/12 self-end ml-auto flex justify-end gap-2">
                            {["dev", "super-admin"].includes(accountType) &&
                                selectedTrip?.trip_status === "Upcoming" && (
                                    <>
                                        <Button
                                            text="Edit Journey Details"
                                            variant="outline"
                                            className="text-nowrap h-10"
                                            onClick={() => {
                                                mountPortalModal(<RescheduleEditModal />);
                                            }}
                                        />
                                        <ButtonUI
                                            variant="destructive"
                                            size="icon"
                                            onClick={handleCancel}
                                        >
                                            <DeleteIcon />
                                        </ButtonUI>
                                    </>
                                )}
                            <Button
                                text="Manifesto"
                                className="h-10 md:text-sm"
                                onClick={() => {
                                    navigate("manifesto")
                                }}
                            />
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
                <div className="flex items-center w-fit border border-gray-200 font-medium rounded-t-lg mt-8 bg-white ">
                    <span className="px-4 text-nowrap text-sm font-semibold h-full inline-flex items-center rounded-l-lg">
                        Filter by payment
                    </span>
                    <Select
                        defaultValue="#"
                        value={table.getColumn("payment_status")?.getFilterValue() ?? "#"}
                        onValueChange={(value) => {
                            if (value === "#") {
                                table.getColumn("payment_status")?.setFilterValue("");
                                return;
                            }
                            table.getColumn("payment_status")?.setFilterValue(value);
                        }}
                    >
                        <SelectTrigger className="w-[200px] grow rounded-none rounded-r-lg border-0 border-l px-5 focus:ring-0 focus:ring-offset-0 bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="#">All Passengers</SelectItem>
                                <SelectItem value="Success">Success</SelectItem>
                                <SelectItem value="Canceled">Canceled</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="bg-white rounded-b-lg px-4 py-2">
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
                                            onDoubleClick={() => {
                                                navigate(
                                                    `/backend/${adminProfile.account_type}/booking-details/${row.original.ticket_id}`
                                                );
                                            }}
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
                                        {queryClient.isFetching("booking") ? <p className="inline-flex gap-2 items-center">Fetching data  <Loader2 className="animate-spin" /></p> : "No results."}
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
                        <Pagination props={{ table }} />
                    </div>
                </div>
            </section >
        </>
    );
};

export default TripDetails;

const Pagination = ({ props: { table } }) => {
    const pageCount = table.getPageCount();
    const { setCurrentPageIndex, currentPageIndex } = React.useContext(BookingCTX);

    return (
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
                setCurrentPageIndex((prev) => ({
                    ...prev,
                    tripDetails: val.selected,
                }));
            }}
            forcePage={currentPageIndex.tripDetails}
            pageRangeDisplayed={3}
            pageCount={pageCount}
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
    );
};

//  Post: query trip detail by trip_code
export const TripDetailsLoader = async ({ params }) => {
    const trip_code = params.tripCode;
    const cacheKey = `trip-${trip_code}`
    const cachedData = JSON.parse(sessionStorage.getItem(cacheKey))
    const cacheTime = 5 * 60 * 1000; // 5 mins
    const currentTimeStamp = Date.now();

    // check if trip is cached and has not exceeded cacheTime limit
    if (cachedData && (currentTimeStamp - cachedData.timestamp) < cacheTime) return cachedData.data;

    try {
        const response = await axiosInstance.post("/ticket/tripcode", {
            trip_code
        });

        // check and remove existing trip cache
        Object.keys(sessionStorage).map((cache) => {
            if (cache.startsWith("trip-"))
                sessionStorage.removeItem(cache)
        })

        const data = response.data.ticket;
        sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: currentTimeStamp }))
        return data;
    } catch (error) {
        customError(error, "Error occurred while retrieving trip details");
        return null;
    }
};
