const Notice = () => {
  return (
    <div className="bg-hero-pattern h-[800px] lg:h-screen w-screen bg-cover bg-no-repeat bg-center relative font-poppins">
      <div className="bg-black/40 w-full h-full absolute z-0 md:flex justify-center ">
        <div className="mt-16 md:mt-20 flex flex-col items-center px-5 md:px-0">
          <img
            alt="logo"
            src="https://i.ibb.co/17zsqj1/logo2.png"
            width={200}
            height={150}
            className="mb-6"
          />
          <div className="h-fit w-full md:w-[700px] p-[10px] md:p-5 bg-white self-center border-[10px] md:border-[20px] border-white/92 space-y-5 text-sm  md:text-base !leading-7">
            <p>
              Dear Valued Customer,
              <span className="py-1 block" />
              We are currently out of service. We are experiencing some
              technical issues and our team is working quickly to fix this
              issue.
              <br /> Our deepest apologies for this service interruption or the
              inconvenience you may have faced while using our ferry service. We
              assure you that we are committed to providing better quality
              service on your next trip. <br />
              Your feedback and suggestions are important to us, so please share
              any thoughts on how we can serve you better. Reach us on{" "}
              <a
                href="mailto:info.abittoferryservices@gmail.com"
                className="text-blue-500 hover:text-blue-700"
              >
                our email.
              </a>
              <span className="py-1 block" />
              Thank you for your understanding and patience. <br />
            </p>
            <p>
              Warm regards,
              <span className="py-1 block" />
              {/* <img
                alt="sign"
                src="https://i.ibb.co/YWpsr0Q/signature.png"
                width={150}
                height={50}
                className="-ml-7 -my-2"
              /> */}
              <b>ABITTO FERRY SERVICES</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
