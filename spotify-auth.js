require("dotenv").config();
const axios = require("axios");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const getSpotifyToken = async (spotifyToken, tokenExpiryTime) => {
  if (spotifyToken && tokenExpiryTime && new Date() < tokenExpiryTime) {
    return spotifyToken;
  }

  const tokenUrl = "https://accounts.spotify.com/api/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
  };
  const data = "grant_type=client_credentials";

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    spotifyToken = response.data.access_token;
    tokenExpiryTime = new Date(
      new Date().getTime() + response.data.expires_in * 1000
    );
    return spotifyToken;
  } catch (error) {
    console.error("Error fetching Spotify token:", error.response.data);
    throw error;
  }
};

module.exports = getSpotifyToken;
