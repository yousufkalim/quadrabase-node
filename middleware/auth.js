const JWT = require("jsonwebtoken");
const Admins = require("../models/Admins");

//Auth validator
function Auth(MODEL = Admins) {
  return async (req, res, next) => {
    const header = req.get("Authorization");
    if (!header || !header.startsWith("Bearer")) {
      return res.status(404).json({ message: "Unauthorized Access!" });
    }
    const token = header.split(" ")[1];

    const decoded = new Promise((resolve, reject) => {
      JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(404).json({ message: err.message });
        }
        resolve(decoded);
      });
    });
    decoded.then(async ({ email }) => {
      let user = {};
      if (MODEL != Admins) {
        user = await MODEL.findOne({
          email: email,
        }).populate("subscriptions.license");
      } else {
        user = await MODEL.findOne({
          email: email,
        });
      }

      if (!user)
        return res
          .status(404)
          .json({ message: "Unauthorized access: User does not exist" });

      req.user = user;
      req.userId = user.id;

      next();
    });
  };
}

module.exports = Auth;
