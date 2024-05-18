import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Twirl as Hamburger } from "hamburger-react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classNames from "classnames";
import {
  FacebookIcon,
  InstagramIcon,
  // LinkedinIcon,
  // TwitterIcon,
} from "./assets/icons/index";
import { GlobalCTX } from "./context/GlobalContext";
import Loader from "./components/animation/Loader";
import Alert_ from "./components/Alert";

function App() {
  const pathname = useLocation();

  React.useEffect(() => {
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="relative overflow-hidden font-poppins">
      <Navbar />
      <main className="min-h-[70vh] bg-blue-950">
        <Outlet />
      </main>
      <Footer />
      <Loader />
      <Alert_ />
    </div>
  );
}

export default App;

const Navbar = () => {
  const [isOpen, setOpen] = React.useState(false);
  const { about, contact, scrollToSection } = React.useContext(GlobalCTX);
  const pathname = useLocation();
  const navigate = useNavigate();
  const navRef = React.useRef();

  const handleNavItemClick = (ref) => {
    setOpen(false);
    if (!String("/").includes(pathname)) {
      navigate("/");
      return setTimeout(() => {
        scrollToSection(ref);
      });
    }
    return scrollToSection(ref);
  };

  // Detect outside navbar click
  window.addEventListener(
    "click",
    (e) => {
      if (isOpen) !navRef.current.contains(e.target) && setOpen(false);
    },
    true
  );

  return (
    <nav
      className={classNames(
        "absolute right-0 left-0 px-5 md:px-20 py-2 text-white flex items-center justify-between backdrop-blur-sm z-[3] transition duration-50 ease-in-out",
        isOpen ? "bg-blue-700 md:bg-[#1111111F]" : "bg-[#1111111F]"
      )}
      ref={navRef}
    >
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
          "top-[77px] md:top-0 right-0 left-0 md:relative flex flex-col md:flex-row *:uppercase *:font-normal gap-x-3 md:bg-transparent text-center *:py-2  bg-blue-700 pb-2 md:pb-0  *:cursor-pointer",
          !isOpen ? "hidden md:flex" : "absolute"
        )}
      >
        <li
          onClick={() => {
            handleNavItemClick(about);
          }}
          className="hover:bg-gray-500/40 md:hover:bg-transparent md:hover:text-gray-800 hover:font-medium md:hover:font-normal transition-all duration-75 ease-in-out "
        >
          about us
        </li>
        <li
          onClick={() => {
            handleNavItemClick(contact);
          }}
          className="hover:bg-gray-500/40 md:hover:bg-transparent md:hover:text-gray-800 hover:font-medium md:hover:font-normal transition-all duration-75 ease-in-out"
        >
          Contact Us
        </li>
      </ul>

      <button className="hidden md:block text-white bg-blue-500 py-3 px-6 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out">
        <Link to={"/booking"}>Book a Ticket</Link>
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
            {/* <a>FAQ</a> */}
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
                {/* <a>FAQ</a> */}
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
          <Link
            target="_blank"
            to="https://www.instagram.com/abittoglobal/?igsh=NjB5dXpnZnI5ejFs"
          >
            <InstagramIcon />
          </Link>
        </li>
        <li>
          <Link target="_blank" to="https://web.facebook.com/abittoglobal/">
            <FacebookIcon />
          </Link>
        </li>
        {/* 
        <li>
          <Link target="_blank" to="https://twitter.com/AbittoGlobal">
            <TwitterIcon />
          </Link>
        </li>
        <li>
          <LinkedinIcon />
        </li> */}
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
