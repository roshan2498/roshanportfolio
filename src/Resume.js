import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import "react-pdf/dist/esm/Page/TextLayer.css"
import "./resume.css";
import useDeviceType from "./useDeviceType";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const Resume = () => {
    const isMobile = useDeviceType();
    const pdfUrl = 'https://raw.githubusercontent.com/roshan2498/roshanportfolio/main/public/resume.pdf';

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'resume.pdf';
        link.click();
    };

    return (
        <div className="container">
            <div className="button-container">
                <button className="btn btn-success" onClick={handleDownload}>Download</button>
            </div>
            <div >
                <Document file={pdfUrl} options={{ workerSrc: pdfjs.GlobalWorkerOptions.workerSrc }} >
                    <Page pageNumber={1} scale={isMobile ? 1 : 2} />
                </Document>
            </div>
        </div>
    );
};

export default Resume;

