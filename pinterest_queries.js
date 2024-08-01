const axios = require("axios");

const getBoards = async (accessToken) => {
  try {
    const response = await axios.get("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    all_boards = response.data.items.map((board) => ({
      id: board.id,
      name: board.name,
      description: board.description,
      pin_count: board.pin_count,
      image: board.media.image_cover_url,
    }));
    return all_boards;
  } catch (error) {
    console.error("Error fetching boards:", error.message);
  }
};

const getPins = async (accessToken, board_id) => {
  try {
    const response = await axios.get(
      `https://api.pinterest.com/v5/boards/${board_id}/pins`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          page_size: 10,
        },
      }
    );
    const imagePins = response.data.items
      .filter((pin) => pin.media.media_type === "image")
      .map((pin) => pin.media.images["600x"].url);

    // console.log(imagePins);
    return imagePins;
  } catch (error) {
    console.error("Error fetching pins:", error.message);
  }
};

module.exports = { getBoards, getPins };
