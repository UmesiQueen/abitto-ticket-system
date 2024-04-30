function App() {
  return (
    <div className="relative overflow-hidden font-poppins">
      <Navbar />

      <main>
        {/* Hero section */}
        <section className="bg-hero-pattern h-screen w-screen bg-cover bg-no-repeat bg-center flex items-center relative ">
          <div className="bg-black/40 w-full h-full absolute " />
          <div className="w-[440px] pl-20 space-y-10 z-[1]">
            <p className="font-semibold text-[40px] text-white">
              The Easiest & Safest way to travel within Nigeria & Africa
            </p>
            <button className="border-2 border-green-500 text-green-500 py-3 px-6 font-semibold text-sm ">
              Book a Ticket
            </button>
          </div>
        </section>
        {/* About us  */}
        <section className="p-20 px-44 bg-blue-50">
          <div className="flex justify-between flex-1">
            <div className="w-1/2">
              <img
                src="https://i.ibb.co/8BLhcJw/about.jpg"
                alt="about-us"
                width={350}
                height={420}
                className=" -rotate-6 "
              />
            </div>
            <div className="w-1/2 space-y-5">
              <h2 className="uppercase font-medium">About us</h2>
              <p className="font-medium text-2xl ">
                We offer comprehensive range of stand-alone and integrated
                services on time and on budget.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur. Semper pharetra erat
                enim purus viverra neque aliquam leo non. Ac platea lectus
                sociis ornare condimentum euismod. Euismod pellentesque
                vestibulum tristique at nunc placerat consectetur eu aenean.
                Auctor sagittis urna imperdiet pharetra.
              </p>
              <p className="text-blue-500">
                <a className="underline">Learn more</a>
              </p>
            </div>
          </div>
        </section>
        {/* Contact us  */}
        <section className="p-20 px-44">
          <div className="flex justify-between flex-1">
            <div className="w-1/2 flex flex-col items-center space-y-5 ">
              <img
                src="https://i.ibb.co/z40PwNW/map.png"
                alt="contact-us"
                width={350}
                height={420}
              />
              <ul className="w-[350px] px-5  text-lg [&_li]:flex [&_li]:gap-3 [&_li]:items-center space-y-5 ">
                <li>
                  <img
                    src="/src/assets/icons/location.svg"
                    alt="location"
                    width={20}
                    height={20}
                  />
                  <p className="">
                    Lorem ipsum dolor sit amet consectetur. Egestas sapien
                    lectus lobortis sit mattis vitae posuere
                  </p>
                </li>
                <li>
                  <img
                    src="/src/assets/icons/phone.svg"
                    alt="phone"
                    width={20}
                    height={20}
                  />
                  <p>+234 XXXX XXX XXXX</p>
                </li>
              </ul>
            </div>
            <div className="w-1/2 space-y-5">
              <h2 className="uppercase font-medium">Contact us</h2>
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
        <section className="w-full h-[300px] flex flex-row-reverse items-center bg-boat bg-cover bg-no-repeat bg-center relative text-white">
          <div className="w-full h-full bg-gradient-to-b from-white/0 from-50% to-blue-500/40 absolute z-[1]" />
          <div className="bg-black/80 w-full h-full absolute" />
          <div className="w-1/2 z-[1]">
            <p className="font-semibold text-2xl mb-8 ">
              Get started on your <br /> journey with us today!
            </p>
            <button className="bg-green-500 py-3 px-6 font-semibold text-sm">
              Get Started
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#111111] p-10 px-20 text-white ">
        <div className=" flex justify-between">
          <div className=" space-y-16">
            <img
              src="https://i.ibb.co/17zsqj1/logo2.png"
              alt="logo"
              width={176}
              height={60}
            />
            <ul className="flex items-center gap-4">
              <li>
                <img
                  src="/src/assets/icons/Instagram.svg"
                  alt="instagram"
                  width={20}
                  height={20}
                />
              </li>
              <li>
                <img
                  src="/src/assets/icons/Facebook.svg"
                  alt="facebook"
                  width={10}
                  height={10}
                />
              </li>
              <li>
                <img
                  src="/src/assets/icons/Twitter.svg"
                  alt="twitter"
                  width={20}
                  height={20}
                />
              </li>
              <li>
                <img
                  src="/src/assets/icons/Linkedin.svg"
                  alt="linkedin"
                  width={20}
                  height={20}
                />
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex gap-x-28 [&_a]:block [&_a]:mb-2 [&_a]:text-sm [&_a]:font-normal [&_h3]:font-medium [&_h3]:text-2xl [&_h3]:mb-5">
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
          </div>
        </div>
        <hr className="my-7" />
        <div className="flex justify-between ">
          <p>© 2023 Hello, Abitto</p>

          <ul className="flex gap-8">
            <li>Privacy</li>
            <li>Terms of Agreement</li>
            <li>Licenses</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;

const Navbar = () => {
  return (
    <nav className="absolute right-0 left-0 px-20 py-2 text-white flex items-center justify-between backdrop-blur-sm bg-[#1111111F] z-[1]">
      <img
        alt="logo"
        src="https://i.ibb.co/17zsqj1/logo2.png"
        width={176}
        height={60}
      />
      <ul className="flex *:uppercase *:font-semibold gap-x-3">
        <li>home</li>
        <li>about us</li>
        <li>contact us</li>
      </ul>
      <button className="bg-green-500 py-3 px-6 font-semibold text-sm">
        Get Started
      </button>
    </nav>
  );
};
