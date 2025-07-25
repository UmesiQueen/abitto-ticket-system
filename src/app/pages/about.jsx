import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import CustomButton from "@/components/custom/Button";
import { about, about2 } from "@/assets/images";
import FounderImg from "@/assets/images/founder.jpg";
import FounderImg3 from "@/assets/images/founder2.jpg";
import FounderImg2 from "@/assets/images/abitto-founder.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CountUp from "react-countup";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { MapIcon, PhoneIcon, CaretIcon, BoatIcon } from "@/assets/icons";
import { marinaMap, timberMap } from "@/assets/images";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const About = () => {
	const navigate = useNavigate();
	const { services, scrollToSection } = React.useContext(GlobalCTX);

	return (
		<>
			<Helmet>
				<title>About Us | Abitto Ferry</title>
				<link rel="canonical" href="https://www.abittoferry.com/booking" />
				<meta property="og:title" content="Booking - Abitto Ferry" />
				<meta
					property="og:description"
					content="Our easy-to-use booking platform ensures quick reservations, secure payments, and instant confirmations. Travel with confidence and comfort. Reserve your seat today..."
				/>
			</Helmet>
			<div>
				{/* hero section */}
				<section
					className="min-h-[670px] h-screen w-full flex items-center relative bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: `url(${about})` }}
				>
					<div className="lg:hidden bg-black/40 w-full h-full absolute z-[1] " />
					<div
						className="hidden lg:block absolute w-full h-full"
						style={{
							backgroundColor: "rgb(0,0,0)",
							background:
								"linear-gradient(90deg, rgba(0,0,0,0.8016018907563025) 50%, rgba(255,255,255,0) 100%)",
						}}
					/>

					<div className="relative z-[2] h-full w-full px-5 md:px-20">
						<div className="max-w-[1440px] mx-auto flex items-center h-full">
							<div className="w-[250px] lg:w-[550px] space-y-6">
								<h2 className="bg-white rounded-[12px] py-1 px-4 w-fit uppercase font-semibold text-sm">
									About us
								</h2>
								<p className="font-semibold text-2xl lg:text-[40px] text-white lg:leading-[60px]  ">
									Unlock Joyful Journeys: Where Every Ferry Ride is a Ticket to
									Happiness!
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* about us */}
				<section className="px-5 py-20 md:px-20 bg-white" id="about-us">
					<div className="max-w-[1440px] mx-auto">
						<div className=" text-center md:text-left flex flex-col md:flex-row *:w-full *:grow justify-between md:gap-10">
							<div className="mb-10 md:mb-0 md:self-center">
								<img
									src="https://i.ibb.co/8BLhcJw/about.jpg"
									alt="about-us"
									width={100}
									height={100}
									className="rounded-lg shadow-2xl w-full md:w-[450px] h-[300px] md:h-[400px] mx-auto object-cover border "
								/>
							</div>
							<div>
								<div className="space-y-5 lg:w-10/12">
									<h2 className="font-semibold text-lg md:text-xl lg:text-2xl inline-flex items-center justify-center md:justify-start w-full ">
										<span className="h-3 w-3 mr-3 rounded-full bg-blue-500" />
										About Us
									</h2>
									<p className="font-medium text-lg md:text-xl lg:text-2xl">
										Welcome to Abitto, where innovation meets reliability in
										public water travel.
									</p>
									<p className="text-black/80  ">
										{/* eslint-disable-next-line react/no-unescaped-entities */}
										We don't just ferry passengers; we revolutionize your water
										transportation experience. With cutting-edge technology and
										unwavering safety protocols, we ensure every journey is
										convenient and intelligent. Join Abitto, where every trip
										showcases our dedication to excellence and your peace of mind.
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

				<section className="px-5 py-20 md:p-20 bg-blue-50">
					<div className="max-w-[1440px] mx-auto pt-5">
						<Tabs defaultValue="mission" className="md:flex *:grow *:w-full">
							<div>
								<div className="w-3/4 md:w-2/3">
									<h3 className="font-semibold text-2xl">
										OUR POLICIES AND PRINCIPLES
									</h3>
									<TabsList className="flex flex-col justify-stretch h-full *:w-full relative bg-transparent border-l-2 border-dashed border-black py-5 rounded-none mt-5">
										<StyledTabsTrigger
											value={"mission"}
											title={"Mission Statement"}
										/>
										<StyledTabsTrigger
											value={"vision"}
											title={"Vision Statement"}
										/>
										<StyledTabsTrigger
											value={"history"}
											title={"Our History"}
										/>
									</TabsList>
								</div>
							</div>
							<div className="pt-5 p-8 rounded-lg bg-white mt-5 md:mt-0 *:min-h-[300px]">
								<TabsContent value={"mission"}>
									<div className="rounded-lg min-h-72 space-y-4">
										<h3 className="font-semibold">Mission Statement</h3>
										<div className="border-t-2 pt-4 text-sm md:text-base border-black space-y-2">
											<p>
												Abitto Ferry strives to deliver secure, dependable, and
												efficient ferry transportation services that link
												communities and enrich travel experiences.
											</p>
											<p>
												We are dedicated to exceptional customer service,
												environmental responsibility, and ongoing innovation.
											</p>
											<p>
												Our goal is to make every journey comfortable,
												convenient, punctual, and enjoyable for all our
												passengers.
											</p>
										</div>
									</div>
								</TabsContent>
								<TabsContent value={"vision"}>
									<div className="rounded-lg min-h-72 space-y-4">
										<h3 className="font-semibold">Vision Statement</h3>
										<div className="border-t-2 pt-4 text-sm md:text-base border-black space-y-2">
											<p>
												Our vision is to offer a superior transportation
												alternative by establishing seamless connections between
												all riverine states across the nation, positioning
												ourselves as the foremost ferry transportation company
												known for exceptional service, innovative solutions, and
												a strong commitment to sustainability.
											</p>
											<p>
												We aim to link more communities, minimize our
												environmental impact, and set new benchmarks in the
												maritime industry. By prioritizing safety, customer
												satisfaction, and technological advancements, we aspire
												to revolutionize sea travel and create enduring positive
												impacts on the regions we serve.
											</p>
										</div>
									</div>
								</TabsContent>
								<TabsContent value={"history"}>
									<div className="rounded-lg min-h-72 space-y-4">
										<h3 className="font-semibold">Our History</h3>
										<p className="border-t-2 pt-4 text-sm md:text-base border-black space-y-2">
											<p>
												Abitto ferry is a ferry transportation service offered
												by Abitto global Services Limited.
											</p>
											<p>
												She began operations on 1st june 2024, with her first
												trip from calabar, cross river state to Ufak effiong,
												Akwa ibom state a route she still operates on. Visit
												<a
													href="www.abittoglobal.com"
													target="_blank"
													rel="noreferrer"
													className="text-blue-500 hover:text-blue-700 px-1 "
												>
													www.abittoglobal.com
												</a>
												to know more about us.
											</p>
										</p>
									</div>
								</TabsContent>
							</div>
						</Tabs>
					</div>
				</section>

				{/* Meet the founder */}
				<section className="px-5 py-20 md:p-20 bg-white">
					<div className="max-w-[1440px] mx-auto pt-5 flex flex-col lg:flex-row gap-x-5 gap-y-20 *:w-full *:grow">
						<div className="text-center md:text-left">
							<div className="flex items-center justify-center md:justify-start">
								<span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
								<h3 className="uppercase font-semibold">Meet our founder</h3>
							</div>
							<div className="pt-5 md:pt-10 pb-6">
								<p className="font-semibold text-2xl mb-2">Richard Akinaka</p>
								<p className=" font-medium">Founder Abitto Global services</p>
							</div>
							<div className="space-y-3">
								<p>
									Mr. Richard Akinaka is the Chairman and CEO of Abitto Global
									Services Limited. A skilled project manager with extensive
									experience in oil and gas services, engineering, and water
									resources, he has successfully led various construction
									projects.
								</p>
								<p>
									With a degree in policy and administrative studies from the
									University of Calabar, Nigeria, Mr. Akinaka brings strong
									leadership and management skills to Abitto. As one of the
									founders, he leverages his business acumen and network to
									drive the {"company's"} success, focusing on Total Quality
									Management to deliver top-notch services.
								</p>
								<p>
									His vision and leadership continue to propel Abitto Global
									Services forward in providing innovative solutions across
									multiple industries.
								</p>
							</div>
						</div>
						<div className="*:w-[500px]">
							<SwiperContent />
						</div>
					</div>
				</section>

				{/* Youtube video */}
				<section className="bg-white  px-5 pb-20 md:p-20 ">
					<div className="max-w-[1440px] mx-auto flex flex-col">
						<h2 className="font-semibold text-xl mb-7 inline-flex items-center justify-center w-full ">
							<span className="h-3 w-3 mr-3 rounded-full bg-blue-500" />
							Our Products
						</h2>
						<div className="w-full bg-black rounded-lg overflow-hidden">
							<iframe
								width="560"
								height="315"
								src="https://www.youtube.com/embed/heNz8-wIxws?autoplay=1&mute=1&loop=1&playlist=heNz8-wIxws&controls=0&modestbranding&rel=0"
								title="Abitto products"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerPolicy="strict-origin-when-cross-origin"
								allowFullScreen
								className="w-full aspect-video h-full lg:h-[560px] "
							/>
						</div>
					</div>
				</section>

				{/* Our Terminals */}
				<section className="py-20 px-5 md:px-20 bg-white">
					<div className="max-w-[1440px] mx-auto">
						<h2 className="font-semibold text-xl  mb-7 inline-flex items-center justify-center w-full ">
							<span className="h-3 w-3 mr-3 rounded-full bg-blue-500" />
							Our Terminals
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

				{/* Extra */}
				<section
					className="w-full h-[300px] flex lg:flex-row-reverse items-center bg-cover bg-no-repeat bg-center relative text-white"
					style={{ backgroundImage: `url(${about2})` }}
				>
					<div className="w-full h-full bg-gradient-to-b from-white/0 from-50% to-blue-500/40 absolute z-[1]" />
					<div className="bg-black/80 w-full h-full absolute" />
					<div className=" w-full z-[1] text-center ">
						<p className="font-semibold md:text-2xl mb-1">
							Begin Your Adventure with Abitto Today!
						</p>
						<p className="text-xs md:text-base">
							Experience Seamless and Enjoyable Water Travel
						</p>
						<CustomButton
							onClick={() => {
								setTimeout(() => scrollToSection(services))
								navigate("/");
							}}
							className="w-40 mx-auto mt-5"
						>
							Get Started
						</CustomButton>
					</div>
				</section>
			</div>
		</>
	);
};

export default About;

// eslint-disable-next-line react/prop-types
const StyledTabsTrigger = ({ value, title }) => (
	<TabsTrigger
		value={value}
		className="md:text-lg self-start data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:content-[''] data-[state=active]:after:h-10 data-[state=active]:after:w-3 data-[state=active]:after:bg-blue-500 data-[state=active]:after:-left-[.4rem] data-[state=active]:after:absolute  data-[state=active]:after:rounded-lg pl-5 justify-start "
	>
		{title}
	</TabsTrigger>
);

const SwiperContent = () => {
	return (
		<>
			<Swiper
				effect={"coverflow"}
				grabCursor={true}
				centeredSlides={true}
				slidesPerView={"auto"}
				coverflowEffect={{
					rotate: 0,
					stretch: 0,
					depth: 120,
					modifier: 1,
					slideShadows: true,
				}}
				pagination={true}
				modules={[EffectCoverflow, Pagination]}
				className="mySwiper"
			>
				<SwiperSlide>
					<div className="h-[450px] overflow-hidden">
						<img
							src={FounderImg}
							alt="founder1"
							className="rounded-lg overflow-hidden w-full h-full object-cover object-top"
						/>
					</div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="h-[450px] overflow-hidden">
						<img
							src={FounderImg2}
							alt="founder2"
							className="rounded-lg overflow-hidden w-full h-full object-cover object-top"
						/>
					</div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="h-[450px] overflow-hidden">
						<img
							src={FounderImg3}
							alt="founder3"
							className="rounded-lg overflow-hidden w-full h-full object-cover object-center"
						/>
					</div>
				</SwiperSlide>
			</Swiper>
		</>
	);
};
