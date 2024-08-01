const express = require("express");
const app = express();
const cors = require("cors");
const getLabels = require("../google-vision");
const getAllSongs = require("../spotify-queries");
const port = 5000;

app.use(
  cors({
    origin: [`http://localhost:5173`],
    credentials: true,
  })
);
app.use(express.json()); // Use express.json() to parse JSON bodies

app.post("/analyze-image", async (req, res) => {
  const { imageList } = req.body;

  // get labels from google vision
  let all_labels;
  await getLabels(imageList).then((res) => (all_labels = res));

  let final_result;
  await getAllSongs(all_labels).then((res) => (final_result = res));

  res.status(200).send(final_result);
  console.log(`Final list: ${final_result}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
