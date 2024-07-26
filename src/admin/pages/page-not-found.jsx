import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const PageNotFoundAdmin = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <div className="h-[70vh] flex flex-col justify-center items-center ">
        <h1 className="font-bold text-4xl my-10 text-slate-900 ">
          Page Not Found.
        </h1>
        <button
          onClick={() => {
            navigate(-1);
          }}
          className=" bg-green-500 py-3 px-6 font-semibold text-sm  hover:bg-green-700 transition-all duration-100  ease-in-out hover:scale-[1.1] text-white mt-5"
        >
          Return
        </button>
      </div>
    </>
  );
};

export default PageNotFoundAdmin;
