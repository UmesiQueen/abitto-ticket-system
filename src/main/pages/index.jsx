import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import {
	MapIcon,
	PhoneIcon,
	CaretIcon,
	BoatIcon,
	ArrowIcon,
} from "@/assets/icons";
import { marinaMap, timberMap } from "@/assets/images";
import { GlobalCTX } from "@/contexts/GlobalContext";
// import FadeInBackgroundTransition from "@/components/animation/FadeIn";
import Button from "@/components/custom/Button";
import { cn } from "@/lib/utils";
import HeroGIF from "@/assets/hero.gif";
import CountUp from "react-countup";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import SuccessModal from "@/components/modals/success";

const Home = () => {
	const { contact } = React.useContext(GlobalCTX);
	const navigate = useNavigate();

	return (
		<>
			<Helmet>
				<title>Home | Abitto Ferry</title>
				<link rel="canonical" href="https://www.abittoferry.com/" />
				<meta property="og:title" content="Home - Abitto Ferry" />
				<meta
					property="og:description"
					content="Experience the easiest and safest water travel with our well-maintained fleet, ensuring safety, comfort, and timely departures…"
				/>
			</Helmet>
			{/* Hero section */}
			<section
				id="home"
				className="min-h-[670px] h-screen w-full relative bg-blue-700"
			>
				<div className="bg-black/40 w-full h-full absolute z-[1] " />
				<img
					src={HeroGIF}
					alt="hero"
					className="w-full h-full absolute object-cover"
				/>
				{/* <FadeInBackgroundTransition /> */}
				<div className=" px-5 md:px-20 z-[2] relative h-full">
					<div className="max-w-[1440px] mx-auto h-full flex items-center">
						<div className="w-[400px] mx-auto md:mx-0 md:w-[600px] space-y-10">
							<p className="font-semibold text-center md:text-left text-[30px] md:text-[50px] text-white md:leading-[60px]  ">
								Experience the Easiest & Safest Water Travel Across Nigeria &
								Africa with Abitto
							</p>
							<div className="flex flex-col md:flex-row items-center gap-5">
								<Button
									text="Book a Ticket"
									onClick={() => {
										navigate("/booking");
									}}
									className="w-40"
								/>
								<Button
									text="Rent a Boat"
									onClick={() => {
										navigate("/rental");
									}}
									variant="outline"
									className="w-40 border-white !text-white hover:!text-blue-700 hover:!bg-blue-100"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* About us  */}
			<section className="px-5 pb-20 md:px-20 bg-white" id="about-us">
				<div className="max-w-[1440px] mx-auto pt-5">
					<ul className="flex gap-10 justify-between md:justify-center p-5 pb-20 text-center font-semibold [&_p:last-of-type]:font-normal  text-xl [&_p:last-of-type]:text-xs items-center">
						<li className="hidden md:block">Invaluable Metrics</li>
						<li>
							<p>
								<CountUp end={1000} enableScrollSpy />
								k+
							</p>
							<p>Happy Clients</p>
						</li>
						<li>
							<p>
								<CountUp end={10} start={100} enableScrollSpy />+
							</p>
							<p>Years in business</p>
						</li>
						<li>
							<p>
								<CountUp end={200} enableScrollSpy />+
							</p>
							<p>Successful Ferry Trip</p>
						</li>
					</ul>
					<div className=" text-center md:text-left flex flex-col md:flex-row justify-between md:gap-20 lg:gap-28">
						<div className="basis-2/6 mb-10 md:mb-0 md:self-center">
							<img
								src="https://i.ibb.co/8BLhcJw/about.jpg"
								alt="about-us"
								width={100}
								height={100}
								className="rounded-lg shadow-2xl w-full md:w-[500px] h-[300px] md:h-[400px] object-cover "
							/>
						</div>
						<div className="flex-1 space-y-5 lg:pr-44">
							<div className="flex items-center justify-center md:justify-start">
								<span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
								<h3 className="uppercase font-medium">About us</h3>
							</div>
							<p className="font-medium text-2xl ">
								Welcome to Abitto, where innovation meets reliability in public
								water travel.
							</p>
							<p className="text-black/80 ">
								Welcome to Abitto, where innovation and reliability redefine{" "}
								{/* eslint-disable-next-line react/no-unescaped-entities */}
								public water travel. We don't just ferry passengers; we
								revolutionize your water transportation experience. With
								cutting-edge technology and unwavering safety protocols, we
								ensure every journey is convenient and intelligent. Join Abitto,
								where every trip showcases our dedication to excellence and your
								peace of mind.
							</p>
							<Link
								target="_blank"
								to="https://abittoglobal.com/?fbclid=PAZXh0bgNhZW0CMTEAAaaf2uWLgUdLwd18fE__CVzgHmX_XRFos7kxw4Ffa5sWyB58fZLwenzHvl8_aem_Af6umzSDXJvWgv1zoBRtzSSytwgTKLgfroif0Z8SpzdPUu-G5NWP8AMOlqscYrrjWJHGjX5_iSPUUMd4IcFzKNIs"
								className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out flex items-center justify-center md:justify-start gap-3 cursor-pointer"
							>
								<span className="underline font-medium">
									Discover More About Us
								</span>
								<CaretIcon />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Youtube video */}
			<section className="bg-white  px-5 pb-20 md:p-20 ">
				<div className="max-w-[1440px] mx-auto flex flex-col">
					<h3 className=" self-center md:w-[500px] text-center font-semibold mb-6 text-lg md:text-xl ">
						Watch our instructional video to learn more about Abitto Ferry
						services.
					</h3>
					<div className="w-full bg-black rounded-lg overflow-hidden">
						<iframe
							width="560"
							height="560"
							src="https://www.youtube.com/embed/oKqH4VeBtD4?autoplay=1&mute=1&loop=1&playlist=oKqH4VeBtD4&rel=0"
							title="At Abitto, Your Safety is our priority"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
							className="w-full aspect-video h-full lg:h-[560px] "
						/>
					</div>
				</div>
			</section>

			{/* Client Testimonials */}
			<TestimonialsCarousel />

			{/* Contact us  */}
			<section
				className="py-20 px-5 md:px-20 bg-white"
				ref={contact}
				id="contact-us"
			>
				<div className="max-w-[1440px] mx-auto">
					<h2 className="font-semibold text-xl md:text-2xl mb-7 inline-flex items-center justify-center w-full ">
						<span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 md:hidden " />
						Contact Us
					</h2>
					<div className="flex flex-col-reverse md:flex-row gap-10 lg:gap-16 justify-between ">
						<div className="flex flex-col flex-1">
							<div className="flex items-center justify-center md:hidden mb-5">
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
								<ul className="lg:flex-1 text-sm [&_a]:flex [&_a]:gap-3 [&_a]:items-center space-y-7 [&_span]:text-black md:[&_span]:text-white md:[&_span]:bg-blue-500 [&_span]:rounded-lg [&_span]:!w-9 [&_span]:h-9  [&_span]:inline-flex [&_span]:justify-center  [&_span]:items-center ">
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
								<ul className="lg:flex-1 text-sm [&_a]:flex [&_a]:gap-3 [&_a]:items-center space-y-7 [&_span]:text-black md:[&_span]:text-white md:[&_span]:bg-blue-500 [&_span]:rounded-lg [&_span]:!w-9 [&_span]:h-9 [&_span]:inline-flex  [&_span]:justify-center [&_span]:items-center">
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
											<span className="px-2">
												<MapIcon />
											</span>
											<p>
												Nwaniba Timber Beach, Uruan, Behind Ibom Icon Resort,
												Uyo
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
				</div>
			</section>

			{/* faq */}
			<section className="py-20 px-5 md:px-20 bg-white">
				<div className="max-w-[1440px] mx-auto">
					<h2 className="font-semibold text-xl md:text-2xl text-center">
						Frequently Asked Questions (FAQs)
					</h2>
					<div className="my-10">
						<Accordion type="single" collapsible className="w-full space-y-5">
							<AccordionItem
								value="item-1"
								className="data-[state=open]:border-2 data-[state=open]:border-t-0 data-[state=open]:border-[#666666] shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
							>
								<AccordionTrigger className="hover:bg-gray-100 hover:no-underline text-left text-sm md:text-lg border rounded-lg border-[#666666] px-3 md:px-5">
									How do I book a ticket with Abitto Ferry?
								</AccordionTrigger>
								<AccordionContent className="text-sm md:text-base p-5 md:p-10">
									Visit our website at{" "}
									<a
										href="http://www.abittoferry.com/booking"
										className="text-blue-500 hover:text-blue-700 font-bold"
									>
										www.abittoferry.com
									</a>
									. From the homepage, click on 'Book a Ticket,' choose your
									trip type (One-Way or Round Trip), fill in your details, and
									follow the prompts to complete your booking.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value="item-2"
								className="data-[state=open]:border-2 data-[state=open]:border-t-0 data-[state=open]:border-[#666666] shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
							>
								<AccordionTrigger className="hover:bg-gray-100 hover:no-underline text-left text-sm md:text-lg border rounded-lg border-[#666666] px-3 md:px-5">
									What payment methods are accepted?
								</AccordionTrigger>
								<AccordionContent className="text-sm md:text-base p-5 md:p-10">
									We accept various payment methods, including credit/debit
									cards, Paystack, and other secure online payment options.
									Simply choose your preferred payment method during the booking
									process.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value="item-3"
								className="data-[state=open]:border-2 data-[state=open]:border-t-0 data-[state=open]:border-[#666666] shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
							>
								<AccordionTrigger className="hover:bg-gray-100 hover:no-underline text-left text-sm md:text-lg border rounded-lg border-[#666666] px-3 md:px-5">
									Can I reschedule my trip?
								</AccordionTrigger>
								<AccordionContent className="text-sm md:text-base p-5 md:p-10">
									Yes, trips can be rescheduled. Please contact our customer
									support team at least 24 hours before your departure time to
									make any changes to your booking.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value="item-4"
								className="data-[state=open]:border-2 data-[state=open]:border-t-0 data-[state=open]:border-[#666666] shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
							>
								<AccordionTrigger className="hover:bg-gray-100 hover:no-underline text-left text-sm md:text-lg border rounded-lg border-[#666666] px-3 md:px-5">
									How do I check in for my trip?
								</AccordionTrigger>
								<AccordionContent className="text-sm md:text-base p-5 md:p-10">
									Check-in is done at the terminal before departure. Please
									arrive at the terminal at least 30 minutes before your
									scheduled departure time to complete the check-in process.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value="item-6"
								className="data-[state=open]:border-2 data-[state=open]:border-t-0 data-[state=open]:border-[#666666] shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
							>
								<AccordionTrigger className="hover:bg-gray-100 hover:no-underline text-left text-sm md:text-lg border rounded-lg border-[#666666] px-3 md:px-5">
									What happens if I encounter issues with my payment?
								</AccordionTrigger>
								<AccordionContent className="text-sm md:text-base p-5 md:p-10">
									If you experience any issues with your payment, please contact
									our customer support team for immediate assistance. We’re here
									to ensure your booking process is smooth and hassle-free.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value="item-5"
								className="data-[state=open]:border-2 data-[state=open]:border-t-0 data-[state=open]:border-[#666666] shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
							>
								<AccordionTrigger className="hover:bg-gray-100 hover:no-underline text-left text-sm md:text-lg border rounded-lg border-[#666666] px-3 md:px-5">
									What if my preferred departure time is sold out?
								</AccordionTrigger>
								<AccordionContent className="text-sm md:text-base p-5 md:p-10">
									If your preferred departure time is sold out, you can select
									another available time. We recommend booking in advance to
									secure your desired time slot.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
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
	const { mountPortalModal } = React.useContext(GlobalCTX);

	const onSubmit = handleSubmit((formData) => {
		setLoading(true);
		axios
			.post("https://abitto-api.onrender.com/api/email/contact", formData)
			.then((res) => {
				if (res.status == 200) {
					mountPortalModal(
						<SuccessModal
							header="Request sent successfully."
							text="Thank you. We have received your message and we will contact you shortly."
							onclick={reset}
						/>
					);
				}
			})
			.catch(() => {
				toast.error("Request failed. Please try again later.");
			})
			.finally(() => {
				setLoading(false);
			});
	});

	return (
		<>
			<form
				className="flex flex-col gap-y-5 *:p-3 *:rounded-lg h-full *:bg-[#EEEEEE] md:*:bg-white [&>*:not(&_button,&_p)]:shadow-md"
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
					text={"Send Message"}
					className="w-full md:w-40 !mt-auto"
				/>
			</form>
		</>
	);
};

const testimonials = [
	{
		id: 1,
		name: "Jennifer",
		imgUrl: "https://i.ibb.co/GT9fdRX/Jeniffer-Client.png",
		review:
			"Absolutely delightful experience! The ferry was clean and comfortable, and the views during the ride were breathtaking. Will definitely be using this Abitto ferry again.",
	},
	{
		id: 2,
		name: "Mr. Willis",
		imgUrl: "https://i.ibb.co/Tqv0zDR/Mr-kalu-Client.jpg",
		review:
			"Such a relaxing way to travel! I took the ferry and absolutely loved it. A fantastic option for anyone looking to avoid the hassle of traffic and enjoy the journey.",
	},
];

const TestimonialsCarousel = () => {
	const [active, setActive] = React.useState(1);
	const carouselContainer = React.useRef();

	// const handleScroll = () => {
	//   const scrollPosition = carouselContainer.current.scrollLeft;
	//   Array.from({ length: testimonials.length }).map((_, index) => {
	//     const id = index + 1;
	//     const carouselItem = document.getElementById(`slide-item${id}`);
	//     const nextOffset =
	//       carouselItem.offsetLeft + carouselItem.offsetWidth + 32;
	//     if (
	//       scrollPosition > carouselItem.offsetLeft &&
	//       scrollPosition <= nextOffset
	//     ) {
	//       return setActive(id);
	//     }
	//   });
	// };

	// React.useEffect(() => {
	//   const divElement = carouselContainer.current;
	//   divElement.addEventListener("scroll", handleScroll);

	//   // Clean up the event listener on component unmount
	//   divElement.removeEventListener("scroll", handleScroll);
	// }, []);

	const handlePrev = () => {
		if (active > 1) {
			setActive((prev) => {
				const previous = prev - 1;
				scrollTo(previous);
				return previous;
			});
		}
	};

	const handleNext = () => {
		if (active < testimonials.length) {
			setActive((prev) => {
				const next = prev + 1;
				scrollTo(next);
				return next;
			});
		}
	};

	const scrollTo = (id) => {
		const item = document.getElementById(`slide-item${id}`);
		carouselContainer.current.scrollTo({
			top: 0,
			left: item.offsetLeft,
			behavior: "smooth",
		});
	};

	const handleClick = (id) => {
		setActive(id);
		scrollTo(id);
	};

	return (
		<section className="py-20 px-5 md:px-20 bg-blue-50 ">
			<div className="max-w-[1440px] mx-auto">
				<hgroup className="text-center space-y-2">
					<h2 className="font-semibold text-xl md:text-2xl">
						Travelers Testimonials
					</h2>
					<p className="text-xs md:text-sm">
						{"Here's"} what some of them are saying.
					</p>
				</hgroup>
				<div
					ref={carouselContainer}
					className="py-6 flex items-center gap-4 md:gap-8 mx-auto h-[400px] overflow-auto no-scrollbar snap-x snap-mandatory transition-all duration-200 ease-in-out"
				>
					{testimonials.map((item, index) => (
						<div
							key={item.id}
							id={`slide-item${item.id}`}
							onClick={() => {
								handleClick(item.id);
							}}
							data-state={active == index + 1 ? "active" : ""}
							className="snap-always snap-start min-w-[80%] md:min-w-[45%] data-[state=active]:min-w-[90%] data-[state=active]:md:min-w-[50%] min-h-[306px] p-5 md:p-8 bg-white rounded-lg flex flex-col gap-3 items-start transition-all duration-200 ease-in-out data-[state=active]:scale-y-[1.1]"
						>
							<span className="font-bold text-4xl">“</span>
							<p
								className={cn(
									"font-medium text-sm md:text-base w-full md:w-[80%]"
								)}
							>
								{item.review}
							</p>
							<div className="flex items-center gap-3 mt-auto">
								<div className="w-12 aspect-square rounded-full bg-blue-500 overflow-hidden ring-black ring-1">
									<img
										src={item.imgUrl}
										alt="profile"
										className="min-w-full "
									/>
								</div>
								<div className="space-y-1">
									<h3 className="font-semibold ">{item.name}</h3>
									<p className="font-medium text-[#606060]">Traveler</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div>
					<div className="flex gap-2 items-center ">
						<div className="flex items-center gap-2">
							{Array.from({ length: testimonials.length }).map((_, index) => (
								<div
									data-state={active == index + 1 ? "active" : ""}
									key={index}
									className="w-2 h-2 bg-white shadow-sm rounded-full data-[state=active]:bg-black"
								/>
							))}
						</div>
						<button
							disabled={active <= 1 ? true : false}
							onClick={handlePrev}
							className="w-9 h-9 rounded-full bg-blue-500 text-white disabled:bg-white disabled:text-black font-bold text-xl inline-flex items-center justify-center ml-auto transition duration-150 ease-in-out"
						>
							<span className="rotate-180">
								<ArrowIcon />
							</span>
						</button>
						<button
							disabled={active >= testimonials.length ? true : false}
							onClick={handleNext}
							className="w-9 h-9 rounded-full bg-blue-500 text-white disabled:bg-white disabled:text-black font-bold text-xl inline-flex items-center justify-center transition duration-150 ease-in-out"
						>
							<span>
								<ArrowIcon />
							</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};
