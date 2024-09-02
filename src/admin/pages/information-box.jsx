import React from "react";
import { Helmet } from "react-helmet-async";
import { createPortal } from "react-dom";
import { useLoaderData, useRevalidator } from "react-router-dom";
import Modal from "@mui/material/Modal";
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
import { CaretIcon, CancelSquareIcon, DeleteIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import { cn } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import baseurl from "@/api";
import ConfirmationModal from "@/components/modals/confirmation";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { UploadIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SuccessModal from "@/components/modals/success";
import UploadPhoto from "@/assets/images/photo.png"

const InformationBox = () => {
	const { setCurrentPageIndex, setLoading: setLoader } = React.useContext(BookingCTX);
	const { mountPortalModal, setModalContent } = React.useContext(GlobalCTX);
	const dataQuery = useLoaderData();
	const { revalidate } = useRevalidator();
	const [imageFile, setImageFile] = React.useState("");
	const [preview, setPreview] = React.useState("");
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const infoSchema = yup.object().shape({
		title: yup.string().required("Title is required."),
		message: yup.string().required("Select an Image to upload")
	})

	const {
		register,
		handleSubmit,
		setValue,
		clearErrors,
		reset,
		formState: { errors }
	} = useForm({
		resolver: yupResolver(infoSchema),
	})

	React.useEffect(() => {
		if (preview) {
			clearErrors("message")
			setValue("message", preview)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preview])

	const columns = [
		{
			header: "S/N",
			cell: ({ row }) => Number(row.id) + 1,
			width: 150
		},
		{
			header: "Title",
			cell: ({ row }) => row.original.title,
			width: 200
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
			width: 150
		},
		{
			id: "actions",
			header: <div className="text-center">Actions</div>,
			cell: ({ row }) => (
				<div className="inline-flex justify-end w-full gap-5">
					{
						row.original.status == "Active" ?
							<ButtonUI
								type="button"
								variant="secondary"
								className="text-xs bg-red-50 hover:bg-red-100"
								onClick={() => handleUpdateMessage(row.original, "deactivate")}
							>
								Deactivate
							</ButtonUI> : <ButtonUI
								type="button"
								variant="secondary"
								className="text-xs bg-green-50 hover:bg-green-100"
								onClick={() => handleUpdateMessage(row.original, "activate")}
							>
								Activate
							</ButtonUI>
					}

					<ButtonUI
						type="button"
						variant="secondary"
						className="text-xs"
						onClick={() => setPreview(row.original.message)}
					>
						Preview
					</ButtonUI>
					<ButtonUI
						variant="destructive"
						size="icon"
						onClick={() => handleDelete(row.original)}
					>
						<DeleteIcon />
					</ButtonUI>
				</div>
			),
			width: 200
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

	const handleImageUpload = (event) => {
		const file = event?.target.files[0];
		if (file) {
			setImageFile(event);
			setPreview(URL.createObjectURL(file));
		}
	};

	const onSubmit = handleSubmit(async (formData) => {
		mountPortalModal(
			<ConfirmationModal props={{
				header: "Are you sure you want to upload this message?",
				handleRequest: () => {
					handleUploadMessage(formData)
				},
			}} />
		)
	})

	const handleUploadMessage = async (formData) => {
		setLoader(true)
		const file = imageFile.target.files[0];
		const cloudinaryData = new FormData();
		cloudinaryData.append("file", file);
		cloudinaryData.append("upload_preset", "mettsotz");

		const response = await axios
			.post(
				"https://api.cloudinary.com/v1_1/queen-dev/image/upload",
				cloudinaryData
			)
			.then((res) => {
				return res.data.url;
			})
			.catch(() => {
				toast.error("Failed to upload message. Try Again.");
				setLoader(false);
				return false;
			});

		if (response) {
			const message_id = `M-${uuid().slice(0, 6)}`;
			const formValues = {
				message_id,
				title: formData.title,
				message: response,
				status: "Inactive"
			}
			baseurl
				.post("/infobox/new", formValues)
				.then((res) => {
					if (res.status == 200) {
						handleReset()
						setModalContent(
							<SuccessModal
								header="Upload Successful"
								text="You have successfully uploaded a new message. Click the activate button to live this message."
							/>
						);
					}
				})
				.catch((error) => {
					if (
						!error.code === "ERR_NETWORK" ||
						!error.code === "ERR_INTERNET_DISCONNECTED" ||
						!error.code === "ECONNABORTED"
					)
						toast.error("Failed to upload message. Try Again.");
				})
				.finally(() => {
					setLoader(false);
				});

		}
	}

	const handleReset = () => {
		reset();
		setPreview("");
		setImageFile("");
		revalidate();
	}

	const handleUpdateMessage = (data, action) => {
		const options = {
			deactivate: {
				severity: "delete",
				status: "Inactive"
			},
			activate: {
				severity: "warning",
				status: "Active"
			}
		}

		mountPortalModal(
			<ConfirmationModal props={{
				header: "Are you sure you want to deactivate this message?",
				handleRequest: () => {
					updateRequest(data, options[action].status)
				},
				severity: options[action].severity
			}} />
		)
	}

	const updateRequest = (data, action) => {
		setLoader(true)
		const formValues = {
			...data,
			status: action
		}

		const options = {
			Active: {
				header: "Activation Successful",
				text: "Users will now see the message you uploaded.",
				error: "Failed to activate message. Try Again."
			},
			Inactive: {
				header: "Deactivation Successful",
				text: "Users will no longer see the previously uploaded message.",
				error: "Failed to deactivate message. Try Again."
			}
		}

		if (action == "Active") {
			const isActive = dataQuery.filter((message) => message.status == "Active").length
			if (isActive) {
				setLoader(false);
				toast.warning("A message is currently active. Please deactivate to upload a new one.")
				return;
			}
		}

		baseurl
			.patch("/infobox/update", formValues)
			.then((res) => {
				if (res.status == 200) {
					handleReset();
					setModalContent(
						<SuccessModal
							header={options[action].header}
							text={options[action].text}
						/>
					);
				}
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error(options[action].error);
			})
			.finally(() => setLoader(false));
	}

	const handleDelete = (data) => {
		mountPortalModal(
			<ConfirmationModal props={{
				header: "Are you sure you want to delete this record?",
				handleRequest: () => {
					deleteRequest(data)
				},
				severity: "delete"
			}} />
		)
	}

	const deleteRequest = (data) => {
		setLoader(true)
		baseurl
			.delete("/infobox/delete", data)
			.then((res) => {
				if (res.status == 200) {
					setModalContent(
						<SuccessModal
							header="Deleted Successfully"
							text="You have successfully deleted a message record."
						/>
					);
				}
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Failed to delete message. Try Again.");
			}).finally(() => setLoader(false))
	}

	return (
		<>
			<Helmet>
				<title>Information Box | Admin</title>
			</Helmet>
			<section >
				<form onSubmit={onSubmit} className="bg-white p-5 rounded-lg mb-10 ">
					<div className="flex justify-center mb-5">
						<div className="w-1/2 relative">
							<input
								type="text"
								{...register("title")}
								className="h-10 border-black/50 outline-none w-full font-bold p-2"
								placeholder="Title"
							/>
							{errors?.title && (
								<p className="text-xs text-red-700 font-medium absolute px-2 -bottom-4 ">
									{errors?.title.message}
								</p>
							)}
						</div>
						<ButtonUI
							type="submit"
							className="inline-flex gap-2 items-center ml-auto bg-green-800 hover:bg-green-900"
						>
							<UploadIcon />
							Upload Image
						</ButtonUI>
					</div>
					<div className="flex *:w-full *:grow items-stretch h-[500px]">
						<div className={cn("shadow-lg border-2 border-dashed p-2 rounded-lg flex justify-center items-center", {
							"bg-red-50/50 border-red-500": errors.message
						})}>
							<input className="hidden" {...register("message")} />
							<div className="text-center">
								<img src={UploadPhoto} alt="upload" width={100} height={100} className="mx-auto" />
								<p>Upload image or file</p>
								{errors?.message && (
									<p className="text-xs text-red-700 font-medium mt-2">
										{errors?.message.message}
									</p>
								)}
								<label className="mt-10 text-sm text-white bg-blue-500 font-medium inline-flex items-center justify-center mx-auto h-10 w-40 rounded-lg cursor-pointer hover:bg-blue-700">
									Browse files
									<input
										type="file"
										className="hidden"
										accept=".jpg, .jpeg, .png"
										onChange={handleImageUpload}
									/>
								</label>
							</div>
						</div>
						<div className="p-2 relative ">
							<p className="absolute top-1/2 left-1/2 translate-x-[-50%] font-medium">Previews will show here</p>
							<div
								className="overflow-scroll no-scrollbar relative h-full flex items-center justify-center"
								onClick={() => mountPortalModal(<PreviewModal url={preview} />)}
							>
								{preview.length ?
									<img src={preview} alt="notice" className="" />
									: ""
								}
							</div>
						</div>
					</div>
				</form>
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
			</section>
		</>
	);
};

export default InformationBox;

export const InformationModal = () => {
	const { showLiveModal, liveMessage, setShowLiveModal } = React.useContext(GlobalCTX);

	return (
		<>
			{showLiveModal &&
				createPortal(
					<Modal
						open={showLiveModal}
						aria-labelledby="modal-portal"
						sx={{
							overflow: "scroll",
						}}
						className="no-scrollbar"
					>
						<div className=" py-20 md:my-0 min-h-screen md:h-full flex justify-center items-center px-5">
							<div className="relative">
								<ButtonUI
									variant="ghost"
									size="icon"
									className="bg-white rounded-full absolute -top-3 -right-3 p-2"
									onClick={() => { setShowLiveModal(false) }}
								>
									<CancelSquareIcon />
								</ButtonUI>
								<div className="max-w-[600px] md:w-[600px] aspect-auto">
									<img src={liveMessage?.message} alt="notice" className="w-full h-full" />
								</div>
							</div>
						</div>
					</Modal>,
					document.body
				)}
		</>
	);
}

// eslint-disable-next-line react/prop-types
const PreviewModal = ({ url }) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className="flex justify-center items-center relative">
			<ButtonUI
				variant="ghost"
				size="icon"
				className="bg-white rounded-full absolute -top-3 -right-3 p-2"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</ButtonUI>
			<div className="max-w-[600px] aspect-auto ">
				<img src={url} alt="notice" className="w-full h-full" />
			</div>
		</div>
	)
}

export const InformationLoader = async () => {
	try {
		const response = await baseurl.get("infobox/get");
		return response.data.infoBoxes;
	} catch (error) {
		if (
			!error.code === "ERR_NETWORK" ||
			!error.code === "ERR_INTERNET_DISCONNECTED" ||
			!error.code === "ECONNABORTED"
		)
			toast.error("Error occurred while retrieving uploaded messages.");
		return [];
	}
}
