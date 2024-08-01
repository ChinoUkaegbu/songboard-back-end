const axios = require("axios");
const randomizer = require("./randomizer");
const getSpotifyToken = require("./spotify-auth");
const analyzeVibe = require("./send-gemini-request");
require("dotenv").config();

// to use for getting token
let spotifyToken = null;
let tokenExpiryTime = null;

// returns two playlists matching the search query
const getPlaylist = async (search_query) => {
  const token = await getSpotifyToken(spotifyToken, tokenExpiryTime);
  const api_url = "https://api.spotify.com/v1/search";

  try {
    const response = await axios.get(api_url, {
      params: { q: search_query, type: "playlist", limit: 10 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const playlists = response.data.playlists.items.map((item) => ({
      playlist_id: item.id,
      playlist_name: item.name,
    }));

    const { rand_data_1, rand_data_2 } = await randomizer(playlists);
    // console.log("meow", rand_data_1, rand_data_2);
    return [rand_data_1, rand_data_2];
  } catch (error) {
    console.error("Error in getPlaylist:", error);
  }
};

const getSongFromPlaylist = async (playlist_id) => {
  const token = await getSpotifyToken(spotifyToken, tokenExpiryTime);
  const api_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

  try {
    const response = await axios.get(api_url, {
      params: {
        offset: 0,
        limit: 10,
        fields: "items(track(id,name,href))",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const songs = response.data.items
      .filter((item) => item.track) // filter out null tracks
      .map((item) => ({
        song_id: item.track.id,
        song_name: item.track.name,
        song_href: item.track.href,
      }));

    const { rand_data_1, rand_data_2, isOne } = await randomizer(songs);
    if (isOne) return [rand_data_1]; //if there's only one song, return just the song
    return [rand_data_1, rand_data_2];
  } catch (error) {
    console.error("Error in getSongFromPlaylist:", error);
  }
};

const getAllSongs = async (nested_array) => {
  let vibes;
  try {
    vibes = await analyzeVibe(nested_array);
  } catch (error) {
    console.error("Error in analyzeVibe:", error);
    return;
  }

  const all_songs = [];

  try {
    await Promise.all(
      vibes.map(async (vibe) => {
        const playlists = await getPlaylist(vibe);
        await Promise.all(
          playlists.map(async (playlist) => {
            const songs = await getSongFromPlaylist(playlist.playlist_id);
            all_songs.push(songs);
          })
        );
      })
    );
  } catch (error) {
    console.error("Error in getAllSongs:", error);
  }

  // console.log(all_songs, all_songs.length);
  return all_songs;
};

module.exports = getAllSongs;
