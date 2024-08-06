import React, { useEffect, useRef } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import demoFile from './pg-test.pdf';

export default function PdfViewer() {
  const viewerRef = useRef(null);

  useEffect(() => {
    const pdfViewer = viewerRef.current;

    if (pdfViewer) {
      const pdfViewerInstance = pdfViewer.querySelector('.rpv-core__viewer');
      
      if (pdfViewerInstance) {
        const handleLinkClick = (event) => {
          const target = event.target;

          if (target.tagName === 'A' && target.href) {
            event.preventDefault();
            console.log('Link clicked:', target.href);
          }
        };

        pdfViewerInstance.addEventListener('click', handleLinkClick);

        return () => {
          pdfViewerInstance.removeEventListener('click', handleLinkClick);
        };
      }
    }
  }, [viewerRef]);

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div style={{ height: '88vh' }} ref={viewerRef}>
        <Viewer fileUrl={demoFile} />
      </div>
    </Worker>
  );
}

