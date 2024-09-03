import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
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
import LogoSVG from "@/assets/icons/abitto.svg";
import Loader from "@/components/animation/Loader";
import { InformationModal } from "@/admin/pages/information-box";
import baseurl from "@/api";

const MainLayout = () => {
	const { setLiveMessage } = React.useContext(GlobalCTX);

	React.useEffect(() => {
		baseurl
			.get("infobox/get")
			.then((res) => {
				if (res.status == 200) {
					const data = res.data.infoBoxes
					setLiveMessage(data.filter((message) => message.status == "Active")[0])
				}
			})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<div className="relative">
				<Navbar />
				<main className="h-full min-h-[calc(100vh-294px)]">
					<Outlet />
				</main>
				<Footer />
			</div>
			<Loader />
			<InformationModal />
		</>
	);
};

export default MainLayout;

const Navbar = () => {
	const [isOpen, setOpen] = React.useState(false);
	const [scroll, setScroll] = React.useState(false);
	const { contact, faq, scrollToSection } =
		React.useContext(GlobalCTX);
	const location = useLocation();
	const navRef = React.useRef();

	const handleNavItemClick = (ref) => {
		if (isOpen) setOpen(false);
		setTimeout(() => {
			scrollToSection(ref);
		});
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

	const isActive = (slug) => {
		if (location.hash.length) {
			if (slug.includes(location.hash))
				return "active";
			return;
		}
		if (location.pathname == slug) return "active";
	}

	return (
		<nav
			className={cn(
				"fixed right-0 left-0 px-5 md:px-20 min-h-[67px] w-full flex items-center text-white backdrop-blur-[3px] z-[3] bg-[#111111]/80",
				{
					"bg-transparent": ["/", "/about"].includes(location.pathname),
					"bg-[#111111]/80": isOpen || scroll,
				}
			)}
			ref={navRef}
		>
			<div className="max-w-[1440px] mx-auto h-full w-full flex flex-wrap items-center justify-between">
				<Link to="/" onClick={closeNavbar}>
					<img
						alt="logo"
						src={LogoSVG}
						width={176}
						height={60}
						className="w-36 md:w-44 h-12"
					/>
				</Link>
				<div className="md:hidden">
					<Hamburger size={20} toggled={isOpen} toggle={setOpen} />
				</div>
				<ul
					className={cn(
						"top-[67px] md:top-0 right-0 left-0 absolute md:relative md:ml-auto overflow-hidden flex flex-col md:flex-row shadow-lg md:shadow-none gap-x-6 md:bg-transparent h-screen md:h-fit bg-white text-black md:text-white transition-all duration-300 ease-in-out",
						{ "h-0 ": !isOpen }
					)}
				>
					{[
						["Home", "/"],
						["About", "/about"],
						["Contact", "/#contact"],
						["Book Trip", "/booking"],
						["Rent Boat", "/rental"],
						["Get Quote", "/get-quote"],
						["FAQ", "/#faq"],
					].map(([title, slug]) => {
						return (
							<li
								key={title}
								data-state={isActive(slug)}
								className="hover:bg-gray-400/20 md:hover:bg-transparent md:hover:text-blue-500 font-normal data-[state=active]:font-bold text-center md:text-left transition-all duration-75 ease-in-out text-lg  md:text-base h-20 md:h-fit tracking-wide *:inline-flex *:items-center *:w-full *:h-full *:justify-center"
							>
								<Link
									to={slug}
									onClick={() => {
										closeNavbar();
										if (title == "FAQ") handleNavItemClick(faq);
										if (title == "Contact") handleNavItemClick(contact);
									}}
								>
									{title}
								</Link>
							</li>
						);
					})}
				</ul>
				{/* <Button
					text="Get Started"
					onClick={() => {
						handleNavItemClick(services);
						navigate("/#services");
					}}
					className="hidden md:block px-6"
				/> */}
			</div>
		</nav>
	);
};

const Footer = () => {
	const { faq, scrollToSection } = React.useContext(GlobalCTX);

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
					<ul className="hidden md:flex gap-x-10 lg:gap-x-20 [&_a]:block [&_a]:mb-2 [&_a]:text-sm [&_a]:font-normal [&_h3]:font-medium [&_h3]:text-2xl [&_h3]:mb-5">
						<li>
							<h3>Company</h3>
							<Link to="/about">About Us</Link>
							<Link to="/#faq" onClick={() => setTimeout(() => scrollToSection(faq))}>FAQ</Link>
						</li>
						{/* <li>
							<h3>Resources</h3>
							<a>Career</a>
							<a>Videos</a>
						</li> */}
						<li>
							<h3>Contact Us</h3>
							<a
								href="mailto:info.abittoferryservices@gmail.com"
								className="hover:text-blue-500 transition ease-in-out"
							>
								info.abittoferryservices@gmail.com
							</a>
							<ul className="flex items-center gap-5 *:inline-flex *:items-center">
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
							</ul>
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
									<Link to="/#faq" onClick={() => setTimeout(() => scrollToSection(faq))}>FAQ</Link>
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
									<ul className="flex items-center gap-5 *:inline-flex *:items-center">
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
									</ul>
								</AccordionDetails>
							</Accordion>
						</li>
					</ul>
				</div>
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
					<ul className="md:flex gap-8 space-y-4 md:space-y-0 text-sm md:text-base">
						<li><Link to="/privacy-policy">Privacy Policy</Link></li>
						<li><Link to="/terms-conditions">Terms of Agreement</Link></li>
						{/* <li>Licenses</li> */}
					</ul>
				</div>
			</div>
		</footer>
	);
};
