const axios = require("axios");

async function analyzeImages() {
  // images from https://www.pinterest.com/alexaguila1017/cute-diy-room-decor/
  const imageList = [
    "https://i.pinimg.com/564x/b1/51/bc/b151bcb356b720f234d6c184680c56d0.jpg",
    "https://i.pinimg.com/736x/d1/1a/96/d11a964be8c2cada78c6bb72e88255b0.jpg",
    "https://i.pinimg.com/564x/be/8b/3f/be8b3fea66323e7bf0ff0f12f0c4332d.jpg",
    "https://i.pinimg.com/564x/e4/46/55/e44655510a39da0b123cd5fae249779d.jpg",
    "https://i.pinimg.com/564x/b0/42/f4/b042f43b81d3fda6cd8f6583a068c524.jpg",
    "https://i.pinimg.com/564x/d3/bd/c0/d3bdc0f051e9499ef311c0883e0da42e.jpg",
    "https://i.pinimg.com/564x/d7/19/83/d71983043bff217499d546ef8466f0f9.jpg",
    "https://i.pinimg.com/564x/0d/0b/13/0d0b1307f637bed27c0bdd8d897ed61e.jpg",
    "https://i.pinimg.com/564x/13/93/80/1393801f6f3f37d4f9994037f0ac85a5.jpg",
    "https://i.pinimg.com/564x/2f/c6/5e/2fc65e0d01c88caec9c2ae6f1092d2d6.jpg",
  ];

  try {
    const response = await axios.post("http://localhost:5000/analyze-image", {
      imageList,
    });

    console.log("Response from server:", response.data);
    console.log("Response length:", response.data.length);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

analyzeImages();
