import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import baseurl from "@/api";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { MapIcon, PhoneIcon, CaretIcon, BoatIcon } from "@/assets/icons";
import { marinaMap, timberMap } from "@/assets/images";
import { GlobalCTX } from "@/contexts/GlobalContext";
// import FadeInBackgroundTransition from "@/components/animation/FadeIn";
import Button from "@/components/custom/Button";
import HeroGIF from "@/assets/hero.gif";
import CountUp from "react-countup";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import SuccessModal from "@/components/modals/success";
import EmblaCarousel from "@/components/embla-carousel/EmblaCarousel";
// import WaveSVG from "@/assets/blob-scene-haikei.svg";

const Home = () => {
	const { contact, faq, services, scrollToSection } =
		React.useContext(GlobalCTX);
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

							<Button
								text="Get Started"
								onClick={() => {
									scrollToSection(services);
									navigate("/#services");
								}}
								className="w-40 mx-auto md:mx-0"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* About us  */}
			<section className="px-5 py-20 md:px-20 bg-white" id="about-us">
				<div className="max-w-[1440px] mx-auto">
					<div className=" text-center md:text-left flex flex-col md:flex-row justify-between md:gap-20 lg:gap-28">
						<div className="basis-2/6 mb-10 md:mb-0 md:self-center">
							<img
								src="https://i.ibb.co/8BLhcJw/about.jpg"
								alt="about-us"
								width={100}
								height={100}
								className="rounded-lg shadow-2xl w-full md:w-[500px] h-[300px] md:h-[400px] object-cover border "
							/>
						</div>
						<div className="flex-1">
							<div className="space-y-5 lg:w-9/12">
								<h2 className="font-semibold text-xl md:text-2xl inline-flex items-center justify-center md:justify-start w-full ">
									<span className="h-3 w-3 mr-3 rounded-full bg-blue-500" />
									About Us
								</h2>
								<p className="font-medium text-2xl ">
									Welcome to Abitto, where innovation meets reliability in
									public water travel.
								</p>
								<p className="text-black/80  ">
									Welcome to Abitto, where innovation and reliability redefine{" "}
									{/* eslint-disable-next-line react/no-unescaped-entities */}
									public water travel. We don't just ferry passengers; we
									revolutionize your water transportation experience. With
									cutting-edge technology and unwavering safety protocols, we
									ensure every journey is convenient and intelligent. Join
									Abitto, where every trip showcases our dedication to
									excellence and your peace of mind.
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
				</div>
			</section>

			<section
				id="services"
				ref={services}
				className="py-20 px-5 md:px-20 bg-blue-50"
			>
				<div className="max-w-[1440px] mx-auto">
					<h2 className="font-semibold text-xl md:text-2xl mb-10 inline-flex items-center justify-center w-full ">
						<span className="h-3 w-3 mr-3 rounded-full bg-blue-500" />
						Our Services
					</h2>
					<div className="flex flex-wrap *:basis-72 *:grow gap-5">
						<div className="bg-white rounded-[1.8rem] p-6 md:p-10 h-[15rem] md:h-[20rem]  hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden ">
							{/* <img src={WaveSVG} alt="svg" className="absolute top-0 left-0 " /> */}
							<div className=" flex flex-col gap-2 md:gap-5 h-full relative z-1">
								<h3 className="text-xl md:text-2xl font-semibold text-blue-500">
									Book a trip
								</h3>
								<p className="md:text-lg">
									Write some text here write more stuff and more stuff and add
									better styling
								</p>
								<div className="ml-auto mt-auto">
									<Button
										text={
											<p className="inline-flex items-center gap-2 ">
												Book a trip
												<span>
													<CaretIcon />
												</span>
											</p>
										}
										className="rounded-full w-40 md:w-44 h-10 md:h-12"
										onClick={() => navigate("/booking")}
									/>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-[1.8rem] p-6 md:p-10 h-[15rem] md:h-[20rem]  hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden ">
							{/* <img src={WaveSVG} alt="svg" className="absolute top-0 left-0 " /> */}
							<div className=" flex flex-col gap-2 md:gap-5 h-full relative z-1">
								<h3 className="text-xl md:text-2xl font-semibold text-blue-500">
									Boat Rentals
								</h3>
								<p className="md:text-lg">
									Write some text here write more stuff and more stuff and add
									better styling
								</p>
								<div className="ml-auto mt-auto">
									<Button
										text={
											<p className="inline-flex items-center gap-2 ">
												Rent a boat
												<span>
													<CaretIcon />
												</span>
											</p>
										}
										className="rounded-full w-40 md:w-44 h-10 md:h-12"
										onClick={() => navigate("/rental")}
									/>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-[1.8rem] p-6 md:p-10 h-[15rem] md:h-[20rem]  hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden ">
							{/* <img src={WaveSVG} alt="svg" className="absolute top-0 left-0 " /> */}
							<div className=" flex flex-col gap-2 md:gap-5 h-full relative z-1">
								<h3 className="text-xl md:text-2xl font-semibold text-blue-500">
									Logistics
								</h3>
								<p className="md:text-lg">
									Write some text here write more stuff and more stuff and add
									better styling
								</p>
								<div className="ml-auto mt-auto">
									<Button
										text={
											<p className="inline-flex items-center gap-2 ">
												Get a Quote
												<span>
													<CaretIcon />
												</span>
											</p>
										}
										className="rounded-full w-40 md:w-44 h-10 md:h-12"
										onClick={() => navigate("/get-quote")}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* metrics */}
			<section className="bg-white ">
				<div className="max-w-[1440px] mx-auto">
					<ul className="flex gap-2 md:gap-10 justify-evenly text-center px-5 py-10 sm:py-20 font-bold [&_p:last-of-type]:font-normal text-3xl sm:text-6xl [&_p:last-of-type]:text-xs  sm:[&_p:last-of-type]:text-base *:flex *:flex-col *:items-center *:grow *:w-full">
						<li>
							<p>
								<CountUp end={500} enableScrollSpy />+
							</p>
							<p>Happy Clients</p>
						</li>
						<li>
							<p>
								<CountUp end={4} start={100} enableScrollSpy />+
							</p>
							<p>Months in Business</p>
						</li>
						<li>
							<p>
								<CountUp end={50} enableScrollSpy />+
							</p>
							<p>Successful Ferry Trips</p>
						</li>
					</ul>
				</div>
			</section>

			{/* Youtube video */}
			<section className="bg-white  px-5 pt-10 pb-20 md:p-20 ">
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

			<section className="py-20 px-5 md:px-20 bg-white">
				<div className="max-w-[1440px] mx-auto">
					<h2 className="font-semibold text-xl md:text-2xl  mb-7 inline-flex items-center justify-center w-full ">
						<span className="h-3 w-3 mr-3 rounded-full bg-blue-500" />
						Our Locations
					</h2>
					<div className="flex flex-col lg:flex-row gap-10 *:md:shadow-lg *:grow *:w-full">
						{/* Calabar */}
						<div className="lg:flex flex-wrap gap-8 md:bg-blue-50 rounded-lg p-0 md:p-10 lg:p-5">
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
										to="tel:+2347070600307"
									>
										<span>
											<PhoneIcon />
										</span>
										<p>+234 707 060 0307</p>
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
						<div className="lg:flex flex-wrap gap-8 md:bg-blue-50 rounded-lg p-0 md:p-10 lg:p-5">
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
										to="tel:+2347077404553"
									>
										<span>
											<PhoneIcon />
										</span>
										<p>+234 707 740 4553</p>
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
											Nwaniba Timber Beach, Uruan, Behind Ibom Icon Resort, Uyo
										</p>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<div className="bg-white px-5 md:px-20 pt-0 pb-20 md:pt-20">
				<div className="flex flex-col md:flex-row gap-y-20 md:gap-10 *:w-full *:grow  max-w-[1440px] mx-auto">
					{/* faq */}
					<section id="faq" ref={faq} className="mt-auto">
						<h2 className="font-semibold text-xl md:text-2xl mb-7 inline-flex items-center justify-center w-full ">
							<span className="h-3 w-3 mr-3 rounded-full bg-blue-500" />
							Frequently Asked Questions (FAQs)
						</h2>
						<div>
							<Accordion type="single" collapsible className="w-full space-y-5">
								<AccordionItem
									value="item-1"
									className=" shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
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
										. From the homepage, click on{" 'Book a Ticket,' "}choose
										your trip type (One-Way or Round Trip), fill in your
										details, and follow the prompts to complete your booking.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem
									value="item-2"
									className=" shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
								>
									<AccordionTrigger className="hover:bg-gray-100 hover:no-underline text-left text-sm md:text-lg border rounded-lg border-[#666666] px-3 md:px-5">
										What payment methods are accepted?
									</AccordionTrigger>
									<AccordionContent className="text-sm md:text-base p-5 md:p-10">
										We accept various payment methods, including credit/debit
										cards, Paystack, and other secure online payment options.
										Simply choose your preferred payment method during the
										booking process.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem
									value="item-3"
									className=" shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
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
									className=" shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
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
									className=" shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
								>
									<AccordionTrigger className="hover:bg-gray-100 hover:no-underline text-left text-sm md:text-lg border rounded-lg border-[#666666] px-3 md:px-5">
										What happens if I encounter issues with my payment?
									</AccordionTrigger>
									<AccordionContent className="text-sm md:text-base p-5 md:p-10">
										If you experience any issues with your payment, please
										contact our customer support team for immediate assistance.
										We’re here to ensure your booking process is smooth and
										hassle-free.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem
									value="item-5"
									className=" shadow-[0px_4px_4px_0px_#00000040] rounded-lg"
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
					</section>
					{/* Contact us  */}
					<section ref={contact} id="contact">
						<h2 className="font-semibold text-xl md:text-2xl mb-7 inline-flex items-center justify-center w-full ">
							<span className=" h-3 w-3 mr-3 rounded-full bg-blue-500" />
							Contact Us
						</h2>
						<div className="md:bg-blue-50 rounded-lg p-0 md:p-10 ">
							<ContactForm />
						</div>
					</section>
				</div>
			</div>
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
		baseurl
			.post("/email/contact", formData)
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
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
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
					className="w-full md:w-56 ml-auto mt-5"
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
	{
		id: 3,
		name: "Stella",
		imgUrl: "https://i.ibb.co/6bSCnmj/stella.jpg",
		review:
			"I was impressed with the entire process, it felt like being at the airport. The cozy atmosphere and beautiful experience exceeded my expectations. Thumbs up to the management of Abitto Ferry.",
	},
	{
		id: 4,
		name: "Hon. Ukam",
		imgUrl: "https://i.ibb.co/hHdSNrT/Hon-Ukam.jpg",
		review:
			"I had a wonderful experience with Abitto Ferry. It’s a complete alternative to traveling by road from Calabar to Uyo. With Abitto, you can be sure of your arrival time compared to road travel. Great job to the management for this initiative.",
	},
];

const TestimonialsCarousel = () => {
	const navigate = useNavigate();
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
				<div className="mt-5">
					<EmblaCarousel slides={testimonials} />
				</div>
				<Button
					text="Send your Feedback"
					className="mx-auto px-5 mt-10 md:mt-5"
					onClick={() => navigate("feedback")}
				/>
			</div>
		</section>
	);
};
