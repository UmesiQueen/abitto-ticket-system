import React from "react";
import { Helmet } from "react-helmet-async";
import { createPortal } from "react-dom";
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
import { Button } from "@/components/ui/button";
import { CaretIcon, CancelSquareIcon, DeleteIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import { cn, customError } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import axiosInstance from "@/api";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const InformationBox = () => {
	const { setLoading } = React.useContext(BookingCTX);
	const { mountPortalModal, setModalContent } = React.useContext(GlobalCTX);
	const [dataQuery, setDataQuery] = React.useState([]);
	const queryClient = useQueryClient();
	const [imageFile, setImageFile] = React.useState("");
	const [preview, setPreview] = React.useState("");
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data, isSuccess, isPending } = useQuery({
		queryKey: ["infoBox"],
		queryFn: InformationLoader
	})

	React.useEffect(() => {
		if (isSuccess) setDataQuery(data);
	}, [data, isSuccess])

	const validFileExtensions =
		["jpg", "png", "jpeg", "svg", "webp"];

	function isValidFileType(fileName, fileType) {
		return (
			fileName &&
			validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
		);
	}

	const infoSchema = yup.object().shape({
		title: yup.string().required("Title is required."),
		message: yup
			.mixed()
			.required("Select an Image to upload")
			.test("is-valid-type", "Not a valid image type", ([value]) => {
				return (value) ? isValidFileType(value[0]?.name.toLowerCase(), "image") : false
			})
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
	}, [clearErrors, preview, setValue])

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
			header: <div className="text-right pr-10">Actions</div>,
			cell: ({ row }) => (
				<div className="inline-flex justify-end w-full gap-5">
					{
						row.original.status === "Active" ?
							<Button
								type="button"
								variant="secondary"
								className="text-xs bg-red-50 hover:bg-red-100"
								onClick={() => handleUpdateMessage(row.original, "deactivate")}
							>
								Deactivate
							</Button> : <Button
								type="button"
								variant="secondary"
								className="text-xs bg-green-50 hover:bg-green-100"
								onClick={() => handleUpdateMessage(row.original, "activate")}
							>
								Activate
							</Button>
					}

					<Button
						type="button"
						variant="secondary"
						className="text-xs"
						onClick={() => {
							setImageFile("");
							setPreview(row.original.message)
						}}
					>
						Preview
					</Button>
					<Button
						variant="destructive"
						size="icon"
						onClick={() => handleDelete(row.original)}
					>
						<DeleteIcon />
					</Button>
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
				header: "Upload this message?",
				handleRequest: () => {
					handleUploadMessage(formData)
				},
			}} />
		)
	})

	const handleUploadMessage = async (formData) => {
		setLoading(true)
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
				return res.data.secure_url;
			})
			.catch(() => {
				toast.error("Failed to upload message. Try Again.");
				setLoading(false);
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
			axiosInstance
				.post("/infobox/new", formValues)
				.then((res) => {
					if (res.status === 200) {
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
					customError(error, "Failed to upload message. Try Again.");
				})
				.finally(() => {
					setLoading(false);
				});

		}
	}

	const handleReset = () => {
		reset();
		setPreview("");
		setImageFile("");
		queryClient.invalidateQueries("infoBox");
	}

	const handleUpdateMessage = (data, action) => {
		const options = {
			deactivate: {
				header: "Deactivate this message?",
				severity: "delete",
				status: "Inactive"
			},
			activate: {
				header: "Activate this message?",
				severity: "warning",
				status: "Active"
			}
		}

		mountPortalModal(
			<ConfirmationModal props={{
				header: options[action].header,
				handleRequest: () => {
					updateRequest(data, options[action].status)
				},
				severity: options[action].severity
			}} />
		)
	}

	const updateRequest = (data, action) => {
		setLoading(true)
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

		if (action === "Active") {
			const isActive = dataQuery.filter((message) => message.status === "Active").length
			if (isActive) {
				setLoading(false);
				toast.warning("A message is currently active. Please deactivate to upload a new one.")
				return;
			}
		}

		axiosInstance
			.patch("/infobox/update", formValues)
			.then((res) => {
				if (res.status === 200) {
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
				customError(error, options[action].error);
			})
			.finally(() => setLoading(false));
	}

	const handleDelete = (data) => {
		mountPortalModal(
			<ConfirmationModal props={{
				header: "Delete this record?",
				handleRequest: () => {
					deleteRequest(data)
				},
				severity: "delete"
			}} />
		)
	}

	const deleteRequest = (data) => {
		setLoading(true)
		axiosInstance
			.patch("/infobox/delete", { message_id: data.message_id })
			.then((res) => {
				if (res.status === 200) {
					handleReset();
					setModalContent(
						<SuccessModal
							header="Deleted Successfully"
							text="You have successfully deleted a message record."
						/>
					);
				}
			})
			.catch((error) => {
				customError(error, "Failed to delete message. Try Again.");
			}).finally(() => setLoading(false))
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
						<Button
							type="submit"
							className="inline-flex gap-2 items-center ml-auto bg-green-800 hover:bg-green-900"
						>
							<UploadIcon />
							Upload Image
						</Button>
					</div>
					<div className="flex *:w-full *:grow items-stretch h-[500px]">
						<div className={cn("shadow-lg border-2 border-dashed p-2 rounded-lg flex justify-center items-center", {
							"bg-red-50/50 border-red-500": errors.message
						})}>
							<input className="hidden" {...register("message")} />
							<div className="text-center min-h-56 flex flex-col gap-2">
								<img src={UploadPhoto} alt="upload" width={100} height={100} className="mx-auto" />
								<p>Choose image to upload</p>
								{errors?.message && (
									<p className="text-xs text-red-700 font-medium">
										{errors?.message.message}
									</p>
								)}
								{
									imageFile && <p className=" italic text-sm bg-blue-50 py-1 border border-dashed ">{imageFile.target.files[0].name}</p>
								}
								<label className="mt-auto text-sm text-white bg-blue-500 font-medium inline-flex items-center justify-center mx-auto h-10 w-40 rounded-lg cursor-pointer hover:bg-blue-700">
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
								onKeyDown={() => mountPortalModal(<PreviewModal url={preview} />)}
							>
								{preview.length ?
									<img src={preview} alt="notice" />
									: null
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
										{isPending ? <p className="inline-flex gap-2 items-center">Fetching data  <Loader2 className="animate-spin" /></p> : "No results."}
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
								<Button
									variant="ghost"
									size="sm"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
								>
									<CaretIcon />
								</Button>
							}
							onPageChange={(val) => {
								table.setPageIndex(val.selected);
							}}
							initialPage={0}
							pageRangeDisplayed={3}
							pageCount={table.getPageCount()}
							previousLabel={
								<Button
									variant="ghost"
									size="sm"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
								>
									<span className="rotate-180">
										<CaretIcon />
									</span>
								</Button>
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
	const [loading, setLoading] = React.useState(false)

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
						<div className="py-20 md:py-0 min-h-screen md:h-full flex justify-center items-center px-5">
							<div className="w-full max-w-[calc(100vw-100px)] h-full max-h-[calc(100vh-100px)] flex justify-center ">
								<div className="h-full w-fit relative">
									{loading && <Button
										variant="ghost"
										size="icon"
										className="bg-white rounded-full absolute -top-3 -right-3 p-2 shadow-md"
										onClick={() => { setShowLiveModal(false) }}
									>
										<CancelSquareIcon />
									</Button>}
									<img src={liveMessage?.message} onLoad={() => setLoading(true)} alt="notice" className="w-full h-full" />
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
		<div className="w-full max-w-[calc(100vw-100px)] h-full max-h-[calc(100vh-100px)] flex justify-center ">
			<div className="h-full w-fit relative">
				<Button
					variant="ghost"
					size="icon"
					className="bg-white rounded-full absolute -top-3 -right-3  p-2 shadow-md"
					onClick={unMountPortalModal}
				>
					<CancelSquareIcon />
				</Button>
				<img src={url} alt="notice" className="w-fit h-full" />
			</div>
		</div>
	)
}

const InformationLoader = async () => {
	try {
		const response = await axiosInstance.get("/infobox/get");
		return response.data.infoBoxes;
	} catch (error) {
		customError(error, "Error occurred while retrieving uploaded messages.");
		return [];
	}
}
