const return_vibes = require("./vibe-finder-gemini");

const removeAsterisksAndNewlines = (str) => {
  return str.replace(/[*\n\r]/g, ""); // strip out asterisks, new lines, etc
};

const analyzeVibe = async (nested_array) => {
  const nested_string = nested_array.map((arr) => arr.join(", ")).join(", ");
  const init_output = await return_vibes(nested_string);

  const vibe_array = removeAsterisksAndNewlines(init_output).split(","); //parse and split to array
  console.log(vibe_array);
  return vibe_array;
};

module.exports = analyzeVibe;
