const { contactUs } = require("../utils/sendEmail");

/**
 * Get all Units
 * @param {object} req
 * @param {object} res
 */
exports.sendMail = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    // Sending contact email
    contactUs(name, phone, email, message)
      .then(async () => {
        // Done
        res.json({ success: true, message: "Thank you for getting in touch" });
      })
      .catch((err) => {
        // Error handling
        console.log("Error ----> ", err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
