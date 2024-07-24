import { CircleArrowLeftIcon } from "@/assets/icons";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

const CustomerHistory = () => {
  const navigate = useNavigate();
  const { customerID } = useParams();
  console.log(customerID, "param");

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
      </div>
    </>
  );
};

export default CustomerHistory;
