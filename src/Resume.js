import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function Resume() {
    return (
        <div>
            <iframe
                title="file"
                style={{ width: '100%', height: '100%' }}
                src={"../public/resume.pdf"}
            />
        </div>
    )
}
