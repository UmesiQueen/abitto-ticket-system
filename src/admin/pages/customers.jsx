import { Helmet } from "react-helmet-async";
import {
  FilterIcon,
  CloudIcon,
  RadioButtonIcon,
  CaretIcon,
} from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  {
    code: "0001",
    name: "Surname Name",
    email: "email@gmail.com",
    phoneNumber: "+234139126885",
    adult: "Yes",
    children: "No",
  },
  {
    code: "0001",
    name: "Surname Name",
    email: "email@gmail.com",
    phoneNumber: "+234139126885",
    adult: "Yes",
    children: "No",
  },
  {
    code: "0001",
    name: "Surname Name",
    email: "email@gmail.com",
    phoneNumber: "+234139126885",
    adult: "Yes",
    children: "No",
  },
  {
    code: "0001",
    name: "Surname Name",
    email: "email@gmail.com",
    phoneNumber: "+234139126885",
    adult: "Yes",
    children: "No",
  },
  {
    code: "0001",
    name: "Surname Name",
    email: "email@gmail.com",
    phoneNumber: "+234139126885",
    adult: "Yes",
    children: "No",
  },
  {
    code: "0001",
    name: "Surname Name",
    email: "email@gmail.com",
    phoneNumber: "+234139126885",
    adult: "Yes",
    children: "No",
  },
  {
    code: "0001",
    name: "Surname Name",
    email: "email@gmail.com",
    phoneNumber: "+234139126885",
    adult: "Yes",
    children: "No",
  },
];

const Customers = () => {
  return (
    <>
      <Helmet>
        <title>Customers | Admin</title>
      </Helmet>
      <div className="flex items-center gap-5 mb-5 ">
        <h1 className="text-base  font-semibold">Customers</h1>
        <div className="rounded-lg border px-4 p-2 cursor-pointer flex items-center gap-2 ml-auto">
          <span>
            <FilterIcon />
          </span>
          Sort by
        </div>
        <div className="rounded-lg cursor-pointer bg-blue-500 p-2">
          <CloudIcon />
        </div>
      </div>
      <div className="bg-white rounded-lg p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Adult</TableHead>
              <TableHead>Children</TableHead>
              <TableHead>
                <RadioButtonIcon />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.code}>
                <TableCell>{user.code}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.adult}</TableCell>
                <TableCell>{user.children}</TableCell>
                <TableCell>
                  <RadioButtonIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="py-5 flex items-center gap-8 px-5">
          <p className="font-medium text-sm">Showing 1 of 7 of 10 items </p>
          <div className="flex gap-4 text-xs">
            <button className="rotate-180">
              <CaretIcon />
            </button>
            <ul className="flex gap-1 *:py-2 *:px-3 *:rounded-lg [&_.active]:bg-blue-500 [&_.active]:text-white">
              <li className="active">1</li>
              <li>2</li>
              <li>3</li>
              <li>...</li>
              <li>5</li>
            </ul>
            <button>
              <CaretIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
