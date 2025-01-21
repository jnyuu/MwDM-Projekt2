// import logo from "./logo.svg";
import "./App.css";
import { TopSection } from "./components/TopSection/TopSection";
import ImageCrop from "./components/ImageCrop/ImageCrop";
import { useRef, useState } from "react";
import CropProcess from "./components/CropProcess/CropProcess";

function App() {
  const [url, setUrl] = useState("");
  const [crop, setCrop] = useState();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // const [canvas, setCanvas] = useState()
  const [imgWidth, setImgWidth] = useState();
  const [imgHeight, setImgHeight] = useState();

  // const canvasRef = useRef(null);

  return (
    <div className="App">
      <h2 className="title">Ingredient list OCR</h2>
      {loading ? (
        <></>
      ) : (
        <TopSection
          setUrl={setUrl}
          inputValue={inputValue}
          setInputValue={setInputValue}
          setLoading={setLoading}
        />
      )}
      {url && (
        <ImageCrop
          url={url}
          setFinalCrop={setCrop}
          setImgWidth={setImgWidth}
          setImgHeight={setImgHeight}
          setUrl={setUrl}
          setInputValue={setInputValue}
        />
      )}
      <>
        {/* <canvas ></canvas> */}
        <CropProcess
          setUrl={setUrl}
          crop={crop}
          imgWidth={imgWidth}
          imgHeight={imgHeight}
          setLoading={setLoading}
          setCrop={setCrop}
        />
      </>
    </div>
  );
}

export default App;
