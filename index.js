const express = require("express");
const axios = require("axios");
const session = require("express-session");
const cors = require("cors");

const { getBoards, getPins } = require("./pinterest_queries");
const getLabels = require("./clarifai-api");
const getAllSongs = require("./spotify-queries");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [`https://songboard-front-end.vercel.app`],
    credentials: true,
  })
);
require("dotenv").config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "None" }, // Use 'true' if using HTTPS
  })
);

app.use(express.json()); // Use express.json() to parse JSON bodies

//PINTEREST PORTION
app.get("/auth/pinterest/callback", async (req, res) => {
  const authorizationCode = req.query.code;
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  const redirectUri =
    "https://songboard-back-end.vercel.app/auth/pinterest/callback"; // This should match the one used in the frontend

  const authString = `${clientId}:${clientSecret}`;
  const authHeader = "Basic " + Buffer.from(authString).toString("base64");

  // Prepare the request body
  const data = new URLSearchParams({
    grant_type: "authorization_code",
    code: authorizationCode,
    redirect_uri: redirectUri,
  });

  try {
    const response = await axios.post(
      "https://api.pinterest.com/v5/oauth/token",
      data,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    req.session.accessToken = response.data.access_token; // Store the access token in the session
    req.session.save(); // Save the session

    // console.log(response.data);
    res.redirect("https://songboard-front-end.vercel.app/pinterest-select"); //adjust redirect url when deploying
  } catch (error) {
    res.status(500).send("Error during Pinterest OAuth");
  }
});

app.get("/pinterest/queries/boards", async (req, res) => {
  const accessToken = req.session.accessToken; // Retrieve the access token from the session
  if (!accessToken) {
    return res.status(401).send("Access token not found");
  }

  try {
    const all_boards = await getBoards(accessToken);
    res.status(200).send(all_boards);
  } catch (error) {
    res.status(404).send("Error in getting boards");
  }
});

app.get("/pinterest/queries/pins", async (req, res) => {
  const accessToken = req.session.accessToken; // Retrieve the access token from the session
  const board_id = req.query.board_id;
  if (!accessToken) {
    return res.status(401).send("Access token not found");
  }

  try {
    const pins = await getPins(accessToken, board_id);
    res.status(200).send(pins);
  } catch (error) {
    res.status(404).send("Error in getting pins");
  }
});

// REST OF LOGIC

app.post("/analyze-image", async (req, res) => {
  const { imageList } = req.body;

  // get labels from google vision
  const all_labels = await getLabels(imageList);

  // return all songs
  const final_result = await getAllSongs(all_labels);

  res.status(200).send(final_result);
  // console.log(`Final list: ${final_result}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
