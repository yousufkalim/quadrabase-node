const { contactUs } = require("../utils/sendEmail");
const fr = require("../utils/frLang");
const en = require("../utils/enLang");
/**
 * Get all Units
 * @param {object} req
 * @param {object} res
 */
exports.sendMail = async (req, res) => {
  try {
    let lang = req.headers.lang ? req.headers.lang : "fr";
    const { name, phone, email, message } = req.body;
    // Sending contact email
    contactUs(name, phone, email, message)
      .then(async () => {
        // Done
        res.json({
          success: true,
          message: lang === "fr" ? fr.ContactMsg1 : en.ContactMsg1,
        });
      })
      .catch((err) => {
        // Error handling
        console.log("Error ----> ", err);
        res
          .status(500)
          .json({
            success: false,
            message: lang === "fr" ? fr.AdminForgetPass3 : en.AdminForgetPass3,
          });
      });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
