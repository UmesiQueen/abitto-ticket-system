import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Button from "@/components/custom/Button";
import { about, about2 } from "@/assets/images";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Us | Abitto Ferry</title>
      </Helmet>
      <div>
        {/* hero section */}
        <section
          className=" h-[670px] lg:h-screen w-full flex items-center relative bg-cover lg:bg-center bg-right bg-no-repeat"
          style={{ backgroundImage: `url(${about})` }}
        >
          <div className="lg:hidden bg-black/40 w-full h-full absolute z-[1] " />
          <div
            className="hidden lg:block absolute w-full h-full"
            style={{
              backgroundColor: "rgb(0,0,0)",
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.8016018907563025) 50%, rgba(255,255,255,0) 100%)",
              //   background:
              //     "-webkit-linear-gradient(90deg, rgba(0,0,0,0.8016018907563025) 50%, rgba(255,255,255,0) 100%)",
              //   background:
              //     " linear-gradient(90deg, rgba(0,0,0,0.8016018907563025) 50%, rgba(255,255,255,0) 100%)",
              //   filter:
              //     "progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000',endColorstr='#ffffff',GradientType=1)",
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
        <section className="px-5 pb-20 md:px-20 bg-white">
          <div className="max-w-[1440px] mx-auto pt-5">
            <ul className="flex gap-10 justify-between md:justify-center p-5 pb-20 text-center font-semibold [&_p:last-of-type]:font-normal  text-xl [&_p:last-of-type]:text-xs items-center">
              <li className="hidden md:block">Invaluable Metrics</li>
              <li>
                <p>2M +</p>
                <p>Happy Clients</p>
              </li>
              <li>
                <p>10 +</p>
                <p>Years in business</p>
              </li>
              <li>
                <p>200 +</p>
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
                  Welcome to Abitto, where innovation meets reliability in
                  public water travel.
                </p>
                <p className="text-black/80 ">
                  Welcome to Abitto, where innovation and reliability redefine
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  public water travel. We don't just ferry passengers; we
                  revolutionize your water transportation experience. With
                  cutting-edge technology and unwavering safety protocols, we
                  ensure every journey is convenient and intelligent. Join
                  Abitto, where every trip showcases our dedication to
                  excellence and your peace of mind.
                </p>
              </div>
            </div>
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
              <div className="p-5 px-8 rounded-lg bg-white mt-5 md:mt-0">
                <TabsContent value={"mission"}>
                  <div className="rounded-lg min-h-72 space-y-4">
                    <h3>Mission Statement</h3>
                    <p className="border-t-2 pt-4 border-black">
                      Lorem ipsum dolor sit amet consectetur. Accumsan tristique
                      montes faucibus nisi bibendum et. Et dapibus adipiscing
                      nunc cursus ullamcorper est. In elit eu odio enim. Nunc eu
                      adipiscing tincidunt tortor urna lectus enim vitae morbi.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value={"vision"}>
                  <div className="rounded-lg min-h-72 space-y-4">
                    <h3>Vision Statement</h3>
                    <p className="border-t-2 pt-4 border-black">
                      Lorem ipsum dolor sit amet consectetur. Accumsan tristique
                      montes faucibus nisi bibendum et. Et dapibus adipiscing
                      nunc cursus ullamcorper est. In elit eu odio enim. Nunc eu
                      adipiscing tincidunt tortor urna lectus enim vitae morbi.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value={"history"}>
                  <div className="rounded-lg min-h-72 space-y-4">
                    <h3>Our History</h3>
                    <p className="border-t-2 pt-4 border-black">
                      Lorem ipsum dolor sit amet consectetur. Accumsan tristique
                      montes faucibus nisi bibendum et. Et dapibus adipiscing
                      nunc cursus ullamcorper est. In elit eu odio enim. Nunc eu
                      adipiscing tincidunt tortor urna lectus enim vitae morbi.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </section>

        {/* Meet the founder */}
        <section className="px-5 pb-20 md:p-20 bg-white">
          <div className="max-w-[1440px] mx-auto pt-5 md:flex gap-20 *:grow *:w-full">
            <div className="text-center md:text-left mt-10 md:mt-0">
              <div className="flex items-center justify-center md:justify-start">
                <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
                <h3 className="uppercase font-semibold">Meet our founder</h3>
              </div>
              <div className="pt-5 md:pt-10 pb-6">
                <p className="font-semibold text-2xl mb-2">Richard Akinaka</p>
                <p className=" font-medium">Founder Abitto Global services</p>
              </div>
              <div className="space-y-3 *:indent-3">
                <p>
                  Mr. Richard Akinaka is the Chairman and CEO of Abitto Global
                  Services Limited. He is a highly skilled project manager with
                  a wealth of experience in various fields, including oil and
                  gas services, engineering, and water resources. Mr. Akinaka
                  has successfully led projects involving construction, roads,
                  drainage systems, and more.
                </p>
                <p>
                  With a degree in policy and administrative studies from the
                  University of Calabar, Nigeria, Mr. Akinaka brings strong
                  leadership and management skills to Abitto. He has a proven
                  track record of working well with professionals from different
                  industries and managing complex projects.
                </p>
                <p>
                  As one of the founders of Abitto Global Services, Mr. Akinaka
                  leverages his extensive business knowledge and wide network of
                  contacts to drive the {"company's"} success. His focus on
                  Total Quality Management ensures that Abitto delivers
                  top-notch services to its clients.
                </p>
                <p>
                  His vision and leadership continue to drive Abitto Global
                  Services to excel in innovative solutions across multiple
                  industries.
                </p>
              </div>
            </div>
            <div className="mt-10 md:mt-0">
              <div className=" w-full md:w-[500px] h-[500px] mx-auto overflow-hidden rounded-lg bg-slate-50">
                <img
                  alt="founders image"
                  src="https://i.ibb.co/PN84KM8/abitto-founder.jpg"
                  className=" w-full h-full object-cover object-top scale-[2.1] mt-[45%] ml-[10%] "
                />
              </div>
            </div>
          </div>
        </section>

        {/* Youtube video */}
        <section className="bg-white  px-5 pb-20 md:p-20 ">
          <div className="max-w-[1440px] mx-auto flex flex-col">
            <h3 className=" self-center md:w-[500px] text-center font-semibold mb-6 text-lg md:text-xl ">
              Our Products
            </h3>
            <div className="w-full bg-black rounded-lg overflow-hidden">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/heNz8-wIxws?si=vqxZXBcPMusCAHqi"
                title="Abitto products"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowfullscreen
                className="w-full aspect-video h-full lg:h-[560px] "
              />
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
            <Button
              text="Book your trip"
              onClick={() => {
                navigate("/booking");
              }}
              className="px-5 mx-auto mt-5"
            />
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
    className="self-start data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:content-[''] data-[state=active]:after:h-10 data-[state=active]:after:w-3 data-[state=active]:after:bg-blue-500 data-[state=active]:after:-left-[.4rem] data-[state=active]:after:absolute  data-[state=active]:after:rounded-lg pl-5 justify-start "
  >
    {title}
  </TabsTrigger>
);
