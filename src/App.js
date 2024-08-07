import './App.css';
import PdfViewer from './PdfViewer';
import pdfFile from "./pg-test.pdf";

function App() {
  return (
    <div className="App">
      <h2>react-pdf-viewer/core highlight</h2>
      <PdfViewer pdfFile={pdfFile}/>
    </div>
  );
}

export default App;
