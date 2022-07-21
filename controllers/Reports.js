const moment = require('moment');

const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const rgConfig = require('../utils/rg');

exports.simpleEstimation = async (req, res) => {
  const { headerArr, bodyKeysArr, bodyValuesArr, footerKeysArr, footerValuesArr } = req.body;

  const html = fs.readFileSync(path.join(__dirname, '../templates/rg_simple_estimation.hbs'), 'utf-8');
  const filename = Math.random() + '_doc' + '.pdf';

  const footerArr = [];
  for (let i = 0; i < footerKeysArr.length; i++) {
    if (!footerKeysArr[i]) {
      footerKeysArr.splice(i, 1);
    }
  }
  for (let i = 0; i < footerKeysArr.length; i++) {
    const arr = [];
    arr.push(footerKeysArr[i]);
    arr.push(footerValuesArr[i]);
    footerArr.push(arr);
  }

  const body = {
    headerArr,
    bodyKeysArr,
    bodyValuesArr,
    footerArr,
    sizes: rgConfig.sizes,
  };

  indexArr(body.headerArr);
  indexArr(body.bodyKeysArr);
  for (let i = 0; i < body.bodyValuesArr.length; i++) {
    indexArr(body.bodyValuesArr[i]);
  }
  indexArr(body.bodyValuesArr);
  for (let i = 0; i < body.footerArr.length; i++) {
    indexArr(body.footerArr[i]);
  }
  indexArr(body.footerArr);

  const document = {
    data: body,
    html: html,
    path: `./uploads/reports/${filename}`,
    type: '',
  };

  await pdf
    .create(document, rgConfig.options)
    .then((res) => {
      console.log(res, 'res');
    })
    .catch((error) => {
      console.log(error, 'error');
    });
  const filepath = `${process.env.BASE_URL}/uploads/reports/${filename}`;
  res.status(200).json({
    path: filepath,
  });
};

exports.ttEstimation = async (req, res) => {
  const { headerArr, bodyKeysArr, bodyValuesArr, footerKeysArr, footerValuesArr } = req.body;

  const html = fs.readFileSync(path.join(__dirname, '../templates/rg_tt_estimation.hbs'), 'utf-8');
  const filename = Math.random() + '_doc' + '.pdf';

  const footerArr = [];
  for (let i = 0; i < footerKeysArr.length; i++) {
    footerArr.push([footerKeysArr[i], footerValuesArr[i]]);
  }

  const body = {
    headerArr,
    bodyKeysArr,
    bodyValuesArr,
    footerArr,
    sizes: rgConfig.sizes,
  };

  indexArr(body.headerArr);
  indexArr(body.bodyKeysArr);
  for (let i = 0; i < body.bodyValuesArr.length; i++) {
    indexArr(body.bodyValuesArr[i]);
  }
  for (let i = 0; i < body.footerArr.length; i++) {
    indexArr(body.footerArr[i]);
  }
  indexArr(body.bodyValuesArr);

  const document = {
    data: body,
    html: html,
    path: `./uploads/reports/${filename}`,
    type: '',
  };

  await pdf
    .create(document, rgConfig.options)
    .then((res) => {
      console.log(res, 'res');
    })
    .catch((error) => {
      console.log(error, 'error');
    });
  const filepath = `${process.env.BASE_URL}/uploads/reports/${filename}`;
  res.status(200).json({
    path: filepath,
  });
};

exports.BPU = async (req, res) => {
  const { headerArr, bodyValuesArr } = req.body;

  const html = fs.readFileSync(path.join(__dirname, '../templates/rg_bpu.hbs'), 'utf-8');
  const filename = Math.random() + '_doc' + '.pdf';

  const body = {
    headerArr,
    bodyValuesArr,
    sizes: rgConfig.sizes,
  };

  indexArr(body.headerArr);
  for (let i = 0; i < body.bodyValuesArr.length; i++) {
    indexArr(body.bodyValuesArr[i]);
  }
  indexArr(body.bodyValuesArr);

  const document = {
    data: body,
    html: html,
    path: `./uploads/reports/${filename}`,
    type: '',
  };

  await pdf
    .create(document, rgConfig.options)
    .then((res) => {
      console.log(res, 'res');
    })
    .catch((error) => {
      console.log(error, 'error');
    });
  const filepath = `${process.env.BASE_URL}/uploads/reports/${filename}`;
  res.status(200).json({
    path: filepath,
  });
};

exports.DPGF = async (req, res) => {
  const { headerArr, bodyKeysArr, bodyValuesArr } = req.body;

  const html = fs.readFileSync(path.join(__dirname, '../templates/rg_dpgf.hbs'), 'utf-8');
  const filename = Math.random() + '_doc' + '.pdf';

  const body = {
    headerArr,
    bodyKeysArr,
    bodyValuesArr,
    sizes: rgConfig.sizes,
  };

  indexArr(body.headerArr);
  indexArr(body.bodyKeysArr);
  for (let i = 0; i < body.bodyValuesArr.length; i++) {
    indexArr(body.bodyValuesArr[i]);
  }
  indexArr(body.bodyValuesArr);

  const document = {
    data: body,
    html: html,
    path: `./uploads/reports/${filename}`,
    type: '',
  };

  await pdf
    .create(document, rgConfig.options)
    .then((res) => {
      console.log(res, 'res');
    })
    .catch((error) => {
      console.log(error, 'error');
    });
  const filepath = `${process.env.BASE_URL}/uploads/reports/${filename}`;
  res.status(200).json({
    path: filepath,
  });
};

exports.CCTP = async (req, res) => {
  const { headerArr, bodyValuesArr } = req.body;

  const html = fs.readFileSync(path.join(__dirname, '../templates/rg_cctp.hbs'), 'utf-8');
  const filename = Math.random() + '_doc' + '.pdf';

  const body = {
    headerArr,
    bodyValuesArr,
    sizes: rgConfig.sizes,
  };

  indexArr(body.headerArr);

  const document = {
    data: body,
    html: html,
    path: `./uploads/reports/${filename}`,
    type: '',
  };

  await pdf
    .create(document, rgConfig.options)
    .then((res) => {
      console.log(res, 'res');
    })
    .catch((error) => {
      console.log(error, 'error');
    });
  const filepath = `${process.env.BASE_URL}/uploads/reports/${filename}`;
  res.status(200).json({
    path: filepath,
  });
};

function indexArr(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      i: i,
      v: arr[i],
    };
  }
}
