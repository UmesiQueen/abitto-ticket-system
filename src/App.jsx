import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Twirl as Hamburger } from "hamburger-react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classNames from "classnames";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "./assets/icons/index";

function App() {
  const pathname = useLocation();

  React.useEffect(() => {
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="relative overflow-hidden font-poppins">
      <Navbar />
      <main className="min-h-screen bg-blue-950">
        <Outlet />
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
      <Link to="/">
        <img
          alt="logo"
          src="https://i.ibb.co/17zsqj1/logo2.png"
          width={176}
          height={60}
        />
      </Link>

      <div className="md:hidden">
        <Hamburger size={20} toggled={isOpen} toggle={setOpen} />
      </div>

      <ul
        className={classNames(
          "top-[77px] md:top-0 right-0 left-0 md:relative flex flex-col md:flex-row  *:uppercase *:font-normal gap-x-3 bg-inherit md:bg-transparent text-center [&_a]:w-full [&_a]:py-2 [&_a]:inline-block ",
          !isOpen ? "hidden md:flex" : "absolute"
        )}
      >
        <li className="hover:bg-gray-500/40 md:hover:bg-transparent md:hover:text-gray-800 transition duration-75 ease-in-out">
          <Link to="/">about us</Link>
        </li>
        <li className="hover:bg-gray-500/40 md:hover:bg-transparent md:hover:text-gray-800">
          <Link to="/">Career</Link>
        </li>
        <li className="hover:bg-gray-500/40 md:hover:bg-transparent md:hover:text-gray-800">
          <Link to="/">faq</Link>
        </li>
      </ul>

      <button className="hidden md:block bg-green-500 py-3 px-6 font-semibold text-sm  hover:bg-green-700 transition-all duration-100  ease-in-out">
        Contact Us
      </button>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#111111] px-5 py-10 md:px-10 lg:px-20 text-white ">
      <div className=" md:flex justify-between ">
        <Link to="/">
          <img
            src="https://i.ibb.co/17zsqj1/logo2.png"
            alt="logo"
            width={176}
            height={60}
          />
        </Link>

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
              <AccordionDetails sx={{ marginX: "20px" }}>
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
              <AccordionDetails sx={{ marginX: "20px" }}>
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
              <AccordionDetails sx={{ marginX: "20px" }}>
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
