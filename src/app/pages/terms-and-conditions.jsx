const TermsAndConditions = () => {
    return (
        <>
            <div className=" shadow-md h-60 pt-20 inline-flex items-center justify-center w-full bg-blue-50">
                <h1 className="px-5 text-xl md:text-2xl font-semibold text-blue-500 text-center">Terms and Conditions for Abitto Ferry Services </h1>
            </div>
            <div className="px-5 mt-10 mb-20 text-justify">
                <section className="max-w-[1000px] mx-auto space-y-8 [&_h2]:mb-3 md:[&_h2]:mb-5 md:text-lg [&_h2]:font-semibold [&_h2]:text-lg  md:[&_h2]:text-xl">
                    <ol className=" *:list-decimal *:marker:font-semibold  *:marker:text-lg  *:md:marker:text-xl px-5 space-y-8">
                        <li>
                            <h2>Acceptance of Terms</h2>
                            <p className="sm:ml-5">By purchasing a ticket and boarding any of our ferries, you agree to abide by these Terms and Conditions. These Terms and Conditions apply to all passengers and are non-negotiable. </p>
                        </li>
                        <li>
                            <h2>Use of Personal Data</h2>
                            <ul className="*:list-disc ml-5 md:ml-10 space-y-3">
                                <li>Ticket Validity: All tickets purchased are valid only for the specific date and time indicated on the ticket.</li>
                                <li>Non-Refundable Tickets: Tickets are non-refundable under any circumstances. This includes missed trips due to personal reasons, late arrival, or other factors beyond the control of the ferry service.</li>
                                <li>Rescheduling: Should you wish to reschedule your trip, a rescheduling fee equal to 50% of the original ticket price will apply. Rescheduling is subject to availability and must be done at least 24 hours before the scheduled departure time.</li>
                            </ul>
                        </li>
                        <li>
                            <h2>Ticket Purchase and Use </h2>
                            <ul className="*:list-disc ml-5 md:ml-10 space-y-3">
                                <li>Third-Party Service Providers: We may share your personal data with trusted third-party service providers who assist us in operating our business, such as payment processors, IT service providers, and marketing agencies. These providers are contractually obligated to protect your data and use it only for the purposes specified by us.</li>
                                <li>Legal Requirements: We may disclose your personal information if required by law, court order, or government request, or if we believe it is necessary to protect our rights, property, or the safety of our customers and the public.</li>
                                <li>Business Transfers: In the event of a merger, acquisition, or sale of our company, your personal data may be transferred to the new owners or partners as part of the business assets.</li>
                            </ul>
                        </li>
                        <li>
                            <h2>Boarding and Conduct </h2>
                            <ul className="*:list-disc ml-5 md:ml-10 space-y-3">
                                <li>Check-In: Passengers are required to check in at least 30 minutes before the scheduled departure time. Failure to check in on time may result in the forfeiting of your seat without a refund. </li>
                                <li>Behavior: All passengers must adhere to safety regulations and follow instructions provided by the ferry staff. The company reserves the rights to refuse boarding or remove any passenger who poses a threat to the safety of others or engages in disruptive behavior. </li>
                            </ul>
                        </li>
                        <li>
                            <h2>Baggage and Personal Belongings </h2>
                            <ul className="*:list-disc ml-5 md:ml-10 space-y-3">
                                <li>Baggage Allowance: Each passenger is allowed to bring 10kg one carry- on and not more than one personal item. Additional baggage may incur extra fees. </li>
                                <li>Lost or Damaged Baggage: The ferry service is not responsible for any lost, stolen, or damaged baggage. Passengers are encouraged to keep valuable items with them at all times. If any baggage is lost or damaged, it is the responsibility of the passenger to report it immediately to the ferry staff. </li>
                                <li>Unclaimed Baggage: Any baggage left on the ferry after disembarkation will be kept for a maximum of 7days. If unclaimed within this period, the company reserves the right to dispose of the items without further notice. </li>
                            </ul>
                        </li>
                        <li>
                            <h2>Cancellations and Delays</h2>
                            <ul className="*:list-disc ml-5 md:ml-10 space-y-3">
                                <li>Service Cancellations: In the event of a cancellation due to weather conditions, mechanical issues, or other unforeseen circumstances, the company will offer a full refund or the option to reschedule the trip at no additional cost. </li>
                                <li>Delays: The ferry service endeavors to operate on schedule. However, the company is not liable for any delays caused by factors beyond its control, including but not limited to weather conditions, mechanical issues, or port traffic. </li>
                            </ul>
                        </li>
                        <li>
                            <h2>Liability</h2>
                            <ul className="*:list-disc ml-5 md:ml-10 space-y-3">
                                <li>Personal Injury: The ferry service is committed to ensuring the safety of all passengers. However, the company is not liable for any personal injuries sustained during the trip unless caused by gross negligence on the part of the ferry service.</li>
                                <li>Third-Party Services: The ferry service may offer or recommend third- party services, such as tours or transportation. The company is not responsible for the quality or reliability of these third-party services and shall not be held liable for any claims arising from their use. </li>
                            </ul>
                        </li>
                        <li>
                            <h2>Governing Law </h2>
                            <p className="sm:ml-5">These Terms and Conditions are governed by and construed in accordance with the laws of Nigeria. Any disputes arising from these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts in Nigeria. </p>
                        </li>
                        <li>
                            <h2>Amendments</h2>
                            <p className="sm:ml-5">The ferry service reserves the right to amend these Terms and Conditions at any time without prior notice. Any changes will be elective immediately upon posting on our website or other communication channels. </p>
                        </li>
                        <li>
                            <h2>Contact Information </h2>
                            <p className="sm:ml-5">For any questions or concerns regarding these Terms and Conditions, please contact our customer service department at {" "}
                                <a
                                    href="tel:+2347075206333"
                                    className="text-blue-500 hover:text-blue-700 transition ease-in-out"
                                >
                                    +2347075206333
                                </a> {" "} or {" "}
                                <a
                                    href="mailto:abittoglobalservicesliomited@gmail.com"
                                    className="text-blue-500 hover:text-blue-700 transition ease-in-out"
                                >
                                    abittoglobalservicesliomited@gmail.com
                                </a>
                            </p>
                        </li>
                    </ol>
                </section>
            </div>
        </>
    )
}

export default TermsAndConditions
