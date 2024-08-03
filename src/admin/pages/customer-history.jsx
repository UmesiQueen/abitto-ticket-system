import React from "react";
import { CircleArrowLeftIcon } from "@/assets/icons";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { BookingCTX } from "@/contexts/BookingContext";
import { Copy, Hash, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const CustomerHistory = () => {
	const navigate = useNavigate();
	const { customerID } = useParams();
	const { customersData } = React.useContext(BookingCTX);

	const currentCustomer = customersData.find((item) => item._id == customerID);

	if (!currentCustomer?._id) return <Navigate to="/backend/admin/customers" />;

	return (
		<>
			<Helmet>
				<title>Customer Details| Admin</title>
			</Helmet>
			<div>
				<div className="flex gap-1 items-center mb-5 py-2">
					<button onClick={() => navigate(-1)}>
						<CircleArrowLeftIcon />
					</button>
					<h1 className="text-base font-semibold">Customer History</h1>
				</div>
				<div className="min-h-[500px] flex *:grow *:w-1/2 gap-5">
					<div className="p-10 bg-white rounded-lg">
						<div className="flex gap-5 items-center">
							<Avatar
								alt={currentCustomer.first_name.substring(0, 1)}
								className="bg-gray-300"
							/>
							<h2 className="capitalize">
								{`${currentCustomer.first_name} ${currentCustomer.last_name}`}
							</h2>
						</div>
						<ul className="mt-10 max-w-[400px] space-y-3 *:border-b">
							<li className=" flex items-center  gap-5">
								<Mail />
								<p>{currentCustomer.email}</p>
								<Button
									size="icon"
									variant="ghost"
									className="rounded-full ml-auto hover:bg-slate-300"
								>
									<Copy />
								</Button>
							</li>
							<li className=" flex items-center  gap-5">
								<Phone />
								<p>{currentCustomer.phone_number}</p>
								<Button
									size="icon"
									variant="ghost"
									className="rounded-full ml-auto hover:bg-slate-300"
								>
									<Copy />
								</Button>
							</li>
							<li className=" flex items-center  gap-5">
								<Hash />
								<p>{customerID}</p>
								<Button
									size="icon"
									variant="ghost"
									className="rounded-full ml-auto hover:bg-slate-300"
								>
									<Copy />
								</Button>
							</li>
						</ul>
					</div>
					<div className="space-y-5 flex flex-col">
						<ul className="p-10 flex gap-10 bg-white rounded-lg">
							<li>
								<h3>Successful</h3>
								<p>1/2</p>
							</li>
							<li>
								<h3>Total Spend</h3>
								<p>₦28000</p>
							</li>
						</ul>
						<div className="p-10 bg-white rounded-lg grow mb-5">
							<div className="flex justify-between">
								<h3>Recent Transactions</h3>
								<p className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer">
									View all transactions
								</p>
							</div>
							<ul className="space-y-5 mt-5">
								<li className="flex items-center gap-5 border-b pb-1">
									<span className="p-1 rounded-full bg-green-500" />
									<p>id</p>
									<strong>N14000</strong>
									<p className="ml-auto">Date</p>
								</li>
								<li className="flex items-center gap-5 border-b pb-1">
									<span className="p-1 rounded-full bg-red-500" />
									<p>id</p>
									<strong>N14000</strong>
									<p className="ml-auto">Date</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CustomerHistory;
