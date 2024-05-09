import React from "react";
import { MapIcon, PhoneIcon, CaretIcon } from "../assets/icons/index";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import WaveSVG from "../assets/wave";
import { GlobalCTX } from "../context/GlobalContext";

const Home = () => {
  const { about, contact } = React.useContext(GlobalCTX);

  return (
    <>
      {/* Hero section */}
      <section
        id="home"
        className="bg-hero-pattern h-screen w-screen bg-cover bg-no-repeat bg-center flex items-center relative "
      >
        <div className="bg-black/40 w-full h-full absolute " />
        <div className="w-[300px] md:w-[440px] pl-5 md:pl-20 space-y-10 z-[1] pt-[78px]">
          <p className="font-semibold text-2xl md:text-[40px] text-white md:leading-10">
            The Easiest & Safest way to travel within Nigeria & Africa
          </p>
          <button className="text-white bg-blue-500 py-3 px-6 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out ">
            <Link to={"/booking"}>Book a Ticket</Link>
          </button>
        </div>
        <div className="hidden md:block">
          <WaveSVG />
        </div>
        <div className="md:hidden bg-blue-50 h-5 w-full absolute bottom-0 left-0 right-0 rounded-t-xl " />
      </section>

      {/* About us  */}
      <section
        className="p-5 md:py-20 md:px-10 lg:px-44 bg-blue-50 relative"
        id="about-us"
        ref={about}
      >
        <div className="flex flex-col md:flex-row justify-between flex-1 ">
          <div className="md:w-1/2 mb-10 md:mb-0 self-center">
            <img
              src="https://i.ibb.co/8BLhcJw/about.jpg"
              alt="about-us"
              width={100}
              height={100}
              className=" md:-rotate-6 w-full md:w-[300px] lg:w-[350px] h-[400px] md:h-[400px] mx-auto"
            />
          </div>
          <div className="md:w-1/2 space-y-5">
            <div className="flex items-center">
              <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
              <h2 className="uppercase font-medium">About us</h2>
            </div>
            <p className="font-medium text-2xl ">
              Welcome to Abitto, where innovation meets reliability in public
              water travel.
            </p>
            <p className="text-black/80">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              At Abitto, we're not just ferrying passengers; we're transforming
              the way you experience water transportation. With a focus on
              cutting-edge technology and unwavering safety protocols, we ensure
              your journey is not only convenient but also intelligent. Join us
              aboard Abitto, where every trip is a testament to our commitment
              to excellence and your peace of mind.
            </p>
            <Link
              target="_blank"
              to="https://abittoglobal.com/?fbclid=PAZXh0bgNhZW0CMTEAAaaf2uWLgUdLwd18fE__CVzgHmX_XRFos7kxw4Ffa5sWyB58fZLwenzHvl8_aem_Af6umzSDXJvWgv1zoBRtzSSytwgTKLgfroif0Z8SpzdPUu-G5NWP8AMOlqscYrrjWJHGjX5_iSPUUMd4IcFzKNIs"
              className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out flex items-center gap-3 cursor-pointer"
            >
              <span className="underline font-medium">Learn more</span>
              <CaretIcon />
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <WaveSVG />
        </div>
      </section>

      {/* Contact us  */}
      <section
        className="py-10 px-5 md:py-20 md:px-10 lg:px-44 bg-white"
        ref={contact}
      >
        <div className="flex flex-col md:flex-row justify-between flex-1">
          <div className="md:w-1/2 flex flex-col md:items-center space-y-5 md:mt-6 mb-16 ">
            <div className="flex items-center md:hidden">
              <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
              <h2 className="uppercase font-medium">Our Location</h2>
            </div>
            <img
              src="https://i.ibb.co/z40PwNW/map.png"
              alt="contact-us"
              width={350}
              height={420}
              className="self-center"
            />
            <ul className="md:w-[350px] px-5 text-lg [&_a]:flex [&_a]:gap-3 [&_a]:items-center space-y-5 ">
              <li>
                <Link
                  className="hover:text-blue-500 duration-150 ease-in-out transition"
                  target="_blank"
                  to="https://maps.google.com/maps/place//data=!4m2!3m1!1s0x10678776d57d673d:0x3a5ca1c3f4f97ad4?entry=s&sa=X&ved=1t:8290&hl=en-US&ictx=111"
                >
                  <MapIcon />
                  <p>Marina Resort, Calabar</p>
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-500 duration-150 ease-in-out transition"
                  to="tel:+234 813 047 8003"
                >
                  <PhoneIcon />
                  <p>+234 813 047 8003</p>
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 space-y-5 relative">
            <div className="flex items-center">
              <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
              <h2 className="uppercase font-medium">Contact us</h2>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [alert, setAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = handleSubmit(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setAlert(true);
      reset();
    }, 1500);

    setTimeout(() => {
      setAlert(false);
    }, 4500);
  });

  return (
    <>
      <form
        className="flex flex-col gap-y-5 *:bg-[#EEEEEE] *:p-2"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        <input
          type="email"
          placeholder="Email address"
          {...register("email", { required: true })}
        />
        <textarea
          rows={8}
          placeholder="Type message here..."
          className=" resize-none"
          {...register("message", { required: true })}
        />
        {Object.keys(errors).length ? (
          <p className="text-xs text-red-700 !bg-transparent">
            All fields are required.
          </p>
        ) : (
          ""
        )}
        <button
          type="submit"
          className=" border-2 border-blue-500 text-blue-500 bg-blue-50 hover:border-blue-700 hover:text-blue-700 py-3 px-6 font-semibold text-sm !bg-transparent self-start transition-all duration-150 ease-in-out"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
      {alert && (
        <div className="fixed top-0 w-fit left-0 right-0 mx-auto ">
          <Alert
            variant="outlined"
            className=" backdrop-blur"
            sx={{
              color: "#fff",
              borderColor: "#244891",
              borderWidth: "2px",
              backgroundColor: "#3366CC83",
              "& .MuiAlert-icon": { color: "#fff" },
            }}
            severity="info"
          >
            Request sent successfully.
          </Alert>
        </div>
      )}
    </>
  );
};
