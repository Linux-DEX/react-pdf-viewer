import './App.css';
import PdfViewer from './PdfViewer';
//import pdfUrl from "./fastapi.pdf";
import pdfUrl from "./pg-test.pdf";

function App() {
  return (
    <div className="App">
      <h2>react-pdf-viewer/core package</h2>
      <PdfViewer pdfUrl={pdfUrl}/>
    </div>
  );
}

export default App;
