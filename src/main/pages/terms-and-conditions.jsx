import termsPDF from "@/assets/Abitto_Ferry_Terms_and_Conditions.pdf"
import { Helmet } from "react-helmet-async";
import React from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { GlobalCTX } from "@/contexts/GlobalContext";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

const TermsAndConditions = () => {
    const [numPages, setNumPages] = React.useState();
    const [containerRef, setContainerRef] = React.useState(null);
    const [containerWidth, setContainerWidth] = React.useState();
    const { setLoading } = React.useContext(GlobalCTX)

    const onResize = React.useCallback((entries) => {
        const [entry] = entries;
        if (entry) {
            setContainerWidth(entry.contentRect.width);
        }
    }, []);

    useResizeObserver(containerRef, resizeObserverOptions, onResize);

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
        setLoading(false);
    }

    return (
        <>  <Helmet>
            <title>Terms and Conditions | Abitto Ferry</title>
        </Helmet>
            <div className="pt-20 pb-4 min-h-[calc(100vh-70px)]" ref={setContainerRef}>
                <Document file={termsPDF} onLoadSuccess={onDocumentLoadSuccess} loading={() => setLoading(true)} options={options} className="flex flex-col items-center">
                    {Array.from(new Array(numPages), (_el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                        />
                    ))}
                </Document>
            </div>
        </>
    );
}

export default TermsAndConditions
