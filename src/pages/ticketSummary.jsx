import React from "react";
import { BookingCTX } from "@/hooks/BookingContext";
import {
  InformationCircleIcon,
  CancelSquareIcon,
  CashIcon,
  CheckIcon,
} from "@/assets/icons/index";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import Modal from "@mui/material/Modal";
import { Navigate, useNavigate } from "react-router-dom";
import { GlobalCTX } from "@/hooks/GlobalContext";
import { Helmet } from "react-helmet-async";
import { usePayment } from "@/hooks/usePayment";
import Button from "@/components/custom/Button";
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from "prop-types";

const TicketSummary = () => {
  const { formData } = React.useContext(BookingCTX);

  if (!formData?.ticket_id) {
    return <Navigate to="/booking" />;
  }

  return <ProtectedRoute />;
};

const ProtectedRoute = () => {
  const { formData } = React.useContext(BookingCTX);
  const [open, setOpen] = React.useState(false);
  const { loading, setLoading } = React.useContext(GlobalCTX);

  const openModal = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 1000);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Abitto Ferry - Ticket Summary</title>
      </Helmet>
      <div className="bg-hero-pattern h-[900px] w-screen bg-cover bg-no-repeat bg-center relative ">
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
                  {formData?.travel_from.includes("Calabar")
                    ? "Calabar"
                    : "Uyo"}{" "}
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
                  {formData?.travel_from} - {formData?.travel_to}
                </p>
              </div>
              <div className=" mt-5 mb-9 text-[#1E1E1E] space-y-5 text-xs md:text-sm font-normal [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1 [&_li]:font-medium">
                <div>
                  <h5 className="font-semibold mb-1">Customer Info</h5>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Name:
                      </span>{" "}
                      {`${formData.first_name} ${formData.surname}`}
                    </li>
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Phone:{" "}
                      </span>
                      {formData.phone_number}
                    </li>
                    {formData.email && (
                      <li>
                        <span className="text-xs text-gray-500 font-normal">
                          Email:{" "}
                        </span>
                        {formData.email}
                      </li>
                    )}
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Type:{" "}
                      </span>
                      {formData.trip_type}
                    </li>
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Passenger(s):{" "}
                      </span>
                      {Number(formData?.adults_number) +
                        Number(formData?.children_number)}
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-1">Departure Details</h5>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Date:
                      </span>
                      {format(new Date(formData?.departure_date), "PP")}
                    </li>
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Time:
                      </span>{" "}
                      {formData?.departure_time}
                    </li>
                  </ul>
                </div>
                {formData.trip_type === "Round Trip" && (
                  <div>
                    <h5 className="font-semibold mb-1">Return Details</h5>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                      <li>
                        <span className="text-xs text-gray-500 font-normal">
                          Date:
                        </span>
                        {format(new Date(formData?.return_date), "PP")}
                      </li>
                      <li>
                        <span className="text-xs text-gray-500 font-normal">
                          Time:
                        </span>{" "}
                        {formData?.return_time}
                      </li>
                    </ul>
                  </div>
                )}
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
                      <td className="text-xs text-[#444444]">₦8,500</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-base">Total</td>
                      <td className="font-medium text-base">
                        ₦
                        {formatValue({
                          value: String(
                            (Number(formData?.adults_number) +
                              Number(formData?.children_number)) *
                              (formData?.trip_type === "Round Trip"
                                ? 17000
                                : 8500)
                          ),
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  onClick={openModal}
                  loading={loading}
                  text={"Purchase ticket"}
                  className="w-56"
                />
              </div>
            </div>
          </div>
          <PaymentModals open={open} closeModal={closeModal} />
        </div>
      </div>
    </>
  );
};

export default TicketSummary;

const PaymentModals = ({ open, closeModal }) => {
  const { paymentStatus, loading, setPaymentStatus, confirmedTicket } =
    React.useContext(BookingCTX);
  const { handleAlert } = React.useContext(GlobalCTX);
  const [successModal, setSuccessModal] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const { onlinePayment, offlinePayment } = usePayment();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (paymentStatus.requestState === "success") {
      if (paymentStatus.status === "Success") handleSuccess();
      if (paymentStatus.status === "Canceled") handleOnlineCancel();
      if (paymentStatus.status === "Pending") setSuccessModal(true);
    }
    if (paymentStatus.requestState === "error") handleBadRequest();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus]);

  // clearStates
  const clearStates = () => {
    closeModal();
    setPaymentMethod("");
    setPaymentStatus({ requestState: "", status: "" });
  };

  const handleSuccess = () => {
    setPaymentMethod("");
    setPaymentStatus({ requestState: "", status: "" });
    navigate(`/ticket-summary/${confirmedTicket._id}`);
  };

  // handleOnlineCancel
  const handleOnlineCancel = () => {
    clearStates();
    // send toast that cancel occurred
  };

  //handleBadRequest
  const handleBadRequest = () => {
    clearStates();
    handleAlert("error");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          if (!successModal) clearStates();
        }}
        aria-labelledby="payment-modal"
        sx={{ backdropFilter: "blur(1px)", zIndex: 1 }}
      >
        <div className="mt-36 bg-white h-fit md:w-[375px] p-5 mx-5 md:mx-auto">
          {!successModal ? (
            <div>
              <div className="flex gap-5 items-center">
                <h2 className="font-semibold text-base text-center grow">
                  Select Payment Method
                </h2>
                <button
                  onClick={clearStates}
                  className=" hover:scale-[.8] rounded-lg transition duration-150 ease-in-out "
                >
                  <CancelSquareIcon />
                </button>
              </div>

              <ul className=" space-y-3 [&_label]:flex [&_label]:items-center [&_label]:gap-3 *:border *:p-3 [&_input]:ml-auto my-4">
                <li>
                  <label>
                    <img
                      alt="pay-stack"
                      src="https://i.ibb.co/QpjxrJj/Paystack.png"
                      width={24}
                      height={23}
                    />
                    <p>Pay Online</p>{" "}
                    <input
                      id="online"
                      type="radio"
                      name="medium"
                      onChange={(e) => setPaymentMethod(e.target.id)}
                    />
                  </label>
                </li>
                <li>
                  <label>
                    <CashIcon /> <p>Pay with Cash (Offline)</p>{" "}
                    <input
                      id="offline"
                      type="radio"
                      name="medium"
                      onChange={(e) => setPaymentMethod(e.target.id)}
                    />
                  </label>
                </li>
              </ul>
              <button
                onClick={() => {
                  if (paymentMethod === "online") return onlinePayment();
                  return offlinePayment();
                }}
                className=" disabled:bg-[#C2C2C2] disabled:cursor-none py-3 text-blue-50 font-semibold w-full bg-[#1f1f1f] hover:bg-[#1f1f1fea] transition duration-150 ease-in-out"
                disabled={!paymentMethod && !loading}
              >
                {loading ? (
                  <ClipLoader
                    color="#fff"
                    loading={loading}
                    size={20}
                    aria-label="Loading Spinner"
                  />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          ) : (
            <SuccessModal
              onClick={() => {
                closeModal();
                handleSuccess();
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

PaymentModals.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
};

const SuccessModal = ({ onClick }) => {
  return (
    <div className=" text-center flex flex-col gap-5">
      <div className="mx-auto w-fit">
        <CheckIcon />
      </div>
      <h2 className="font-semibold text-base text-[#454545] px-10 ">
        Your Ferry Seat has been successfully booked!
      </h2>
      <p className="font-normal text-xs text-[#454545] px-10">
        {/* Please check your email for important ticket details. */}
        Payment will be made on arrival.
      </p>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 transition-all duration-150 ease-in-out text-sm w-full text-white p-3 px-4 font-semibold"
          onClick={onClick}
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  onClick: PropTypes.func,
};
