import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Twirl as Hamburger } from "hamburger-react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  // LinkedinIcon,
  // TwitterIcon,
} from "@/assets/icons/index";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import LogoSVG from "@/assets/icons/abitto.svg";

const MainLayout = () => {
  return (
    <div className="relative">
      <Navbar />
      <main className="h-full min-h-[calc(100vh-294px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

const Navbar = () => {
  const [isOpen, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState(false);
  const { contact, scrollToSection } = React.useContext(GlobalCTX);
  const { pathname } = useLocation();
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
    (event) => {
      if (isOpen) !navRef.current?.contains(event.target) && setOpen(false);
    },
    true
  );

  window.addEventListener("scroll", () => {
    if (window.scrollY >= 1) {
      setOpen(false);
      setScroll(true);
    } else setScroll(false);
  });

  const closeNavbar = () => {
    if (isOpen) setOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed right-0 left-0 px-5 md:px-20 h-[67px] w-full text-white backdrop-blur-[1px] z-[3] bg-[#111111]/80",
        {
          "bg-transparent": ["/", "/about"].includes(pathname),
          "bg-[#111111]/80": isOpen || scroll,
        }
      )}
      ref={navRef}
    >
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
        <Link to="/" onClick={closeNavbar}>
          <img
            alt="logo"
            src={LogoSVG}
            width={176}
            height={60}
            className="w-36 md:w-44"
          />
        </Link>
        <div className="md:hidden">
          <Hamburger size={20} toggled={isOpen} toggle={setOpen} />
        </div>
        <ul
          className={cn(
            "top-[67px] md:top-0 right-0 left-0 absolute md:relative  overflow-hidden flex flex-col md:flex-row shadow-lg md:shadow-none *:md:uppercase *:font-normal gap-x-6 md:bg-transparent h-[178.4px] md:h-fit *:px-5 bg-white text-black md:text-white *:cursor-pointer transition-all duration-300 ease-in-out",
            { "h-0 ": !isOpen }
          )}
        >
          <li
            data-state={pathname == "/about" ? "active" : ""}
            className="hover:bg-gray-400/20 md:hover:bg-transparent md:hover:text-blue-500  data-[state=active]:font-medium *:border-t *:md:border-none *:md:py-0  *:py-3  *:block md:hover:font-normal transition-all duration-75 ease-in-out text-sm md:text-base"
          >
            <Link to="/about" onClick={closeNavbar}>
              About Us
            </Link>
          </li>
          <li
            onClick={() => {
              handleNavItemClick(contact);
            }}
            data-state={pathname == "/contact" ? "active" : ""}
            className="hover:bg-gray-400/20 md:hover:bg-transparent md:hover:text-blue-500 data-[state=active]:font-medium  *:border-t *:md:border-none *:md:py-0  *:py-3   *:block md:hover:font-normal transition-all duration-75 ease-in-out text-sm md:text-base"
          >
            <p>Contact Us</p>
          </li>
          <li
            data-state={pathname == "/booking" ? "active" : ""}
            className="md:hidden hover:bg-gray-400/20 md:hover:bg-transparent md:hover:text-blue-500  data-[state=active]:font-medium *:border-t *:md:border-none *:md:py-0  *:py-3  *:block md:hover:font-normal transition-all duration-75 ease-in-out text-sm md:text-base"
          >
            <Link to="/booking" onClick={closeNavbar}>
              Book a Trip
            </Link>
          </li>
          <li
            data-state={pathname == "/rental" ? "active" : ""}
            className="md:hidden hover:bg-gray-400/20 md:hover:bg-transparent md:hover:text-blue-500  data-[state=active]:font-medium *:border-t *:md:border-none *:md:py-0  *:py-3  *:block md:hover:font-normal transition-all duration-75 ease-in-out text-sm md:text-base"
          >
            <Link to="/rental" onClick={closeNavbar}>
              Rent a Boat
            </Link>
          </li>
        </ul>
        <Button
          text="Book a Ticket"
          onClick={() => {
            navigate("/booking");
          }}
          className="hidden md:block px-6"
        />
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#111111] px-5 py-10 md:px-10 lg:px-20 text-white ">
      <div className="max-w-[1440px] mx-auto">
        <div className=" md:flex justify-between gap-x-5 ">
          <Link to="/">
            <img
              src={LogoSVG}
              alt="logo"
              width={176}
              height={60}
              className="w-36 md:w-44"
            />
          </Link>
          <ul className="hidden md:flex gap-x-10 lg:gap-x-28 [&_a]:block [&_a]:mb-2 [&_a]:text-sm [&_a]:font-normal [&_h3]:font-medium [&_h3]:text-2xl [&_h3]:mb-5">
            <li>
              <h3>Company</h3>
              <Link to="/about">About Us</Link>
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
              <a
                href="mailto:info.abittoferryservices@gmail.com"
                className="hover:text-blue-500 transition ease-in-out"
              >
                info.abittoferryservices@gmail.com
              </a>
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
                  <Link to="/about">About Us</Link>
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
                  <a
                    href="mailto:info.abittoferryservices@gmail.com"
                    className="hover:text-blue-500 transition ease-in-out"
                  >
                    info.abittoferryservices@gmail.com
                  </a>
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
        <div className="flex flex-col-reverse  gap-4 md:flex-row md:justify-between md:space-y-0">
          <p className="text-xs mt-5 md:text-sm md:mt-0">
            Developed by{" "}
            <a
              href="https://lifewithallin.com/"
              target="_blank"
              className="border-b pb-[2px] hover:text-blue-500 hover:border-blue-500 transition ease-in-out"
            >
              All-in Technologies
            </a>
          </p>
          <ul className="md:flex gap-8 space-y-4 md:space-y-0">
            <li>Privacy</li>
            <li>Terms of Agreement</li>
            <li>Licenses</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
