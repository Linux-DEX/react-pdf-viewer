import { useEffect, useRef, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

const PdfViewer = ({pdfFile}) => {
  const viewerRef = useRef(null);
  const [selectedText, setSelectedText] = useState("");
  const [boundingBox, setBoundingBox] = useState(null);
  const [coordinates, setCoordinates] = useState([
    {
      pageIndex: 0,
      top: 31.7,
      left: 14.5,
      width: 5.6,
      height: 1.5,
      id: "joseph",
    },
    {
      pageIndex: 0,
      top: 31.7,
      left: 54.7,
      width: 9.9,
      height: 1.5,
      id: "hypertension",
    },
    {
      pageIndex: 0,
      top: 31.7,
      left: 65.3,
      width: 6.4,
      height: 1.5,
      id: "disbetes",
    },
  ]);

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString();
      if (text) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (viewerRef.current) {
          const { left, top } = viewerRef.current.getBoundingClientRect();
          setSelectedText(text);
          setBoundingBox({
            x: rect.left - left,
            y: rect.top - top,
            width: rect.width,
            height: rect.height,
          });
        }
      }
    };

    document.addEventListener("mouseup", handleTextSelection);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, []);


  const handleTextClick = (id) => {
    alert(`<h1>Text with ID ${id} clicked</h1>`);
  };

  const renderHighlights = (props) => (
    <div ref={viewerRef}>
      {coordinates
        .filter((coordinate) => coordinate.pageIndex === props.pageIndex)
        .map((coordinate) => (
          <div
            onClick={() => handleTextClick(coordinate.id)}
            key={coordinate.id}
            className="highlight-coordinate"
            style={Object.assign(
              {},
              {
                position: 'absolute', // Ensure highlights are correctly positioned
                background: "#6600ff66",
                opacity: 0.4,
                zIndex: "1",
                borderBottom: "2px solid #6600ff",
              },
              props.getCssProperties(coordinate, props.rotation)
            )}
          />
        ))}
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
    trigger: Trigger.None,
  });

  return (
    <div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfFile} plugins={[highlightPluginInstance]} />
      </Worker>
    </div>
  );
};

export default PdfViewer;

