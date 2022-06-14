const devOptions = {
  format: "A4",
  orientation: "portrait",
  border: "10mm",
};

const prodOptions = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
};

const devSizes = {
  "2s": {
    text: "100px",
    text_main: "600px",
  },
  "3s": {
    text: "150px",
    text_main: "400px",
  },
  "3w": {
    text: "60px",
    text_main: "580px",
  },
  "6s": {
    text: "60px",
    text_main: "400px",
  },
};

const prodSizes = {
  "2s": {
    text: "100px",
    text_main: "680px",
  },
  "3s": {
    text: "160px",
    text_main: "460px",
  },
  "3w": {
    text: "80px",
    text_main: "620px",
  },
  "6s": {
    text: "60px",
    text_main: "480px",
  },
};

module.exports = {
  options: process.env.MONGODB_URI.includes("localhost") ? devOptions : prodOptions,
  sizes: process.env.MONGODB_URI.includes("localhost") ? devSizes : prodSizes,
};
