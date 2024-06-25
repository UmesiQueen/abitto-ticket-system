import React from "react";
// import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { Helmet } from "react-helmet-async";
import {
  CaretIcon,
  CalendarIcon,
  ChairIcon,
  ClockIcon,
  Boat2Icon,
  UserIcon,
} from "@/assets/icons";

const TicketInvoice = () => {
  const { confirmedTicket, ticketCost } = React.useContext(BookingCTX);
  const navigate = useNavigate();
  const { bookingID } = useParams();
  const { dataQuery, isAuth } = React.useContext(GlobalCTX);
  const componentRef = React.useRef();
  const currentUser = confirmedTicket
    ? confirmedTicket
    : dataQuery.filter((data) => data._id === bookingID)[0];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Abitto Ticket - ${currentUser?.ticket_id}`,
  });

  if (!currentUser?.ticket_id) return <Navigate to="/pageNotFound" />;

  return (
    <>
      <Helmet>
        <title>Ticket Invoice | Abitto Ticket</title>
      </Helmet>
      <div className="bg-gray-300 min-h-screen p-5">
        <div className=" w-full md:w-[700px] flex flex-col mx-auto ">
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
          <div
            ref={componentRef}
            className="bg-white p-5 md:p-10 md:pb-20 space-y-5"
          >
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

            <div className="text-xs md:text-sm space-y-3 [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1 *:pb-3 [&>*:not(:last-of-type)]:border-b">
              {/* Trip Details */}
              <div className="space-y-3">
                <hgroup>
                  <h4 className="font-semibold mb-1 flex gap-1">
                    Terminals <Boat2Icon />
                  </h4>
                  <p>
                    {currentUser.travel_from} - {currentUser.travel_to}
                  </p>
                </hgroup>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                  <li>
                    <p className=" text-xs text-[#7F7F7F]">ID:</p>
                    <p className="uppercase">#{currentUser?.ticket_id}</p>
                  </li>

                  <li>
                    <p className="text-xs text-gray-500 font-normal">
                      Trip Type:
                    </p>
                    <p>{currentUser.trip_type}</p>
                  </li>
                  <li>
                    <p className="text-xs text-gray-500 font-normal">
                      Passenger(s):
                    </p>
                    <p>{currentUser.total_passengers}</p>
                  </li>
                </ul>
              </div>

              {/* time and return */}
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                <div>
                  <h5 className="font-semibold mb-1">Departure Details</h5>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                    <li>
                      <CalendarIcon />
                      <p>
                        {format(new Date(currentUser.departure_date), "PP")}
                      </p>
                    </li>
                    <li>
                      <ClockIcon />
                      <p>{currentUser.departure_time}</p>
                    </li>
                    <li>
                      <ChairIcon />
                      <p>{`${currentUser.departure_seats}`}</p>
                    </li>
                  </ul>
                </div>
                {currentUser.trip_type === "Round Trip" && (
                  <div>
                    <h5 className="font-semibold mb-1">Return Details</h5>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                      <li>
                        <CalendarIcon />
                        <p>
                          {format(new Date(currentUser?.return_date), "PP")}
                        </p>
                      </li>
                      <li>
                        <ClockIcon />
                        <p>{currentUser?.return_time}</p>
                      </li>
                      <li>
                        <ChairIcon />
                        <p>{`${currentUser?.return_seats}`}</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* customer details */}
              {currentUser?.adults_number <= 1 ||
              !currentUser?.passenger2_first_name ? (
                <div>
                  <h5 className="font-semibold mb-1">Passenger Details</h5>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Full name:
                      </span>{" "}
                      {`${currentUser.first_name} ${currentUser.surname}`}
                    </li>
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Phone:{" "}
                      </span>
                      {currentUser.phone_number}
                    </li>
                    {currentUser.email && (
                      <li>
                        <span className="text-xs text-gray-500 font-normal">
                          Email:{" "}
                        </span>
                        {currentUser.email}
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <div>
                  <h5 className="font-semibold mb-1 ">Passenger Names</h5>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <p className="flex gap-x-1 items-center">
                      <span className="text-[#ACACAC]">
                        <UserIcon />
                      </span>
                      {`${currentUser.first_name} ${currentUser.surname}`}
                    </p>
                    {/* FIXME: 5 shows undefined */}
                    {Array.from({
                      length: currentUser.total_passengers - 1,
                    }).map((_, i) => {
                      const num = i + 2;
                      return (
                        <p key={num} className="flex gap-1 items-center">
                          <span className="text-[#ACACAC]">
                            <UserIcon />
                          </span>
                          {`${currentUser[`passenger${num}_first_name`]} ${
                            currentUser[`passenger${num}_surname`]
                          }`}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* payment info */}
              <div>
                {/* <h5 className="font-semibold mb-1">Payment Details</h5> */}
                <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                  <li>
                    <p className="text-xs text-gray-500 font-normal">
                      Booking Medium:
                    </p>
                    <p>{currentUser?.medium}</p>
                  </li>
                  <li>
                    <p className="text-xs text-gray-500 font-normal">
                      Payment Method:
                    </p>
                    <p>{currentUser?.paid_with}</p>
                  </li>
                  {/* <li>
                    <p className="text-xs text-gray-500 font-normal">
                      Payment Status:
                    </p>
                    <p
                      className={cn(
                        "text-center font-medium rounded-lg w-16 py-1 text-[10px]",
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
                  </li> */}
                  <li>
                    <p className="text-xs text-gray-500 font-normal">
                      Trx Ref:
                    </p>
                    <p>{currentUser?.trxRef ?? "-"}</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Notice */}
            <div className=" border-t-2 !my-10 pt-3 space-y-1 text-[10px] md:text-xs ">
              <p>
                <span className="uppercase">Notice: </span> Each ticket cost{" "}
                {formatValue({ value: String(ticketCost), prefix: "₦" })}
              </p>
              <p>
                You may need to show this invoice to prove return or onward
                travel to ferry officials.
              </p>
              <p>
                Abitto Ferry check-in counters open <b>1 hours</b> before
                departure.
              </p>
              <p>
                Ensure to arrive early to your Terminal as boarding starts{" "}
                <b>30 minutes</b> before your scheduled take off.
              </p>
              <p>
                <strong>
                  This ticket is Non-refundable and cannot be rescheduled if
                  scheduled time is missed.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketInvoice;
