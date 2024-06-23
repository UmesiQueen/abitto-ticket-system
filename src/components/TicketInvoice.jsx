import React from "react";
import { humanize, cn } from "@/lib/utils";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { Helmet } from "react-helmet-async";
import { CaretIcon } from "@/assets/icons";

const TicketInvoice = () => {
  const { confirmedTicket } = React.useContext(BookingCTX);
  const navigate = useNavigate();
  const { bookingID } = useParams();
  const { dataQuery, isAuth } = React.useContext(GlobalCTX);
  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const currentUser = confirmedTicket
    ? confirmedTicket
    : dataQuery.filter((data) => data._id === bookingID)[0];

  if (!currentUser?.ticket_id) return <Navigate to="/pageNotFound" />;

  return (
    <>
      <Helmet>
        <title>Ticket Invoice | Abitto Ticket</title>
      </Helmet>
      <div className="bg-gray-300 min-h-screen p-5">
        <div className=" w-full  md:w-[700px] flex flex-col mx-auto ">
          <div className="flex gap-2 mb-5 justify-end ">
            {isAuth?.isAdmin ? (
              <Button
                className=" bg-green-500 hover:bg-green-700 "
                onClick={() => {
                  navigate(-1);
                }}
              >
                <span className="rotate-180 mr-2">
                  <CaretIcon />
                </span>
                Return
              </Button>
            ) : (
              <Button
                className=" bg-blue-500 hover:bg-blue-700 "
                onClick={() => {
                  navigate("/booking");
                }}
              >
                Book New Ticket
              </Button>
            )}
            <Button onClick={handlePrint}>Download</Button>
          </div>
          <div ref={componentRef} className="bg-white p-10 pb-20 space-y-5">
            <div>
              <img
                alt="logo"
                src="https://i.ibb.co/Zh8H4Wz/logo3.png"
                width={176}
                height={60}
                className="w-32 md:w-56"
              />
              <h1 className="uppercase font-bold mt-3 text-sm md:text-base">
                Ticket Invoice
              </h1>
              <div className="w-full text-right pb-4 mt-3 md:mt-0">
                <p className="text-xs font-bold text-[#7F7F7F] mb-1">
                  Ticket total(NGN)
                </p>
                <p className="nowrap font-semibold text-4xl md:text-5xl ">
                  <span className="text-2xl">₦</span>
                  {formatValue({
                    value: String(currentUser?.amount),
                  })}
                </p>
              </div>
            </div>
            <ul className="*:flex *:flex-col *:gap-1 flex flex-wrap gap-x-5 gap-y-3 md:gap-x-12 pb-2 border-b">
              <li>
                <p className=" text-xs text-[#7F7F7F]">Booking ID</p>
                <p className="text-base font-semibold uppercase">
                  #{currentUser?.ticket_id}
                </p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Customer Name</p>
                <p className="text-base font-semibold capitalize">{`${currentUser?.first_name} ${currentUser?.surname}`}</p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Phone Number</p>
                <p className="text-base font-semibold lowercase">
                  {currentUser?.phone_number}
                </p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Email</p>
                <p className="text-base font-semibold lowercase">
                  {currentUser?.email}
                </p>
              </li>
            </ul>
            <ul className="*:flex *:flex-col *:gap-1 flex  flex-wrap gap-x-5 gap-y-3  md:gap-x-12 pb-2 border-b">
              <li>
                <p className=" text-xs text-[#7F7F7F] ">Ticket Type</p>
                <p className="text-base font-semibold">
                  {currentUser?.trip_type}
                </p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">No. Passenger(s)</p>
                <p className="text-base font-semibold">
                  {currentUser?.total_passengers}
                </p>
              </li>
            </ul>
            <ul className="*:flex *:flex-col *:gap-1 flex  flex-wrap gap-x-5 gap-y-3  md:gap-x-12 pb-2 border-b">
              <li>
                <p className=" text-xs text-[#7F7F7F]">Travel From</p>
                <p className="text-base font-semibold">
                  {currentUser?.travel_from}
                </p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Travel To</p>
                <p className="text-base font-semibold">
                  {currentUser?.travel_to}
                </p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Seat No.</p>
                <p className="text-base font-semibold">
                  {humanize(currentUser?.seat_no)}
                </p>
              </li>
            </ul>
            <ul className="*:flex *:flex-col *:gap-1 flex  flex-wrap gap-x-5 gap-y-3  md:gap-x-12 pb-2 border-b">
              <li>
                <p className=" text-xs text-[#7F7F7F]">Departure Date</p>
                <p className="text-base font-semibold">
                  {format(currentUser?.departure_date, "PP")}
                </p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Departure Time</p>
                <p className="text-base font-semibold">
                  {currentUser?.departure_time}
                </p>
              </li>
            </ul>
            {currentUser?.trip_type === "Round Trip" && (
              <>
                <ul className="*:flex *:flex-col *:gap-1 flex  flex-wrap gap-x-5 gap-y-3  md:gap-x-12  pb-2 border-b">
                  <li>
                    <p className=" text-xs text-[#7F7F7F]">Return From</p>
                    <p className="text-base font-semibold">
                      {currentUser?.travel_to}
                    </p>
                  </li>
                  <li>
                    <p className=" text-xs text-[#7F7F7F]">Return To</p>
                    <p className="text-base font-semibold">
                      {currentUser?.travel_from}
                    </p>
                  </li>
                  {/* <li>
                    <p className=" text-xs text-[#7F7F7F]">Seat No.</p>
                    <p className="text-base font-semibold">
                      {humanize(["N/A"])}
                    </p>
                  </li> */}
                </ul>
                <ul className="*:flex *:flex-col *:gap-1 flex  flex-wrap gap-x-5 gap-y-3  md:gap-x-12 pb-2 border-b">
                  <li>
                    <p className=" text-xs text-[#7F7F7F]">Return Date</p>
                    <p className="text-base font-semibold">
                      {format(currentUser?.return_date, "PP")}
                    </p>
                  </li>
                  <li>
                    <p className=" text-xs text-[#7F7F7F]">Return Time</p>
                    <p className="text-base font-semibold">
                      {currentUser?.return_time}
                    </p>
                  </li>
                </ul>
              </>
            )}
            <ul className="*:flex *:flex-col *:gap-1 flex  flex-wrap gap-x-5 gap-y-3  md:gap-x-12 pb-2 border-b">
              <li>
                <p className=" text-xs text-[#7F7F7F] ">Booking Medium</p>
                <p className="text-base font-semibold">{currentUser?.medium}</p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Payment Status</p>
                <p
                  className={cn(
                    "text-center font-semibold rounded-lg w-16 py-1 text-xs",
                    {
                      "text-green-500 bg-green-100":
                        currentUser?.status === "Success",
                      "text-[#E78913] bg-[#F8DAB6]":
                        currentUser?.status === "Pending",
                      "text-[#F00000] bg-[#FAB0B0]":
                        currentUser?.status === "Canceled",
                    }
                  )}
                >
                  {currentUser?.status}
                </p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Payment Method</p>
                <p className="text-base font-semibold">
                  {currentUser?.paid_with}
                </p>
              </li>
              <li>
                <p className=" text-xs text-[#7F7F7F]">Transaction Reference</p>
                <p className="text-base font-semibold">
                  {currentUser?.trxRef ?? "-"}
                </p>
              </li>
            </ul>
            <div className="border-y-2 border-dashed py-2 w-56 md:w-64  ml-auto !mt-20">
              <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
                <tbody>
                  <tr>
                    <td className="text-xs text-[#444444]">Ride Insurance</td>
                    <td className="text-xs text-[#444444]">₦0</td>
                  </tr>
                  <tr>
                    <td className="text-xs text-[#444444]">Ticket Price</td>
                    <td className="text-xs text-[#444444]">₦8,800</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-base">Total</td>
                    <td className="font-medium text-lg">
                      <span className="text-base">₦</span>
                      {formatValue({
                        value: String(currentUser?.amount),
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketInvoice;
