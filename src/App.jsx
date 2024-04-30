import { Twirl as Hamburger } from "hamburger-react";
import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classNames from "classnames";
import {
  FacebookIcon,
  CaretIcon,
  InstagramIcon,
  LinkedinIcon,
  MapIcon,
  TwitterIcon,
  PhoneIcon,
} from "./assets/icons/index";

function App() {
  return (
    <div className="relative overflow-hidden font-poppins">
      <Navbar />

      <main>
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
              Book a Ticket
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
                Lorem ipsum dolor sit amet consectetur. Semper pharetra erat
                enim purus viverra neque aliquam leo non. Ac platea lectus
                sociis ornare condimentum euismod. Euismod pellentesque
                vestibulum tristique at nunc placerat consectetur eu aenean.
                Auctor sagittis urna imperdiet pharetra.
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
                    Lorem ipsum dolor sit amet consectetur. Egestas sapien
                    lectus lobortis sit mattis vitae posuere
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
      </main>

      <Footer />
    </div>
  );
}

export default App;

const Navbar = () => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <nav className="absolute right-0 left-0 px-5 md:px-20 py-2 text-white flex items-center justify-between backdrop-blur-sm bg-[#1111111F] z-[1]">
      <a href="#home">
        <img
          alt="logo"
          src="https://i.ibb.co/17zsqj1/logo2.png"
          width={176}
          height={60}
        />
      </a>

      <div className="md:hidden">
        <Hamburger size={20} toggled={isOpen} toggle={setOpen} />
      </div>

      <ul
        className={classNames(
          "top-[77px] md:top-0 right-0 left-0 md:relative flex flex-col md:flex-row  *:uppercase *:font-semibold gap-x-3 bg-inherit md:bg-transparent text-center [&_a]:w-full [&_a]:py-2 [&_a]:inline-block ",
          !isOpen ? "hidden md:flex" : "absolute"
        )}
      >
        <li className="hover:bg-gray-500/40 md:hover:bg-transparent md:hover:text-gray-800 transition duration-75 ease-in-out">
          <a href="#home">home</a>
        </li>
        <li className="hover:bg-gray-500/40 md:hover:bg-transparent md:hover:text-gray-800">
          <a href="#about-us">about us</a>
        </li>
        <li className="hover:bg-gray-500/40 md:hover:bg-transparent md:hover:text-gray-800">
          <a href="#contact-us">contact us</a>
        </li>
      </ul>

      <button className="hidden md:block bg-green-500 py-3 px-6 font-semibold text-sm  hover:bg-green-700 transition-all duration-100  ease-in-out">
        Get Started
      </button>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#111111] px-5 py-10 md:px-10 lg:px-20 text-white ">
      <div className=" md:flex justify-between ">
        <a href="#home">
          <img
            src="https://i.ibb.co/17zsqj1/logo2.png"
            alt="logo"
            width={176}
            height={60}
          />
        </a>

        <ul className="hidden md:flex gap-x-10 lg:gap-x-28 [&_a]:block [&_a]:mb-2 [&_a]:text-sm [&_a]:font-normal [&_h3]:font-medium [&_h3]:text-2xl [&_h3]:mb-5">
          <li>
            <h3>Company</h3>
            <a>About Us</a>
            <a>Terms of Service</a>
          </li>
          <li>
            <h3>Resources</h3>
            <a>FAQ</a>
            <a>Career</a>
            <a>Videos</a>
          </li>
          <li>
            <h3>Contact Us</h3>
            <a>hi@abitto.com</a>
            <a>Twitter Support</a>
          </li>
        </ul>

        <ul className="md:hidden mt-10 mb-20 [&_a]:block [&_a]:mb-2 [&_a]:text-sm [&_a]:font-normal">
          <li>
            <Accordion
              sx={{
                background: "transparent",
                color: "white",
                boxShadow: "unset",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                sx={{ fontWeight: 500 }}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Company
              </AccordionSummary>
              <AccordionDetails>
                <a>About Us</a>
                <a>Terms of Service</a>
              </AccordionDetails>
            </Accordion>
          </li>
          <li>
            <Accordion
              sx={{
                background: "transparent",
                color: "white",
                boxShadow: "unset",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                sx={{ fontWeight: 500 }}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                Resources
              </AccordionSummary>
              <AccordionDetails>
                <a>FAQ</a>
                <a>Career</a>
                <a>Videos</a>
              </AccordionDetails>
            </Accordion>
          </li>
          <li>
            <Accordion
              sx={{
                background: "transparent",
                color: "white",
                boxShadow: "unset",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                sx={{ fontWeight: 500 }}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                Contact Us
              </AccordionSummary>
              <AccordionDetails>
                <a>hi@abitto.com</a>
                <a>Twitter Support</a>
              </AccordionDetails>
            </Accordion>
          </li>
        </ul>
      </div>

      <ul className="flex items-center gap-3 *:w-10 *:inline-flex *:justify-center">
        <li>
          <InstagramIcon />
        </li>
        <li>
          <FacebookIcon />
        </li>
        <li>
          <TwitterIcon />
        </li>
        <li>
          <LinkedinIcon />
        </li>
      </ul>

      <hr className="my-7" />

      <div className="md:flex justify-between space-y-4 md:space-y-0">
        <p>© 2023 Hello, Abitto</p>

        <ul className="md:flex gap-8 space-y-4 md:space-y-0">
          <li>Privacy</li>
          <li>Terms of Agreement</li>
          <li>Licenses</li>
        </ul>
      </div>
    </footer>
  );
};
