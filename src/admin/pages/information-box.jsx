import React from "react";
// import { useNavigate } from "react-router-dom";
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
// import { Textarea } from "@/components/ui/textarea";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuid } from "uuid";
import baseurl from "@/api";
import { Add, AddCircle } from "iconsax-react";
// import ConfirmationModal from "@/components/modals/confirmation";
// import { GlobalCTX } from "@/contexts/GlobalContext";

const ctx = React.createContext();

const InformationBox = () => {
	// const navigate = useNavigate();
	const { setCurrentPageIndex } = React.useContext(BookingCTX);
	const [dataQuery, setDataQuery] = React.useState([]);
	const [title, setTitle] = React.useState("");
	const [content, setContent] = React.useState('')
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	React.useEffect(() => {
		baseurl
			.get("infobox/get")
			.then((res) => setDataQuery(res.data.infoBoxes))
			.catch((err) => console.error(err))
	}, [])

	const columns = [
		{
			header: "S/N",
			cell: ({ row }) => Number(row.id) + 1,
		},
		{
			header: "Title",
			cell: ({ row }) => row.original.title,
		},
		{
			id: "status",
			header: <div className="text-center">Status</div>,
			cell: ({ row }) => {
				const status = row.original.status;
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
						className="h-8 text-xs"
						onClick={() => {
							handleEditClick(row.original);
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

	const handleEditClick = (data) => {
		const { title, message } = data
		setContent(message);
		setTitle(title);
	}

	const ctxValues = {
		title,
		setTitle,
		content,
		setContent,
	}

	return (
		<>
			<Helmet>
				<title>Information Box | Admin</title>
			</Helmet>
			<ctx.Provider value={ctxValues}>
				<div className="bg-white p-5 rounded-lg mb-10 ">
					<Editor />
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
							{table.getFilteredRowModel().rows.length} Message results.
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
			</ctx.Provider>
		</>
	);
};

export default InformationBox;

function Editor() {
	// const { mountPortalModal } = React.useContext(GlobalCTX);
	const { title, setTitle, content, setContent } = React.useContext(ctx);
	// Quill modules configuration
	const modules = {
		toolbar: [
			[{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
			[{ size: [] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ 'color': [] }, { 'background': [] }],
			[{ 'list': 'ordered' }, { 'list': 'bullet' },
			{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
			['link', 'image', 'video'],
			['clean'],
		],
		clipboard: {
			// toggle to add extra line breaks when pasting HTML:
			matchVisual: false,
		}
	};

	const handleSaveClick = () => {
		const message_id = `M-${uuid().slice(0, 6)}`;
		const formData = {
			message_id,
			title,
			message: content,
			status: "Inactive"
		}
		console.log(formData, "form")
		baseurl.post("/infobox/new", formData).then((res) => console.log(res)).catch((error) => console.error(error));
	}

	const handleCreateClick = () => {
		setContent("");
		setTitle("");
	}

	return (
		<div>
			<div className="flex *:w-full *:grow mb-5">
				<input
					type="text"
					className="border-b h-10 border-black/50 outline-none font-bold"
					value={title}
					placeholder="Title"
					onChange={(e) => {
						const value = e.target.value;
						setTitle(value)
					}}
				/>
				<div className="flex justify-end items-center gap-2 *:w-24 *:h-8 *:text-xs">
					<ButtonUI onClick={handleCreateClick} className="" variant="secondary" > <Add /> Create  </ButtonUI>
					<ButtonUI onClick={handleSaveClick}>Save</ButtonUI>
				</div>
			</div>
			<div className="flex *:w-full *:grow items-stretch h-[500px]">
				<ReactQuill
					className="h-[calc(100%-67px)]"
					theme='snow'
					formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'indent', 'link', 'image', 'video', "align", "color"]}
					placeholder="Write something amazing..."
					modules={modules}
					onChange={(event) => {
						setContent(event);
					}} // Handle text editor content changes
					value={content} // Set the value of the text editor in content
				/>
				<div className="shadow-lg border p-2 overflow-y-scroll no-scrollbar">
					<div dangerouslySetInnerHTML={{ __html: content }} />
				</div>
			</div>
		</div>
	);
}

const PromptModal = () => {
	return (
		<></>
	)
}
