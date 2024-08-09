import { useEffect, useRef, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
  highlightPlugin,
  Trigger,
  HighlightArea,
  SelectionData,
  MessageIcon,
  renderHighlightTargetProps
} from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import { Button, Position, Tooltip } from "@react-pdf-viewer/core";

const PdfViewer = ({ pdfFile }) => {
  const viewerRef = useRef(null);

  const renderHighlightTarget = (props) => (
    <div
      style={{
        background: '#eee',
        display: 'flex',
        position: 'absolute',
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: 'translate(0, 8px)',
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={props.toggle}>
            <MessageIcon />
          </Button>
        }
        content={() => <div style={{ width: '100px' }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  )

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    // trigger: Trigger.None,
  });

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div style={{ height: '88vh' }} ref={viewerRef}>
        <Viewer fileUrl={pdfFile} plugins={[highlightPluginInstance]} />
      </div>
    </Worker>
  );
};

export default PdfViewer;

