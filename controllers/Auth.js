const Architects = require("../models/Architects");
const Admins = require("../models/Admins");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fr = require("../utils/frLang");
const en = require("../utils/enLang");

//Architect login
exports.login = async (req, res) => {
  try {
    let lang = req.headers.lang ? req.headers.lang : "fr";
    let email = req.body.email; //email
    let password = req.body.password; //password
    const architect = await Architects.findOne({ email }).populate({
      path: "subscriptions",
      populate: {
        path: "subscription",
        model: "Subscriptions",
      },
    }); // Finding already existing Architect
    if (!architect) {
      // If we found existing architect in db
      let email = req.body.email; //email
      let password = req.body.password; //passcword
      const user = await Admins.findOne({ email }); // Finding already existing admin
      if (!user) {
        // If we found existing user in db
        return res.status(404).json({
          success: false,
          message: lang === "fr" ? fr.AuthLoginMsg1 : en.AuthLoginMsg1,
        });
      }
      const isCorrect = bcrypt.compareSync(password, user.password); // Check if user password is correct
      if (!isCorrect)
        return res.status(404).json({
          message: lang === "fr" ? fr.AuthLoginMsg2 : en.AuthLoginMsg2,
        });
      const token = JWT.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 60,
      });
      const result = { user, token };
      // Done
      return res.json({
        success: true,
        message: lang === "fr" ? fr.AuthLoginMsg3 : en.AuthLoginMsg3,
        result,
      }); //Success
    }

    const isCorrect = bcrypt.compareSync(password, architect.password); // Check if architect password is correct
    if (!isCorrect) return res.status(401).json({ message: lang === "fr" ? fr.AuthLoginMsg2 : en.AuthLoginMsg2 });
    const token = JWT.sign({ email: architect.email }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 60,
    });
    const result = { user: architect, token };
    // Done
    res.json({
      success: true,
      message: lang === "fr" ? fr.AuthLoginMsg3 : en.AuthLoginMsg3,
      result,
    }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
