import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import demoFile from "./pg-test.pdf"; 

export default function PdfViewer() {

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div style={{ height: "88vh" }}>
        <Viewer fileUrl={demoFile} />
      </div>
    </Worker>
  );
}



