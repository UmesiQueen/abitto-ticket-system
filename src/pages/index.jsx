import React from "react";
import { MapIcon, PhoneIcon, CaretIcon, BoatIcon } from "@/assets/icons/index";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import WaveSVG from "@/assets/wave";
import { GlobalCTX } from "@/hooks/GlobalContext";
import axios from "axios";
import FadeInBackgroundTransition from "@/components/animation/FadeIn";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { about, contact } = React.useContext(GlobalCTX);

  return (
    <>
      <Helmet>
        <title>Abitto Ferry - Home</title>
      </Helmet>
      {/* Hero section */}
      <section
        id="home"
        className=" h-screen w-full flex items-center relative "
      >
        <div className="bg-black/40 w-full h-full absolute z-[1] " />

        <FadeInBackgroundTransition />

        <div className="w-[300px] md:w-[440px] pl-5 md:pl-20 space-y-10 z-[2] pt-[78px]">
          <p className="font-semibold text-2xl md:text-[40px] text-white md:leading-10">
            The Easiest & Safest way to travel within Nigeria & Africa
          </p>
          <button className="text-white bg-blue-500 py-3 px-6 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out ">
            <Link to={"/booking"}>Book a Ticket</Link>
          </button>
        </div>
        <div className="hidden md:block z-[2]">
          <WaveSVG />
        </div>
        <div className="md:hidden bg-blue-50 h-5 w-full absolute z-[2] bottom-0 left-0 right-0 rounded-t-xl " />
      </section>

      {/* About us  */}
      <section
        className="p-5 md:py-20 md:pb-28 md:px-10 lg:px-32  bg-blue-50 relative"
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

      {/* Youtube video */}
      <section className="bg-white flex justify-center pt-10">
        <div className="flex flex-col items-center px-5 md:px-0 w-full md:w-fit">
          <h3 className="self-start uppercase font-semibold mb-6 text-lg md:text-xl ">
            At Abiito, Safety is our priority
          </h3>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/oKqH4VeBtD4?si=S_XWOUBpzK6LS_WN"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowfullscreen
            className="w-full aspect-video "
          />
          <p className="self-start text-sm font-medium text-gray-500 mt-4">
            Safety instructions for Abitto ferry services.
          </p>
        </div>
      </section>

      {/* Contact us  */}
      <section
        className="py-10 px-5 md:py-20 md:px-10 lg:px-32 bg-white"
        ref={contact}
      >
        <div className="flex flex-col md:flex-row md:gap-5 lg:gap-10 justify-between ">
          <div className="md:w-1/2 flex flex-col space-y-5 md:mt-6 mb-16 flex-1">
            <div className="flex items-center md:hidden">
              <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
              <h2 className="uppercase font-medium">Our Location</h2>
            </div>

            {/* Calabar */}
            <div className="lg:flex gap-8 !mb-5 lg:mb-0">
              <img
                src="https://i.ibb.co/T46yDpf/Marina.png"
                alt="contact-us"
                width={350}
                height={420}
                className="self-start mb-8 lg:mb-0 w-full lg:w-1/2 "
              />
              <ul className="text-sm [&_a]:flex [&_a]:gap-3 [&_a]:items-center space-y-5 ">
                <li className="flex gap-3 items-center">
                  <span>
                    <BoatIcon />
                  </span>
                  <p className="font-medium">Calabar ferry Terminal</p>
                </li>
                <li>
                  <Link
                    className="hover:text-blue-500 duration-150 ease-in-out transition"
                    to="tel:+234 813 047 8003"
                  >
                    <span>
                      <PhoneIcon />
                    </span>
                    <p>+234 813 047 8003</p>
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-blue-500 duration-150 ease-in-out transition"
                    target="_blank"
                    to="https://maps.google.com/maps/place//data=!4m2!3m1!1s0x10678776d57d673d:0x3a5ca1c3f4f97ad4?entry=s&sa=X&ved=1t:8290&hl=en-US&ictx=111"
                  >
                    <span>
                      <MapIcon />
                    </span>
                    <p>Marina Resort, Calabar</p>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Uyo */}
            <div className="lg:flex gap-8 !mb-5 lg:mb-0">
              <img
                src="https://i.ibb.co/wCRvwCG/Ibom-icon.png"
                alt="contact-us"
                width={350}
                height={420}
                className="self-start mb-8 lg:mb-0 w-full lg:w-1/2 "
              />
              <ul className="text-sm [&_a]:flex [&_a]:gap-3 [&_a]:items-center space-y-5 ">
                <li className="flex gap-3 items-center">
                  <span>
                    <BoatIcon />
                  </span>
                  <p className="font-medium">Uyo ferry Terminal</p>
                </li>
                <li>
                  <Link
                    className="hover:text-blue-500 duration-150 ease-in-out transition"
                    to="tel:+234 813 047 8003"
                  >
                    <span>
                      <PhoneIcon />
                    </span>
                    <p>+234 813 047 8003</p>
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-blue-500 duration-150 ease-in-out transition"
                    target="_blank"
                    to="https://www.google.com/maps/dir//520106+Nwaniba+Road,+Uyo+520106,+Akwa+Ibom/@5.0557182,7.9578196,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x105d5813586afc87:0x6734e8be23eaf5d8!2m2!1d8.0402216!2d5.0557234?entry=ttu"
                  >
                    <span>
                      <MapIcon />
                    </span>
                    <p>
                      Nwaniba Timber Beach, Uruan, Behind Ibom Icon Resort, Uyo
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:w-1/2 space-y-5 relative">
            <div className="flex items-center">
              <span className="h-3 w-3 mr-3 rounded-full bg-blue-500" />
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
  const { handleAlert } = React.useContext(GlobalCTX);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = handleSubmit((formData) => {
    setLoading(true);

    axios
      .post("https://abitto-api.onrender.com/api/email/contact", formData)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          handleAlert("success");
          reset();
        }
      })
      .catch((err) => {
        setLoading(false);
        handleAlert("error");
        console.error(err, "Error occurred!");
      });
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
    </>
  );
};
