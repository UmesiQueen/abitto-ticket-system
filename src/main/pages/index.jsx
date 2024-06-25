import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import PropTypes from "prop-types";
// import WaveSVG from "@/assets/wave";
import { MapIcon, PhoneIcon, CaretIcon, BoatIcon } from "@/assets/icons";
import {
  rentalBoat,
  rentalBoat2,
  rentalBoat3,
  marinaMap,
  timberMap,
} from "@/assets/images";
import { GlobalCTX } from "@/contexts/GlobalContext";
import FadeInBackgroundTransition from "@/components/animation/FadeIn";
import Button from "@/components/custom/Button";
import { cn } from "@/lib/utils";

const Home = () => {
  const { about, contact } = React.useContext(GlobalCTX);
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Home | Abitto Ferry</title>
      </Helmet>
      {/* Hero section */}
      <section
        id="home"
        className="h-[670px] md:h-screen w-full flex items-center relative bg-blue-700"
      >
        <div className="bg-black/40 w-full h-full absolute z-[1] " />
        <FadeInBackgroundTransition />
        <div className="w-[250px] md:w-[600px] ml-5 md:ml-20 space-y-10 z-[2] pt-[78px]">
          <p className="font-semibold text-2xl md:text-[50px] text-white md:leading-[60px]  ">
            The Easiest & Safest way to travel within Nigeria & Africa
          </p>
          <Button
            text="Book a Ticket"
            onClick={() => {
              navigate("/booking");
            }}
            className="px-6"
          />
        </div>
        {/* <div className="hidden md:block z-[2]">
          <WaveSVG />
        </div> */}
        {/* <div className="md:hidden bg-blue-50 h-5 w-full absolute z-[2] bottom-0 left-0 right-0 rounded-t-xl " /> */}
      </section>

      {/* About us  */}
      <section className="px-5 py-20 md:px-20" id="about-us" ref={about}>
        <div className="flex flex-col md:flex-row justify-between md:gap-20 lg:gap-28">
          <div className="basis-2/6 mb-10 md:mb-0 self-center">
            <img
              src="https://i.ibb.co/8BLhcJw/about.jpg"
              alt="about-us"
              width={100}
              height={100}
              className="rounded-lg shadow-2xl w-full md:w-[500px] h-[300px] md:h-[400px] "
            />
          </div>
          <div className=" flex-1 space-y-5 lg:pr-44">
            <div className="flex items-center">
              <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
              <h3 className="uppercase font-medium">About us</h3>
            </div>
            <p className="font-medium text-2xl ">
              Welcome to Abitto, where innovation meets reliability in public
              water travel.
            </p>
            <p className="text-black/80 ">
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
        {/* <div className="hidden md:block">
          <WaveSVG />
        </div> */}
      </section>

      {/* Youtube video */}
      <section className="bg-white flex justify-center px-5 pb-20 md:p-20">
        <div className="w-full bg-black rounded-lg overflow-hidden ">
          {/* <div className="flex flex-col items-center w-full "> */}
          {/* <h3 className="self-start uppercase font-semibold mb-6 text-lg md:text-xl ">
            At Abitto, Your Safety is our priority
          </h3> */}
          <iframe
            width="560"
            height="560"
            src="https://www.youtube.com/embed/oKqH4VeBtD4?si=S_XWOUBpzK6LS_WN"
            title="At Abitto, Your Safety is our priority"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full aspect-video h-full lg:h-[560px] "
          />
          {/* <p className="self-start text-sm font-medium text-gray-500 mt-4">
            Safety instructions for Abitto ferry services.
          </p> */}
        </div>
      </section>

      {/* Rental service */}
      <section className=" px-5 pb-20 md:p-20">
        <hgroup className="text-center space-y-2">
          <h2 className="font-semibold text-xl md:text-2xl">
            Boat Rental Package
          </h2>
          <p className="text-xs md:text-sm">
            Choose from our range of boat rental packages.
          </p>
        </hgroup>

        <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 text-sm md:text-base ">
          <div className="space-y-6">
            <img
              src={rentalBoat}
              alt="rental"
              className="rounded-lg h-[300px] w-full object-cover"
            />
            <div className="flex justify-between gap-3 items-end px-3">
              <div>
                <p>
                  <strong>₦150,000.00</strong> / day
                </p>
                <p>Rent Within Marina</p>
              </div>
              <Button text="Select" className="px-5" />
            </div>
          </div>

          <div className="space-y-6">
            <img
              src={rentalBoat2}
              alt="rental"
              className="rounded-lg h-[300px] w-full object-cover"
            />
            <div className="flex justify-between gap-3 items-end px-3">
              <div>
                <p>
                  <strong>₦300,000.00</strong> / day
                </p>
                <p>Rent From Uyo - Calabar</p>
              </div>
              <Button text="Select" className="px-5" />
            </div>
          </div>

          <div className="space-y-6">
            <img
              src={rentalBoat3}
              alt="rental"
              className="rounded-lg h-[300px] w-full object-cover"
            />
            <div className="flex justify-between gap-3 items-end px-3">
              <div>
                <p>
                  <strong>₦300,000.00</strong> / day
                </p>
                <p>Rent From Calabar - Uyo</p>
              </div>
              <Button text="Select" className="px-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 px-5 md:px-20 bg-blue-50 space-y-8">
        <hgroup className="text-center space-y-2">
          <h2 className="font-semibold text-xl md:text-2xl">
            Clients Testimonials
          </h2>
          <p className="text-xs md:text-sm">
            {"Here's"} what some of them are saying.
          </p>
        </hgroup>
        <div className="flex gap-8 mx-auto overflow-auto no-scrollbar snap-x snap-mandatory">
          {Testimonials.map((item) => (
            <CarouselItem key={item.id} {...item} />
          ))}
        </div>
        <div>
          {/* TODO: Add functionality to this section */}
          <div className="flex gap-2 items-center ">
            <div className="flex items-center gap-2">
              {Array.from({ length: Testimonials.length }).map((_, index) => (
                <div
                  key={index}
                  className={cn("w-2 h-2 bg-white shadow-sm rounded-full", {
                    "bg-black": index + 1 === 1,
                  })}
                />
              ))}
            </div>
            <button className="w-10 h-10 rounded-full bg-white font-bold text-xl inline-flex items-center justify-center ml-auto">
              <span>←</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-xl inline-flex items-center justify-center">
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Contact us  */}
      <section className="py-20 px-5 md:px-20" ref={contact} id="contact-us">
        <h2 className="font-semibold text-xl md:text-2xl text-center mb-7">
          Contact Us
        </h2>
        <div className="flex flex-col-reverse md:flex-row gap-10 lg:gap-16 justify-between ">
          <div className="flex flex-col flex-1">
            <div className="flex items-center md:hidden mb-5">
              <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
              <h3 className="uppercase font-medium">Our Location</h3>
            </div>

            {/* Calabar */}
            <div className="lg:flex gap-8 mb-10 md:bg-blue-50 p-0 md:p-5 rounded-lg">
              <Link
                target="_blank"
                to="https://maps.google.com/maps/place//data=!4m2!3m1!1s0x10678776d57d673d:0x3a5ca1c3f4f97ad4?entry=s&sa=X&ved=1t:8290&hl=en-US&ictx=111"
              >
                <img
                  src={marinaMap}
                  alt="contact-us"
                  className="lg:flex-1 self-start mb-8 lg:mb-0 h-[200px] w-full rounded-lg shadow-lg object-cover"
                />
              </Link>
              <ul className="lg:flex-1 text-sm [&_a]:flex [&_a]:gap-3 [&_a]:items-center space-y-7 ">
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
            <div className="lg:flex gap-8 md:bg-blue-50 rounded-lg  p-0 md:p-5 ">
              <Link
                target="_blank"
                to="https://www.google.com/maps/dir//520106+Nwaniba+Road,+Uyo+520106,+Akwa+Ibom/@5.0557182,7.9578196,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x105d5813586afc87:0x6734e8be23eaf5d8!2m2!1d8.0402216!2d5.0557234?entry=ttu"
              >
                <img
                  src={timberMap}
                  alt="contact-us"
                  className="lg:flex-1 self-start mb-8 lg:mb-0 h-[200px] w-full rounded-lg shadow-lg object-cover"
                />
              </Link>
              <ul className="lg:flex-1 text-sm [&_a]:flex [&_a]:gap-3 [&_a]:items-center space-y-7 ">
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
          <div className="flex-1 md:bg-blue-50 rounded-lg p-0 md:p-5 w-full self-start lg:self-stretch">
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
  const [loading, setLoading] = React.useState(false);

  const onSubmit = handleSubmit((formData) => {
    setLoading(true);
    // const BASE_URL = import.meta.env.DEV ?
    //   import.meta.env.VITE_ABITTO_BASE_URL
    //   : import.meta.env.ABITTO_BASE_URL;

    axios
      .post("https://abitto-api.onrender.com/api/email/contact", formData)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          toast.success("Request sent successfully.");
          reset();
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Request failed. Please try again later.");
      });
  });

  return (
    <>
      <form
        className="flex flex-col gap-y-5 *:p-3 *:rounded-lg h-full *:bg-[#EEEEEE] md:*:bg-white [&>*:not(&_button)]:shadow-md"
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
          rows={10}
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
        <Button
          variant="outline"
          type="submit"
          loading={loading}
          text={"Send Request"}
          className="w-full md:w-40 !mt-auto"
        />
      </form>
    </>
  );
};

const Testimonials = [
  {
    id: 1,
    name: "Jennifer",
    imgUrl: "https://i.ibb.co/GT9fdRX/Jeniffer-Client.png",
    review:
      "Absolutely delightful experience! The ferry was clean and comfortable, and the views during the ride were breathtaking. Will definitely be using this Abitto ferry again.",
  },
  {
    id: 2,
    name: "Mr.Kalu",
    imgUrl: "https://i.ibb.co/Tqv0zDR/Mr-kalu-Client.jpg",
    review:
      "Such a relaxing way to travel! I took the ferry with my family and we all loved it. A fantastic option for anyone looking to avoid the hassle of traffic and enjoy the journey.",
  },
];

const CarouselItem = ({ review, name, imgUrl }) => {
  return (
    <div className="snap-always snap-start min-w-[500px] h-[306px] p-8 bg-white rounded-lg flex flex-col gap-3 items-start">
      <span className="font-bold text-4xl">“</span>
      <p className="font-medium text-base w-3/4 ">{review}</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-12 aspect-square rounded-full bg-blue-500 overflow-hidden ring-black ring-1">
          <img src={imgUrl} alt="profile" className="min-w-full " />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold ">{name}</h3>
          <p className="font-medium text-[#606060]">Client</p>
        </div>
      </div>
    </div>
  );
};

CarouselItem.propTypes = {
  review: PropTypes.string,
  name: PropTypes.string,
  imgUrl: PropTypes.string,
};
