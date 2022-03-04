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
      .populate("architect");
    let summaryInfo = [];
    projects.map((project) => {
      project.works.map((work) => {
        work.providers.map((item) => {
          data = {
            providerEmail: item.provider.email,
            architectName: `${project.architect.first_name} ${project.architect.last_name}`,
            architectEmail: project.architect.email,
            projectName: project.name,
            workName: work.name,
          };
          summaryInfo.push(data);
        });
      });
    });
    summaryInfo.map((item) => {
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
