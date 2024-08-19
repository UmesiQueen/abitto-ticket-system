// import React from "react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
	return (
		<div className="space-y-10">
			<h1 className="font-semibold text-lg mb-10">Manage Prices</h1>
			<div className="p-10 rounded-lg bg-white">
				<h2 className="mb-5 font-medium">Rental Pricing</h2>
				<table className="w-full border [&_th]:p-2  [&_th]:border [&_td]:px-2  [&_td]:py-4 [&_td]:text-center   [&_td]:border  ">
					<thead>
						<tr>
							<th>S/N</th>
							<th>Rental Package</th>
							<th> Rent Cost</th>
							<th colSpan={2}>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Within Marina</td>
							<td>N150,000</td>
							<td>
								<Button>Edit</Button>
							</td>
							<td>
								<Button>Save</Button>
							</td>
						</tr>
						<tr>
							<td>2</td>
							<td>Calabar to Uyo</td>
							<td>N150,000</td>
							<td>
								<Button>Edit</Button>
							</td>
							<td>
								<Button>Save</Button>
							</td>
						</tr>
						<tr>
							<td>3</td>
							<td>Uyo to Calabar</td>
							<td>N150,000</td>
							<td>
								<Button>Edit</Button>
							</td>
							<td>
								<Button>Save</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="p-10 rounded-lg bg-white">
				<h2 className="mb-5 font-medium">Logistics Pricing</h2>
				<table className="w-full border [&_th]:p-2  [&_th]:border [&_td]:px-2  [&_td]:py-4 [&_td]:text-center   [&_td]:border  ">
					<thead>
						<tr>
							<th>S/N</th>
							<th>Terminals</th>
							<th>Cost/kg</th>
							<th colSpan={2}>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Both Terminals</td>
							<td>N1,000</td>
							<td>
								<Button>Edit</Button>
							</td>
							<td>
								<Button>Save</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Pricing;
