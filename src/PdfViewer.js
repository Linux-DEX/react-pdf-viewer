import React, { useEffect, useRef } from 'react';
import { Worker, Viewer, RenderPageProps } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import demoFile from './pg-test.pdf';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

export default function PdfViewer() {
  const viewerRef = useRef(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const pdfViewer = viewerRef.current;

    if (pdfViewer) {
      const pdfViewerInstance = pdfViewer.querySelector('.rpv-core__viewer');
      
      if (pdfViewerInstance) {
        const handleLinkClick = (event) => {
          const target = event.target;

          if (target.tagName === 'A' && target.href) {
            event.preventDefault();
            //console.log('Link clicked:', target.href);
            alert("link is working")

            const annotationElement = target.closest('.rpv-core__annotation');

            if (annotationElement) {
              const { style } = annotationElement;
              console.log('Annotation style properties:');
              console.log('Height:', style.height);
              console.log('Left:', style.left);
              console.log('Top:', style.top);
              console.log('Width:', style.width);
            }
          }
        };

        if(pdfViewerInstance){
          pdfViewerInstance.addEventListener('click', handleLinkClick);
          console.log(pdfViewerInstance)
        }

        return () => {
          pdfViewerInstance.removeEventListener('click', handleLinkClick);
        };
      }
    }
  }, [viewerRef]);

  //const renderPage = (props) => {
  //  return (
  //      <>
  //          {props.canvasLayer.children}
  //          <div style={{ userSelect: 'none' }}>
  //              {props.textLayer.children}
  //          </div>
  //          {props.annotationLayer.children}
  //      </>
  //  );
  //};

    const renderPage = (props) => {
    const { canvasLayer, textLayer, annotationLayer } = props;

    // Enhance the text layer spans with data-text attributes
    React.Children.forEach(textLayer.children, (child) => {
      if (child.props && child.props.textContent) {
        child = React.cloneElement(child, {
          'data-text': child.props.textContent
        });
      }
    });

    return (
      <>
        {canvasLayer.children}
        <div style={{ userSelect: 'none' }}>
          {textLayer.children}
        </div>
        {annotationLayer.children}
      </>
    );
  };

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div style={{ height: '88vh' }} ref={viewerRef}>
        <Viewer 
          fileUrl={demoFile} 
          renderPage={renderPage} 
          plugins={[defaultLayoutPluginInstance]}
        />
      </div>
    </Worker>
  );
}

