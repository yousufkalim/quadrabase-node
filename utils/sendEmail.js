/**
 * Send email service for forgot password
 * @author Ali Asad
 */
var nodemailer = require("nodemailer");
const sender_name = process.env.MAILER_DOMAIN;
const sender_email = process.env.MAILER_EMAIL;
const sender_password = process.env.MAILER_PASSWORD;

/**
 * sendEmail
 * @param {string} email
 * @param {string} password
 * @return {void}
 */
exports.sendEmail = (email, password) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: email,
      subject: "Your password has been changed",
      text: password,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: "Email sent successfully" });
      }
    });
  });
};

exports.sendSummaryEmail = (obj) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    const html = `
    <body>
      <p>Bonjour ${obj.providerName},</p><br>
      <p>Les projets suivants ont été ajouté dans la plateforme Quadrabase, dans lesquels l’un de vos produit est utilisé.</p><br>
      ${obj.emailInfo.map((item) => {
        return `<div>
        <p>Nom du projet : ${item.projectName}</p>
        <p>Prescripteur : ${item.prescriber}</p>
        <p>Nom du produit : ${item.work}</p>
        </div>`;
      })}
      <br><p>L’équipe Quadrabase,</p>
    </body>`;

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: obj.providerEmail,
      subject: "Résumé des nouveaux projets sur Quadrabase",
      html: html,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: "Email sent successfully" });
      }
    });
  });
};
