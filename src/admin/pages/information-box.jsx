import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
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
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import { Button as ButtonUI } from "@/components/ui/button";
import { CaretIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const InformationBox = () => {
	const navigate = useNavigate();
	const { setCurrentPageIndex } = React.useContext(BookingCTX);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const dataQuery = [
		{
			id: 1,
			message_id: "M-2039",
			live_status: "Active",
			message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
		},
		{
			id: 2,
			message_id: "M-1238",
			live_status: "Inactive",
			message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
		},
		{
			id: 3,
			message_id: "M-4209",
			live_status: "Inactive",
			message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
		},
	];

	const columns = [
		{
			header: "S/N",
			cell: ({ row }) => Number(row.id) + 1,
		},
		{
			header: "Message",
			cell: ({ row }) => row.original.message,
		},
		{
			id: "live_status",
			header: <div className="text-center">Status</div>,
			cell: ({ row }) => {
				const status = row.original.live_status;
				return (
					<div
						className={cn(
							"rounded-lg w-20 mx-auto py-1 text-[10px] text-center font-semibold",
							{
								"text-green-500 bg-green-100": status === "Active",
								"text-[#F00000] bg-[#FAB0B0]": status === "Inactive",
							}
						)}
					>
						{status}
					</div>
				);
			},
		},
		{
			id: "actions",
			header: <div className="text-center">Actions</div>,
			cell: ({ row }) => (
				<div className="mx-auto w-fit">
					<ButtonUI
						type="button"
						onClick={() => {
							console.log("hello");
						}}
					>
						Edit
					</ButtonUI>
				</div>
			),
		},
	];

	const table = useReactTable({
		data: dataQuery,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		pageCount: Math.ceil(dataQuery.length / pagination.pageSize),
		state: {
			pagination,
		},
	});

	return (
		<>
			<Helmet>
				<title>Information Box | Admin</title>
			</Helmet>
			<div className="bg-white p-10 rounded-lg mb-10 flex gap-5 items-end w-3/4 ">
				<Textarea className="bg-gray-200 resize-none" rows={16} />
				<div className="flex flex-col gap-2 *:w-36 *:h-12">
					<ButtonUI>Save</ButtonUI>
					<ButtonUI>Live</ButtonUI>
				</div>
			</div>
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
								<TableRow
									key={row.original.message_id}
									className="h-[65px]"
									onClick={() => console.log(row.original)}
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

				<div className="flex items-center gap-8  p-4">
					<p className="font-medium text-sm">
						{table.getFilteredRowModel().rows.length} Feedback results.
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
							setCurrentPageIndex((prev) => ({
								...prev,
								feedback: val.selected,
							}));
						}}
						initialPage={0}
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
		</>
	);
};

export default InformationBox;
