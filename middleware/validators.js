/**
 * All the validation
 * @author Shehzad Ahmed
 */
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// Admin Register Validation
exports.validateAdmin = [
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage(" Password min length must be 6 characters"),
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
// Admin Update Validation
exports.validateAdminUpdate = [
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
];

// Provider Register Validation
exports.validateProvider = [
  check("name", " Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  // check("address1", " Address1 is required.").notEmpty().trim(),
  // check("address2", " Address2 is required.").notEmpty().trim(),
  // check("zipcode", " ZipCode is required.").notEmpty(),
  // check("city", " City is required.").notEmpty(),
  // check("contact_no", " Contact No. is required.").notEmpty(),
  // check("telephone_no", " Telephone No. is required.").notEmpty(),

  // check("url", " Telephone No. is required.").notEmpty(),
];

// Architect Register Validation
exports.validateArchitect = [
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage(" Password min length must be 6 characters"),
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
  // check("establishment", "Establishment is required.").notEmpty().trim(),
  // check("service", "Service is required.").notEmpty().trim(),
];

// Architect Update Validation
exports.validateUpdateArchitect = [
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  // check("establishment", "Establishment is required.").notEmpty().trim(),
  // check("service", "Service is required.").notEmpty().trim(),
  check("password", "Password is not allowed.").isEmpty().trim(),
  check("confirm_password", "Confirm Password is not allowed.")
    .isEmpty()
    .trim(),
];
// Subscription Create Validation
exports.validateSubscription = [
  check("name", "Name is required.").notEmpty().trim(),
  check("type", "Type is required.").notEmpty().trim(),
  check("duration", "Duration is required.").notEmpty().trim(),
  check("price", "Price is required.").notEmpty().trim(),
];

// Subscription Create Validation
exports.validateProjects = [
  check("name", "Name is required.").notEmpty().trim(),
  check("architect", "Architect is required.").notEmpty().trim(),
  check("market_type", "Market type is required.").notEmpty().trim(),
  check("structure", "Structure type is required.").notEmpty().trim(),
];

// add work to project validation
exports.validateAddWorkToProject = [
  check("workId", "Work ID is required.").notEmpty().trim(),
  check("workDetailId", "Work detail ID is required.").notEmpty().trim(),
];

// Stakeholder Create Validation
exports.validateStakeholder = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("title", "Title is required.").notEmpty().trim(),
  check("contact_no", "Contact number is required.").notEmpty().trim(),
];

// ArchitectsChap0 Create Validation
exports.validateArchitectsChap0 = [
  check("title", "Title is required.").notEmpty().trim(),
  check("text", "Text is required.").notEmpty().trim(),
];

// Chap0 Create Validation
exports.validateChap0 = [
  check("title", "Title is required.").notEmpty().trim(),
  check("text", "Text is required.").notEmpty().trim(),
];

// VAT Create Validation
exports.validateVAT = [
  check("value", "Value is required.").notEmpty().trim(),
  check("ranking", "Ranking is required.").notEmpty().trim(),
];

// Units Create Validation
exports.validateUnits = [
  check("name", "Name is required.").notEmpty().trim(),
  check("symbol", "Symbol is required.").notEmpty().trim(),
  check("ranking", "Ranking is required.").notEmpty().trim(),
];

// CCTP Create Validation
exports.validateCCTP = [
  check("name", "Name is required.").notEmpty().trim(),
  check("type", "Type is required.").notEmpty().trim(),
  check("ranking", "Ranking is required.").notEmpty().trim(),
];

// Family Create Validation
exports.validateFamily = [
  check("name", "Name is required.").notEmpty().trim(),
  check("ranking", "Ranking is required.").notEmpty().trim(),
];

// BookLibraries Create Validation
exports.validateBookLibrary = [
  check("name", "Name is required.").notEmpty().trim(),
];

// Add Category in BookLibraries Create Validation
exports.validateAddCategory = [
  check("libraryId", "libraryId is required.").notEmpty().trim(),
  check("name", "Category Name is required.").notEmpty().trim(),
];
// Add Category in BookLibraries Create Validation
exports.validateEditCategory = [
  check("name", "Category Name is required.").notEmpty().trim(),
];

// Add Work in BookLibraries Create Validation
exports.validateAddWork = [
  check("categoryId", "categoryId is required.").notEmpty().trim(),
  check("name", "Name is required.").notEmpty().trim(),
];
// Add Work in BookLibraries Create Validation
exports.validateEditWork = [
  check("name", "workName is required.").notEmpty().trim(),
];
// Add WorkDetail in BookLibraries Create Validation
exports.validateAddWorkDetail = [
  check("workId", "workId is required.").notEmpty().trim(),
  check("name", "Name is required.").notEmpty().trim(),
];
// Edit WorkDetail in BookLibraries Create Validation
exports.validateEditWorkDetail = [
  check("name", "Work Detail is required.").notEmpty().trim(),
];

// Forgot Password Validation

exports.validateForgotPassword = [
  check("email", "Email is required.").notEmpty().trim(),
];
exports.validateResetPassword = [
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password min length must be 6 characters"),
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
  check("resetPasswordToken", "Reset Password Token is required.")
    .notEmpty()
    .trim(),
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
