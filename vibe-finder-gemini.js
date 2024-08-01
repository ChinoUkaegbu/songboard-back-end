require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY); //access key saved in env

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const return_vibes = async (description_string) => {
  prompt = `The following words describe the labels assigned to an image (${description_string}). Strictly return only a list of 5 words, separated by commas describing the overall vibe of the image`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

module.exports = return_vibes;
