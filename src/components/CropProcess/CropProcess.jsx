import "./CropProcess.css";
import { useState, useRef, useEffect } from "react";
import "react-image-crop/dist/ReactCrop.css";
import preprocessImage from "../../util/preprocess";
import Tesseract from "tesseract.js";
import Loader from "../Loader/Loader";

export default function CropProcess({
  setUrl,
  crop,
  imgWidth,
  imgHeight,
  setLoading,
  setCrop,
}) {

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [tesseractResponse, setTesseractResponse] = useState("");
  const [chatgptResponse, setChatgptResponse] = useState({ ingredients: [] });
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [ingredientListLoading, setIngredientListLoading] = useState(false);

  // const image = crop;
  //   function preprocessImage(canvas) {
  //     const ctx = canvas.getContext('2d');
  //     const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //     // blurARGB(image.data, canvas, 1);
  //     // dilate(image.data, canvas);
  //     invertColors(image.data);
  //     thresholdFilter(image.data, 0.5);
  //     return image;
  // }

  // const loadCanvas = (e) => {
  // console.log(e.target.currentSrc);
  // }

  const reselectImage = () => {

    setCrop();
    setLoading(false);
    setUrl("");
  };

  const getIngredients = async () => {
    
    if (!crop) {
      alert("Please select an image!");
      return;
    }

    setIngredientListLoading(true);
    var canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // imgRef.current.src = crop.src

    const processedImage = await preprocessImage(
      crop,
      imgWidth,
      imgHeight,
      canvas,
      imgRef
    );
    // const ctx = canvas.getContext('2d');

    // ctx.fillStyle = "blue";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // console.log(imgWidth,imgHeight);

    // console.log("TEST",testt);
    // console.log(canvasRef.current.width, canvasRef.current.height);
    // console.log(imgWidth, imgHeight);
    // console.log(testt);
    ctx.putImageData(processedImage, 0, 0);
    // ctx.drawImage(testt.data,0,0)

    // ctx.drawImage(testt, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");

    Tesseract.recognize(dataUrl, "eng", {
      logger: (m) => console.log(m),
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        // Get Confidence score
        let confidence = result.confidence;
        console.log(confidence);
        // Get full output
        let text = result.data.text;
        console.log(result);

        console.log(result.data.text);
        setTesseractResponse(result.data.text);
      });
  };
  useEffect(() => {
    console.log(tesseractResponse);
    if (tesseractResponse == "") {
    } else {
      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `This is a list of ingredients for a recipe read inaccurately by OCR: 
            ${tesseractResponse}, Please read from it the list of ingredients with quantities and give it to me, it might not be in english, so don't try to translate it,
            in json format please, it is supposed to be an object 
            with an array named 'ingredients' which should have objects {name:'product name', quantity:'product quantity'} in it, soimetimes in the text the quantity might come before
             the product name so pay attention to that and place it in the object accordingly.`,
          },
          // ...apiMessages,
        ],
      };

      // console.log(process.env.REACT_APP_API_KEY);
      // console.log(API_KEY);

      // const fetchData = async () => {
      //   const response = await fetch(
      //     "https://api.openai.com/v1/chat/completions",
      //     {
      //       method: "POST",
      //       headers: {
      //         Authorization: "Bearer " + API_KEY,
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(apiRequestBody),
      //     }
      //   );
      //   const resp = await response.json();
      //   console.log(JSON.parse(resp.choices[0].message.content));

      //   setChatgptResponse(JSON.parse(resp.choices[0].message.content));
      //   setCrop(null);
      //   setIngredientListLoading(false);

      //   setLoading(false);
      //   setUrl("");
      //   return resp;
      // };

      // const data = fetchData();


      const fetchFakeData = async () => {
let resp = {
  "ingredients": [
    {
      "name": "rice vinegar",
      "quantity": "1 cup"
    },
    {
      "name": "soy sauce",
      "quantity": "1 tbsp"
    },
    {
      "name": "lime juice",
      "quantity": "2 tbsp"
    },
    {
      "name": "dark brown sugar",
      "quantity": "2 tbsp"
    },
    {
      "name": "water",
      "quantity": "2 tbsp"
    },
    {
      "name": "garlic, minced",
      "quantity": "1 clove"
    },
    {
      "name": "ginger, minced or grated",
      "quantity": "1 inch knob"
    },
    {
      "name": "dried chili flakes, or to taste",
      "quantity": "1 tsp"
    }
  ]
}
        setChatgptResponse({
          "ingredients": [
            {
              "name": "rice vinegar",
              "quantity": "1 cup"
            },
            {
              "name": "soy sauce",
              "quantity": "1 tbsp"
            },
            {
              "name": "lime juice",
              "quantity": "2 tbsp"
            },
            {
              "name": "dark brown sugar",
              "quantity": "2 tbsp"
            },
            {
              "name": "water",
              "quantity": "2 tbsp"
            },
            {
              "name": "garlic, minced",
              "quantity": "1 clove"
            },
            {
              "name": "ginger, minced or grated",
              "quantity": "1 inch knob"
            },
            {
              "name": "dried chili flakes, or to taste",
              "quantity": "1 tsp"
            }
          ]
        });
        setCrop(null);
        setIngredientListLoading(false);
        setLoading(false);
        setUrl("");
        return resp;
      };

      const data = fetchFakeData();

    }
  }, [tesseractResponse]);

  return (
    <div>
      {ingredientListLoading ? (
        <Loader />
      ) : (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <button className="button-86"onClick={getIngredients}>Get your ingredient list!</button>
          <button className="button-86"onClick={reselectImage}>Reselect image</button>
        </div>
      )}

      <ul>
        {chatgptResponse.ingredients.map(function (data) {
          return (
            <li>
              <div>
              <b>NAME:</b> {data.name}
              </div>
              <div>
              <b>QT : </b>{data.quantity}
              </div>
              <hr></hr>
            </li>
            
          );
        })}
      </ul>

      <canvas
        ref={canvasRef}
        className="finalCanvas"
        style={{ display: "none" }}
      />
      <img src="" alt="" ref={imgRef} style={{ display: "none" }} />
    </div>
  );
}
