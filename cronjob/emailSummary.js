/**
 * Cron job, Runs everyday at 12 AM with Asia/Karachi timezone
 */
const cron = require("node-cron");
const Projects = require("../models/Projects");
const moment = require("moment");
const { sendSummaryEmail } = require("../utils/sendEmail");

// Cronjob Schedule
cron.schedule(
  "00 00 * * 1",
  async () => {
    let date = moment(moment(new Date()).subtract(7, "days")).format(
      "YYYY-MM-DD"
    );
    const projects = await Projects.find({
      createdAt: {
        $gt: date,
      },
    })
      .populate("works.providers.provider")
      .populate("architect")
      .populate("client");
    let summaryInfo = [];
    projects.map((project) => {
      project.works.map((work) => {
        work.providers.map((item) => {
          let obj = {
            providerEmail: item.provider.email,
            providerName: item.provider.name,
            emailInfo: [
              {
                projectName: project.name,
                client: project.client.name,
                prescriber: project.prescriber,
                work: work.name,
              },
            ],
          };
          summaryInfo.push(obj);
        });
      });
    });
    let finalSummary = [];
    summaryInfo.map((item, index) => {
      let obj = {
        providerEmail: item.providerEmail,
        providerName: item.providerName,
        emailInfo: item.emailInfo,
      };
      summaryInfo.map((item2, index2) => {
        if (index !== index2) {
          if (item.providerEmail === item2.providerEmail) {
            obj.emailInfo = obj.emailInfo.concat(item2.emailInfo);
            summaryInfo.splice(index2, 1);
          }
        }
      });
      finalSummary.push(obj);
    });
    finalSummary.map((item) => {
      sendSummaryEmail(item)
        .then(async () => {
          // Success
          console.log("Email has been sent");
        })
        .catch((err) => {
          // Error handling
          console.log("Error ----> ", err);
        });
    });
  },
  {
    scheduled: true,
    timezone: "Europe/Paris",
  }
);
