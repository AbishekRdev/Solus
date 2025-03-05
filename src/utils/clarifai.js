import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

import axios from "axios";
import { ApiError } from "./ApiError.js";

const CLARIFAI_PAT = process.env.CLARIFAI_PAT;
const MODELS = [
  { id: "general-image-recognition", version: "aa7f35c01e0642fda5cf400f543e7c40", name: "General Recognition" },
  { id: "color-recognition", version: "dd9458324b4b45c2be1a7ba84d27cd04", name: "Color Recognition" }
];




const analyzeImage = async (IMAGE_URL) => {
  try {
    // Make both API requests concurrently using Promise.all
    const responses = await Promise.all(
      MODELS.map((model) => 
        axios.post(
          `https://api.clarifai.com/v2/models/${model.id}/versions/${model.version}/outputs`,
          { inputs: [{ data: { image: { url: IMAGE_URL } } }] },
          { headers: { Authorization: `Key ${CLARIFAI_PAT}`, "Content-Type": "application/json" } }
        ).then(response => ({ model, data: response.data.outputs[0].data }))
      )
    );

    // Extract and process the responses for colors and concepts
    const result = responses.reduce((acc, { model, data }) => {
      if (model.id === "color-recognition") {
        acc.colors = data.colors.slice(0,8).map(color => ({
          name: color.w3c.name,
          hex: color.w3c.hex,
          confidence: parseFloat(color.value.toFixed(2))
        }));
      } else {
        acc.concepts = data.concepts.slice(0,5).map(concept => ({
          name: concept.name,
          value: parseFloat(concept.value.toFixed(2))
        }));
      }
      return acc;
    }, {});

    return result;
  } catch (error) {
    console.error("❌ Error in analyzing image:", error.response?.data || error.message);
    throw  new ApiError(400,"something went wrong while processing the Image meta data ");
  }
};




export { analyzeImage };
