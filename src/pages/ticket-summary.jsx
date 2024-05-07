import React from "react";
import { BookingCTX } from "../context/BookingContext";
import {
  ChairIcon,
  InformationCircleIcon,
  CalendarIcon,
  // BoatIcon,
  ClockIcon,
  UsersIcon,
  CancelSquareIcon,
  CashIcon,
  CheckIcon,
} from "../assets/icons/index";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import Modal from "@mui/material/Modal";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

const TicketSummary = () => {
  const { formData } = React.useContext(BookingCTX);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const openModal = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 500);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div className="bg-hero-pattern h-[800px] w-screen bg-cover bg-no-repeat bg-center relative ">
      <div className="bg-black/40 w-full h-full absolute z-0 md:flex justify-center ">
        <div className="mt-28 flex flex-col h-fit px-5">
          <h2 className="text-center text-white mb-10 text-base md:text-2xl font-medium">
            Ticket Summary
          </h2>
          <div className="h-fit w-full md:w-[700px] p-5 bg-white self-center border-[20px] border-white/92  ">
            <div className="space-y-2">
              <h3 className="text-blue-500 font-semibold  text-base md:text-xl ">
                Abiito Ferry Terminal
              </h3>
              <p className="text-[#8E98A8] text-sm">
                {formData?.travel_from.includes("Calabar") ? "Calabar" : "Uyo"}{" "}
                =={">"}{" "}
                {formData?.travel_to.includes("Calabar") ? "Calabar" : "Uyo"}
              </p>
              <p className="text-[#8E98A8] text-sm inline-flex items-center gap-1">
                Non-refundable <InformationCircleIcon />
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-1">Terminals</h4>
              <p className="text-xs">
                {formData?.travel_from.includes("Calabar")
                  ? "Marina Terminal, Calabar"
                  : "Nwaniba Timber Beach Terminal, Uyo"}{" "}
                =={">"}{" "}
                {formData?.travel_to.includes("Calabar")
                  ? "Marina Terminal, Calabar"
                  : "Nwaniba Timber Beach Terminal, Uyo"}
              </p>
            </div>

            <div className="my-9 text-[#1E1E1E] text-xs md:text-sm font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
              <div>
                <h5 className="font-semibold mb-1">Departure Details</h5>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                  <p>
                    <CalendarIcon />
                    {format(new Date(formData?.departure_date), "PP")}
                  </p>
                  <p>
                    <ClockIcon /> {formData?.departure_time}
                  </p>
                  <p>
                    <UsersIcon />
                    {Number(formData?.adults_number) +
                      Number(formData?.children_number)}{" "}
                    passenger(s)
                  </p>
                  <p>
                    <ChairIcon /> Seats:{" "}
                    {formData.seat_no.map((seat, index) => (
                      <span key={index}>{seat}</span>
                    ))}
                  </p>
                </div>
              </div>

              {formData.trip_type === "Round Trip" && (
                <div className="my-6">
                  <h5 className="font-semibold mb-1">Return Details</h5>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                    <p>
                      <CalendarIcon />
                      {format(new Date(formData?.return_date), "PP")}
                    </p>
                    <p>
                      <ClockIcon /> {formData?.return_time}
                    </p>
                    <p>
                      <UsersIcon />
                      {Number(formData?.adults_number) +
                        Number(formData?.children_number)}{" "}
                      passenger(s)
                    </p>
                    <p>
                      <ChairIcon /> Seats:{" "}
                      {formData.seat_no.map((seat, index) => (
                        <span key={index}>{seat}</span>
                      ))}
                    </p>
                  </div>
                </div>
              )}

              {/* <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                <p>
                  <UsersIcon />
                  {Number(formData?.adults_number) +
                    Number(formData?.children_number)}{" "}
                  passenger(s)
                </p>
                <p>
                  <BoatIcon />
                  {formData.trip_type}
                </p>
                <p>
                  <ChairIcon /> Seats:{" "}
                  {formData.seat_no.map((seat, index) => (
                    <span key={index}>{seat}</span>
                  ))}
                </p>
              </div> */}
            </div>

            <div className="border-y-2 border-dashed py-2 mt-6">
              <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px]   ">
                <tbody>
                  <tr>
                    <td className="text-xs text-[#444444]">Ride Insurance</td>
                    <td className="text-xs text-[#444444]">₦0</td>
                  </tr>
                  <tr>
                    <td className="text-xs text-[#444444]">Ticket Price</td>
                    <td className="text-xs text-[#444444]">₦1,000</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-base">Ticket:</td>
                    <td className="font-medium text-base">
                      ₦
                      {formatValue({
                        value: String(
                          (Number(formData?.adults_number) +
                            Number(formData?.children_number)) *
                            1000
                        ),
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={openModal}
                className=" bg-blue-500 w-56 py-3 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center"
              >
                {loading ? (
                  <ClipLoader
                    color="#fff"
                    loading={loading}
                    size={20}
                    aria-label="Loading Spinner"
                  />
                ) : (
                  "Proceed to buy ticket"
                )}
              </button>
            </div>
          </div>
        </div>

        <PaymentModals open={open} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default TicketSummary;

// eslint-disable-next-line react/prop-types
const PaymentModals = ({ open, closeModal }) => {
  const [openChild, setOpenChild] = React.useState(false);

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          closeModal();
          setOpenChild(false);
        }}
        aria-labelledby="payment-modal"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div className="mt-36 bg-white h-fit md:w-[375px] p-5 mx-5 md:mx-auto">
          {!openChild ? (
            <div>
              <div className="flex gap-5 items-center">
                <h2 className="font-semibold text-base text-center grow">
                  Select Payment Method
                </h2>
                <button
                  onClick={closeModal}
                  className=" hover:scale-[.8] rounded-lg transition duration-150 ease-in-out "
                >
                  <CancelSquareIcon />
                </button>
              </div>
              <form
                action=""
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <ul className=" space-y-3 *:flex *:items-center *:border *:p-3 *:gap-3 [&_input]:ml-auto my-4">
                  <li>
                    <img
                      alt="pay-stack"
                      src="https://i.ibb.co/QpjxrJj/Paystack.png"
                      width={24}
                      height={23}
                    />
                    <p>Pay Online</p>{" "}
                    <input type="radio" className="" disabled />
                  </li>
                  <li>
                    <CashIcon /> <p>Pay with Cash (Offline)</p>{" "}
                    <input type="radio" required />
                  </li>
                </ul>
                <button
                  onClick={() => {
                    setOpenChild(true);
                  }}
                  className=" bg-[#C2C2C2] py-3 text-blue-50 font-semibold w-full"
                >
                  Continue
                </button>
              </form>
            </div>
          ) : (
            <SuccessModal />
          )}
        </div>
      </Modal>
    </>
  );
};

const SuccessModal = () => {
  const navigate = useNavigate();

  return (
    <div className=" text-center flex flex-col gap-5">
      <div className="mx-auto w-fit">
        <CheckIcon />
      </div>
      <h2 className="font-semibold text-base text-[#454545] px-10 ">
        Your Ferry Seat has been successfully Booked!
      </h2>
      <p className="font-normal text-xs text-[#454545] px-10">
        Please check your email for important ticket details.
      </p>
      <div className="flex gap-6">
        <button className="w-full border-2 border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700 text-sm bg-blue-50 p-3 px-4 font-semibold transition-all duration-150 ease-in-out ">
          Check email
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 transition-all duration-150 ease-in-out text-sm w-full text-white p-3 px-4 font-semibold"
          onClick={() => {
            navigate("/");
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
