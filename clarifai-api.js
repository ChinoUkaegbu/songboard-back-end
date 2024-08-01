require("dotenv").config();
const axios = require("axios");

let all_labels = [];

const PAT = process.env.CLARIFAI_PAT;
const USER_ID = "clarifai";
const APP_ID = "main";
const MODEL_ID = "general-image-recognition";

const getLabels = async (imageList) => {
  const data = {
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: imageList.map((url) => ({
      data: {
        image: {
          url: url,
        },
      },
    })),
  };

  try {
    const response = await axios.post(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`,
      data,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Key " + PAT,
        },
      }
    );

    // Extract and store results in the global array
    all_labels = response.data.outputs.map((output) =>
      output.data.concepts.map((concept) => concept.name).slice(0, 10)
    );
  } catch (error) {
    console.log("error", error);
  }
  return all_labels;
};

module.exports = getLabels;
