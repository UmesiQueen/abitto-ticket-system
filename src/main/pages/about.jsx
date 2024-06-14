import { Helmet } from "react-helmet-async";
import Button from "@/components/custom/Button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Us | Abitto Ferry</title>
      </Helmet>
      <div>
        {/* hero section */}
        <section className="h-[650px] lg:h-screen w-full flex items-center relative bg-[url('https://i.ibb.co/280zDd4/about-hero.jpg')] bg-cover lg:bg-center bg-right bg-no-repeat">
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

          <div className="w-[250px] lg:w-[550px] ml-5 lg:ml-20 space-y-6 z-[2] pt-[78px]">
            <h2 className="bg-white rounded-[12px] py-1 px-4 w-fit uppercase font-semibold text-sm">
              About us
            </h2>
            <p className="font-semibold text-2xl lg:text-[40px] text-white lg:leading-[60px]  ">
              Unlock Joyful Journeys: Where Every Ferry Ride is a Ticket to
              Happiness!
            </p>
          </div>
        </section>

        {/* History */}
        <section className="px-5 py-20 md:px-20 lg:px-32">
          <div className="flex flex-col lg:flex-row gap-y-10 justify-between">
            <div className="basis-1/4 space-y-5">
              <div className="flex items-center">
                <span className=" h-3 w-3 mr-3 rounded-full bg-blue-500 " />
                <h2 className="uppercase font-medium lg:text-xl text-lg">
                  Company History
                </h2>
              </div>
              <p className="text-sm lg:text-base">
                Welcome to Abitto, where innovation meets reliability in public
                water travel.
              </p>
              <p className="font-semibold text-xl lg:text-2xl text-blue-500 lg:pt-5">
                Brief History
              </p>
              <p className="font-semibold text-xl lg:text-2xl text-[#7F7F7F]">
                Why Choose US
              </p>
            </div>
            <div className="basis-2/4">
              <div className="bg-green-50 lg:min-w-[720px] rounded-lg p-5  md:p-20 ml-auto text-sm lg:text-base">
                <p>
                  Abitto Global Services Limited is a multi-disciplinary company
                  committed to exceptional client satisfaction and quality
                  service delivery. We offer comprehensive range of stand-alone
                  and integrated services on time and on budget. Our area of
                  specialization include, but not limited to Fabrication, Marine
                  Services, Oil & Gas Services, Dredging, Scaffolding and
                  Project Management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* metrics */}
        <section className="px-5 pb-20 lg:pt-20 md:px-20 lg:px-32">
          <div className="flex flex-col lg:flex-row items-start gap-y-10 gap-x-20 text-center lg:text-left">
            <div className="flex-1 mx-auto">
              <div className="lg:max-w-[400px] flex flex-col lg:flex-row items-center gap-3">
                <span className="p-2 rounded-full bg-blue-500 " />
                <h2 className="capitalize font-semibold lg:text-3xl text-lg">
                  These metrics shows our commitment to excellence
                </h2>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className=" lg:w-[400px] grid lg:grid-cols-2 gap-5 lg:gap-y-10 [&_p]:flex [&_p]:flex-col [&_p]:gap-2 [&_span:first-of-type]:font-semibold [&_span:first-of-type]:text-3xl [&_span:last-of-type]:text-sm">
                <p>
                  <span>10 +</span>
                  <span>Years in business</span>
                </p>
                <p>
                  <span>200 +</span>
                  <span>Successful Ferry Trip</span>
                </p>
                <p>
                  <span>2M +</span>
                  <span>Happy Clients</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Extra */}
        <section className="w-full h-[300px] flex lg:flex-row-reverse items-center bg-boat bg-cover bg-no-repeat bg-center relative text-white">
          <div className="w-full h-full bg-gradient-to-b from-white/0 from-50% to-blue-500/40 absolute z-[1]" />
          <div className="bg-black/80 w-full h-full absolute" />
          <div className=" w-full z-[1] space-y-8 ">
            <p className="font-semibold px-20 lg:text-2xl text-center">
              Get started on your journey with us today!
            </p>
            <Button
              text="Get Started"
              onClick={() => {
                navigate("/booking");
              }}
              className="px-5 mx-auto"
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
