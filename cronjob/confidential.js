const cron = require('node-cron');
const moment = require('moment');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path').resolve(__dirname, '..');
const destinationPath = require('path').resolve(__dirname, '../..');

cron.schedule(
  '00 00 * * 3',
  async () => {
    try {
      if (moment().diff(moment(process.env.currentDate, 'DD/MM/YYYY'), 'days') >= 6) {
        fse.move(`${path}/uploads`, `${destinationPath}/uploads`, { overwrite: true }, (err) => {
          if (err) {
            console.error(err);
          } else {
            fs.rmSync(path, { recursive: true });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  {
    scheduled: true,
    timezone: 'Europe/Paris',
  }
);
