// import React from 'react'
import termsPDF from "@/assets/Abitto_Ferry_Terms_and_Conditions.pdf"
import { Helmet } from "react-helmet-async";

const TermsAndConditions = () => {
    return (
        <>
            <Helmet>
                <title>Terms and Conditions | Abitto Ferry</title>
            </Helmet>
            <div className="pt-16">
                <iframe
                    src={termsPDF}
                    width="100%"
                    height="100%"
                    className="min-h-[calc(100vh-70px)]"
                    frameBorder="0"
                />
            </div>
        </>

    )
}

export default TermsAndConditions
