/**
 * Send email service for forgot password
 * @author Ali Asad
 */
var nodemailer = require('nodemailer');
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
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: email,
      subject: 'votre mot de passe a été changé',
      html: passwordTemplate(password),
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

exports.contactUs = (name, phone, email, message) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: 'contact@qbsoft.fr',
      subject: 'Nouveau formulaire en ligne - Quadrabase',
      html: `<div>
        <p>Un visiteur a rempli le formulaire en ligne, voici les informations :</p>
        <ul>
          <li>Nom : ${name}</li>
          <li>Téléphone: ${phone}</li>
          <li>Email: ${email}</li>
          <li>Message : ${message}</li>
        </ul>
      </div>`,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

exports.sendSummaryEmail = (obj) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    const html = `
    <body>
      <p>Bonjour ${obj.providerName},</p><br>
      <p>Comme convenu dans notre accord, nous vous informons que les projets suivants ont été ajoutés dans la plateforme Quadrabase et dans lesquels des produits sélectionnés correspondent à votre production.</p><br>
      ${obj.emailInfo.map((item) => {
        return `<div>
        <p>Maitre d’ouvrage : ${item.client}</p>
        <p>Nom du projet : ${item.projectName}</p>
        <p>Prescripteur : ${item.prescriber}</p>
        <p>Nom du produit : ${item.work}</p>
        </div>`;
      })}
      <br><p>L’équipe QBSoft Sas,</p>
    </body>`;

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: obj.providerEmail,
      subject: 'Résumé des nouveaux projets sur Quadrabase',
      html: html,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

exports.sendQuoteEmail = (email, attachment) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: email,
      subject: 'Devis généré - Quadrabase',
      html: `<p>Veuillez trouver le devis ci-joint</p>`,
      attachments: [
        {
          filename: 'Quote.pdf',
          path: `${attachment}`, // stream this file
        },
      ],
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

const passwordTemplate = (password) => {
  return `
  <body style="margin: 0; padding: 0">
  <table
    role="presentation"
    style="
      width: 100%;
      border-collapse: collapse;
      border: 0;
      border-spacing: 0;
      background: #ffffff;
    "
  >
    <tr>
      <td align="center" style="padding: 0">
        <table
          role="presentation"
          style="
            width: 602px;
            border-collapse: collapse;
            border: 1px solid #cccccc;
            border-spacing: 0;
            text-align: left;
          "
        >
          <tr>
            <td
              align="center"
              style="padding: 20px 5px 10px 5px; background: rgb(255, 255, 255)"
            >
              <img
                src="https://quadrabase.falconit.com.pk/uploads/code_generation/logo.png"
                alt=""
                width="150px"
                style="height: auto; display: block"
              />
              <h2 style="font-family: Gadugi">
                Bonjour, votre nouveau mot de passe est ci-dessous
              </h2>
            </td>
          </tr>
          <tr>
            <td
              align="center"
              style="
                padding: 20px 10px 20px 10px;
                background: rgba(148, 148, 148, 0.164);
              "
            >
              <h3
                style="
                  font-family: Monospace;
                  font-size: 35px;
                  background-color: rgb(53, 53, 53);
                  padding: 2%;
                  color: #ffffff;
                  border-radius: 10px;
                "
              >
                ${password}
              </h3>
            </td>
          </tr>
          <tr>
            <td>
              <p align="center" style="color: #6b6b6b; font-family: Helvetica">
                Cet e-mail est généré automatiquement, veuillez ne pas répondre.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`;
};
