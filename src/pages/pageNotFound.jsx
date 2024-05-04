import { Link } from "react-router-dom";
const PageNotFound = () => {
  return (
    <div className="h-[70vh] flex flex-col justify-center items-center ">
      <h1 className="font-bold text-4xl my-10 text-slate-900 ">
        Page Not Found.
      </h1>
      <button className=" bg-green-500 py-3 px-6 font-semibold text-sm  hover:bg-green-700 transition-all duration-100  ease-in-out hover:scale-[1.1] text-white mt-5">
        <Link to={"/"}>Go Home</Link>
      </button>
    </div>
  );
};

export default PageNotFound;
