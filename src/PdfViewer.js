import React, { useRef, useEffect, useState } from 'react';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfUrl }) => {
  const canvasRef = useRef(null);
  const [pageText, setPageText] = useState({});
  const [selectedText, setSelectedText] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdfDoc = await getDocument(pdfUrl).promise;
        setNumPages(pdfDoc.numPages);
        await renderPage(pageNumber, pdfDoc);
        await loadTextContent(pdfDoc);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pdfUrl, pageNumber]);

  const loadTextContent = async (pdfDoc) => {
    const texts = {};
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      texts[i] = textContent.items.map(item => ({
        str: item.str,
        transform: item.transform
      }));
    }
    setPageText(texts);
  };

  const renderPage = async (pageNumber, pdfDoc) => {
    if (!canvasRef.current) return;

    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport
    };
    await page.render(renderContext).promise;
  };

  const handleClick = (event) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const selectedText = extractTextAtPosition(x, y);
    setSelectedText(selectedText);
  };

  const extractTextAtPosition = (x, y) => {
    const pageTextItems = pageText[pageNumber] || [];
    for (const item of pageTextItems) {
      const [a, b, c, d, e, f] = item.transform;
      const itemX = e;
      const itemY = f;
      const width = a;
      const height = d;

      if (x >= itemX && x <= itemX + width && y >= itemY && y <= itemY + height) {
        return item.str;
      }
    }
    return 'No text found';
  };

  const handlePageChange = (newPageNumber) => {
    if (newPageNumber < 1 || newPageNumber > numPages) return;
    setPageNumber(newPageNumber);
  };

  return (
    <div>
      <div>
        <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber <= 1}>
          Previous
        </button>
        <span> Page {pageNumber} of {numPages} </span>
        <button onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ border: '1px solid black' }}
      />
      {selectedText && (
        <div>
          <div>Selected Text: {selectedText}</div>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;


