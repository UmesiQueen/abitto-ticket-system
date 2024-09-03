import policyPDF from "@/assets/Abitto_Ferry_Privacy_Policy.pdf"
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Terms and Conditions | Abitto Ferry</title>
            </Helmet>
            <div className="pt-16">
                <iframe
                    src={policyPDF}
                    width="100%"
                    height="100%"
                    className="min-h-[calc(100vh-70px)]"
                    frameBorder="0"
                />
            </div>
        </>

    )
}

export default PrivacyPolicy
