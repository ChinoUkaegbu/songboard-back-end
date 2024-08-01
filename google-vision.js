require("dotenv").config();
const vision = require("@google-cloud/vision");

const credential = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
);

// Create a client
// const client = new vision.ImageAnnotatorClient({
//   keyFilename: "../KeepSafe/boardsong-143-79ceb15a2ef7.json",
// });

const client = new vision.ImageAnnotatorClient({
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  },
});

all_labels = [];

const getLabels = async (imageList) => {
  const all_labels = [];

  for (const imageUrl of imageList) {
    try {
      const [result] = await client.labelDetection(imageUrl);
      const labels = result.labelAnnotations;
      const image_label = labels.map((label) => label.description);
      all_labels.push(image_label);
      // console.log(image_label);
    } catch (error) {
      console.error(`Error processing image ${imageUrl}:`, error.message);
    }
  }
  return all_labels;
};

module.exports = getLabels;
