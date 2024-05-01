import { MapIcon, PhoneIcon, CaretIcon } from "../assets/icons/index";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Hero section */}
      <section
        id="home"
        className="bg-hero-pattern h-screen w-screen bg-cover bg-no-repeat bg-center flex items-center relative "
      >
        <div className="bg-black/40 w-full h-full absolute " />
        <div className="w-[300px] md:w-[440px] pl-5 md:pl-20 space-y-10 z-[1]">
          <p className="font-semibold text-2xl md:text-[40px] text-white md:leading-10">
            The Easiest & Safest way to travel within Nigeria & Africa
          </p>
          <button className="border-2 border-green-500 text-green-500 py-3 px-6 font-semibold text-sm  hover:border-green-300 hover:text-green-300 transition-all duration-100  ease-in-out ">
            <Link to={"/booking"}>Book a Ticket</Link>
          </button>
        </div>
      </section>
      {/* About us  */}
      <section
        className="p-5 md:py-20 md:px-10 lg:px-44 bg-blue-50"
        id="about-us"
      >
        <div className="flex flex-col md:flex-row justify-between flex-1 ">
          <div className="md:w-1/2 mb-10 md:mb-0 self-center">
            <img
              src="https://i.ibb.co/8BLhcJw/about.jpg"
              alt="about-us"
              width={100}
              height={100}
              className=" md:-rotate-6 w-full md:w-[300px] lg:w-[350px] h-[400px] md:h-[400px]"
            />
          </div>
          <div className="md:w-1/2 space-y-5">
            <div className="flex items-center">
              <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
              <h2 className="uppercase font-medium">About us</h2>
            </div>

            <p className="font-medium text-2xl ">
              We offer comprehensive range of stand-alone and integrated
              services on time and on budget.
            </p>
            <p className="text-black/80">
              Lorem ipsum dolor sit amet consectetur. Semper pharetra erat enim
              purus viverra neque aliquam leo non. Ac platea lectus sociis
              ornare condimentum euismod. Euismod pellentesque vestibulum
              tristique at nunc placerat consectetur eu aenean. Auctor sagittis
              urna imperdiet pharetra.
            </p>
            <a className="text-blue-500 flex items-center gap-3 cursor-pointer">
              <span className="underline font-medium">Learn more</span>
              <CaretIcon />
            </a>
          </div>
        </div>
      </section>
      {/* Contact us  */}
      <section
        className="py-10 px-5 md:py-20 md:px-10 lg:px-44"
        id="contact-us"
      >
        <div className="flex flex-col md:flex-row justify-between flex-1">
          <div className="md:w-1/2 flex flex-col md:items-center space-y-5 mb-16 ">
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
            <ul className="md:w-[350px] px-5  text-lg [&_li]:flex [&_li]:gap-3 [&_li]:items-center space-y-5 ">
              <li>
                <MapIcon />
                <p className="">
                  Lorem ipsum dolor sit amet consectetur. Egestas sapien lectus
                  lobortis sit mattis vitae posuere
                </p>
              </li>
              <li>
                <PhoneIcon />
                <p>+234 XXXX XXX XXXX</p>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 space-y-5">
            <div className="flex items-center">
              <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
              <h2 className="uppercase font-medium">Contact us</h2>
            </div>
            <form className="flex flex-col gap-y-5 *:bg-[#EEEEEE] *:p-2">
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email address" />
              <textarea
                rows={8}
                placeholder="Type message here..."
                className=" resize-none"
              />
              <button className=" border-2 border-green-500 text-green-500 py-3 px-6 font-semibold text-sm !bg-transparent self-start">
                Send Request
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* Extra */}
      <section className="w-full h-[300px] flex md:flex-row-reverse items-center bg-boat bg-cover bg-no-repeat bg-center relative text-white">
        <div className="w-full h-full bg-gradient-to-b from-white/0 from-50% to-blue-500/40 absolute z-[1]" />
        <div className="bg-black/80 w-full h-full absolute" />
        <div className="md:w-1/2 z-[1] pl-5 md:pl-0">
          <p className="font-semibold text-2xl mb-8">
            Get started on your <br /> journey with us today!
          </p>
          <button className="bg-green-500 py-3 px-6 font-semibold text-sm hover:bg-green-700 transition-all duration-100 ease-in-out">
            Get Started
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;
