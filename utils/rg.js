const devOptions = {
  format: 'A4',
  orientation: 'portrait',
  border: '10mm',
};

const prodOptions = {
  format: 'A3',
  orientation: 'portrait',
  border: '10mm',
};

// 700 in total
const devSizes = {
  '2s': {
    text: '100px',
    text_main: '600px',
  },
  '3s': {
    text: '150px',
    text_main: '400px',
  },
  '3w': {
    text: '60px',
    text_main: '580px',
  },
  '6s': {
    text: '60px',
    text_main: '400px',
  },
  f12: '12px',
  f14: '14px',
};

// 780 in total
const prodSizes = {
  '2s': {
    text: '100px',
    text_main: '680px',
  },
  '3s': {
    text: '160px',
    text_main: '460px',
  },
  '3w': {
    text: '80px',
    text_main: '620px',
  },
  '6s': {
    text: '60px',
    text_main: '470px',
  },
  f12: '10px',
  f14: '12px',
};

module.exports = {
  options: process.env.MONGODB_URI.includes('localhost') ? devOptions : prodOptions,
  sizes: process.env.MONGODB_URI.includes('localhost') ? devSizes : prodSizes,
};
