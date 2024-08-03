const Notice = () => {
	return (
		<div className="bg-hero-pattern min-h-screen w-full bg-cover bg-no-repeat bg-center relative font-poppins">
			<div className="bg-black/40 w-full h-full absolute z-[1]" />
			<div className="px-5 max-w-[800px] w-full mx-auto z-[2] relative py-28">
				<div className="bg-blue-500 ">
					<div className="bg-white w-full min-h-72 py-16 md:p-10 px-10 flex flex-col gap-5 text-center justify-center font-semibold rounded-br-[200px] rounded-tl-[200px] text-sm md:text-base">
						<img
							alt="logo"
							src="https://i.ibb.co/Zh8H4Wz/logo3.png"
							width={200}
							height={150}
							className="ml-auto mb-2 w-40 md:w-52"
						/>
						<h1>Subject: Service Disruption Notice - August 1st, 2024</h1>
						<p className="text-blue-500 font-bold ">
							Dear Esteemed Passengers,
						</p>
						<p>
							We regret to inform you that due to the planned
							<span className="font-bold"> #EndBadGovernanceProtest </span>{" "}
							Thursday, 1st August 2024, for the Safety and security of you OUR
							CUSTOMER'S and our Staffs, our terminals will be closed. We
							apologize for any inconvenience this may cause and recommend
							contacting customer service on these numbers
							<br />
							<a
								href="tel:07077600307"
								className="text-blue-500 hover:text-blue-700 font-bold px-1"
							>
								07077600307(CAL TERMINAL)
							</a>
							<a
								href="tel:07077404553"
								className="text-blue-500 hover:text-blue-700 font-bold px-1"
							>
								07077404553 (UYO TERMINAL)
							</a>
							<br />
							for updates and assistance with rescheduling.
						</p>
						<p>Thank you for your understanding and patience.</p>
						<p>Best regards.</p>
						<div className="border-t border-gray-400 md:mx-20 pt-4">
							<a href="https://www.abittoferry.com/">WWW.ABITTOFERRY.COM</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notice;
