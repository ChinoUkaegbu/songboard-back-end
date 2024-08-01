const express = require("express");
const axios = require("axios");
const { getBoards, getPins } = require("../pinterest_queries");
const app = express();
const cors = require("cors");

app.use(cors());

require("dotenv").config();

let accessToken;

app.get("/auth/pinterest/callback", async (req, res) => {
  const authorizationCode = req.query.code;
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  const redirectUri = "http://localhost:3000/auth/pinterest/callback"; // This should match the one used in the frontend

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

    accessToken = response.data.access_token;

    // Redirect to the homepage or another page in your application
    console.log(response.data);
    res.redirect("http://localhost:5173/pinterest-select"); // Adjust the redirect URL as needed
  } catch (error) {
    res.status(500).send("Error during Pinterest OAuth");
  }
});

app.get("/pinterest/queries", async (req, res) => {
  try {
    all_boards = await getBoards(accessToken);
    res.status(200).send(all_boards);
  } catch (error) {
    res.status(404).send("Error in getting boards");
  }
});

app.get("/pinterest/queries/pins", async (req, res) => {
  const board_id = req.query.board_id;
  try {
    pins = await getPins(accessToken, board_id);
    res.status(200).send(pins);
  } catch (error) {
    res.status(404).send("Error in getting pins");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
