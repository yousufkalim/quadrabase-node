/**
 * All the validation
 * @author Yousuf Kalim
 */
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// User Signup Validation
exports.validateAdmin = [
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirm_password", "Confirm Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Confirm Password min length must be 6 characters")
    .custom(async (confirm_password, { req }) => {
      const password = req.body.password;
      if (password !== confirm_password) {
        throw new Error("Password and Confirm Password must be same");
      }
    }),
];

// User Signup Validation
exports.validateAdminUpdate = [
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirm_password", "Confirm Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Confirm Password min length must be 6 characters")
    .custom(async (confirm_password, { req }) => {
      const password = req.body.password;
      if (password !== confirm_password) {
        throw new Error("Password and Confirm Password must be same");
      }
    }),
];

/*
======================
Result
======================
*/

/**
 * To check if request validated successfully or not, according to our validation strategies
 * @param {object} req
 * @param {object} res
 * @param {*} next
 */
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req); // Validating the request by previous middleware's strategy
  if (!errors.isEmpty()) {
    let message = errors.array()[0].msg; //error message
    // On error
    res.status(400).send({ success: false, message: message }); // Sending first error to the client from array of errors
  } else {
    // Validated successfully
    next(); // Pass the request to next middleware or controller
  }
};
