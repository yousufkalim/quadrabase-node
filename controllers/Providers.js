const Providers = require("../models/Providers");
const Architects = require("../models/Architects");
const Admins = require("../models/Admins");
const Works = require("../models/Works");
const moment = require("moment");
const Invoice = require("../models/Invoice");
const fs = require("fs");
const pdf = require("pdf-creator-node");
const path = require("path");
const options = require("../utils/options");
const { sendQuoteEmail } = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT || 10;

//provider create
exports.create = async (req, res) => {
  try {
    let email = req.body.email; //email
    const existingProvider = await Providers.findOne({ email }); // Finding already existing provider
    if (existingProvider) {
      // If we found existing provider in db
      return res.status(400).json({ success: false, message: "Provider already exists" });
    }

    // Creating provider
    const provider = await Providers.create(req.body); // Adding provider in db

    // Done
    res.json({ message: "Provider created successfully", provider }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

//provider create
exports.createOnSingup = async (req, res) => {
  try {
    let email = req.body.email; //email
    const existingProvider = await Providers.findOne({ email }); // Finding already existing provider
    const existingArchitect = await Architects.findOne({ email }); // Finding already existing architect
    const existingAdmin = await Admins.findOne({ email }); // Finding already existing architect
    if (existingProvider || existingArchitect || existingAdmin) {
      // If we found existing provider in db
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });
    }

    let password = req.body.password; //password
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt));

    // Creating provider
    const provider = await Providers.create(req.body); // Adding provider in db

    // Done
    res.json({ success: true, message: "Fournisseur créé avec succès", provider }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Providers
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const providers = await Providers.find()
      .sort([["createdAt", -1]])
      .populate("works"); // Finding all the Providers from db
    res.json({ success: true, providers }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get provider by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const providerId = req.params.providerId; // Getting provider id from URL parameter
    const provider = await Providers.findById(providerId); // Finding provider by id
    res.json({ success: true, provider }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update provider
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    if (req.body.oldPassword) {
      if (!req.body.newPassword)
        return res.status(401).json({
          message: "New Password Can't be Empty!",
        });
      const providerId = req.params.providerId; // Getting provider id from URL parameter
      const provider = await Providers.findById(providerId);

      const isCorrect = bcrypt.compareSync(req.body.oldPassword, provider.password); // Check if old password is correct
      if (!isCorrect)
        return res.status(401).json({
          message: "Invalid Old Password",
        });

      provider.password = bcrypt.hashSync(req.body.newPassword, parseInt(bcryptSalt)); // setting new password
      provider.save();
      res.json({
        success: true,
        message: "Provider updated successfully",
        provider,
      }); // Success
    } else {
      const providerId = req.params.providerId; // Getting provider id from URL parameter
      const provider = await Providers.findByIdAndUpdate(providerId, req.body, {
        new: true,
      }); // Updating the provider
      res.json({
        success: true,
        message: "Provider updated successfully",
        provider,
      }); // Success
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addSubscription = async (req, res) => {
  if (!req.body.name) {
    await Providers.findByIdAndUpdate(req.params.providerId, {
      subscription: {},
    });
    res.json({ success: true, message: "Subscription Removed!" });
  } else {
    const data = {
      name: req.body.name,
      start_date: moment(req.body.start_date).add(1, "days").format("YYYY/MM/DD"),
      end_date: moment(req.body.end_date).add(1, "days").format("YYYY/MM/DD"),
    };

    await Providers.findByIdAndUpdate(req.params.providerId, {
      subscription: data,
    });
    res.json({ success: true, message: "Subscription Updated!" });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const providerId = req.params.providerId; // Getting provider id from URL parameter
    const provider = await Providers.findByIdAndDelete(providerId); // Deleting the provider
    await Works.updateMany({ _id: provider.providers }, { $pull: { providers: providerId } }); // Deleting from the Architects
    res.json({
      success: true,
      message: "Provider deleted successfully",
      provider,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all works attached to Provider by it's id
 * @param {object} req
 * @param {object} res
 */
exports.getWorksByProviderId = async (req, res) => {
  try {
    const providerId = req.params.providerId; // Getting provider id from URL parameter
    const populateQuery = [
      {
        path: "providers",
        populate: [
          {
            path: "provider",
          },
        ],
      },
    ];
    let works = await Works.find({
      "providers.provider": providerId,
    }).populate(populateQuery);
    console.log(works, "works");
    res.json({ success: true, works }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.generatePdf = async (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, "../templates/providerInvoice.html"), "utf-8");
  const filename = Math.random() + "_doc" + ".pdf";

  const invoice = await Invoice.find();
  let facture = "";
  let count = "";
  let currentYear = moment().format("YYYY");
  if (invoice.length > 0) {
    count = invoice[invoice.length - 1].invoiceCount + 1;
    if (count < 10) {
      facture = `F${currentYear}000${count}`;
    } else if (count < 100) {
      facture = `F${currentYear}00${count}`;
    } else if (count < 1000) {
      facture = `F${currentYear}0${count}`;
    } else if (count > 1000) {
      facture = `F${currentYear}${count}`;
    }
  } else {
    facture = `F${currentYear}0001`;
  }
  const provider = await Providers.findById(req.body.archId);

  const obj = {
    Facture: facture,
    providerName: `${provider.name} ${provider.firstname}`,
    providerEmail: provider.email,
    providerPhone: provider.telephone_no,
    providerAddress: provider.address1,
    subscriptionCode: req.body.subscriptionCode,
    subscriptionName: req.body.subscriptionName,
    date: moment(new Date()).format("DD MMMM YYYY"),
    DESTINATAIRE: req.body.address1,
    alertPrice: req.body.alertPrice,
    alertCount: req.body.alertCount,
    alertTotal: req.body.alertTotal,
    referenPrice: req.body.referenPrice?.toFixed(2),
    referenCount: req.body.referenCount,
    referenTotal: req.body.referenTotal?.toFixed(2),
    totalHT: req.body.totalHT.toFixed(2),
    tvaPercentage: req.body.tvaPercentage,
    tvaAmount: req.body.tvaAmount.toFixed(2),
    totalTTC: req.body.TotalCost.toFixed(2),
    paymentMode: req.body.paymentMode,
  };

  const document = {
    html: html,
    data: obj,
    path: `./uploads/invoice/${filename}`,
  };
  await pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  const filepath = `${process.env.BASE_URL}/uploads/invoice/${filename}`;
  obj.invoiceCount = count ? count : 1;
  await Invoice.create(obj);
  res.status(200).json({
    path: filepath,
  });
};

exports.generateQuotePdf = async (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, "../templates/providerQuote.html"), "utf-8");
  const filename = Math.random() + "_doc" + ".pdf";

  const invoice = await Invoice.find();
  let facture = "";
  let count = "";
  let currentYear = moment().format("YYYY");
  if (invoice.length > 0) {
    count = invoice[invoice.length - 1].invoiceCount + 1;
    if (count < 10) {
      facture = `D${currentYear}000${count}`;
    } else if (count < 100) {
      facture = `D${currentYear}00${count}`;
    } else if (count < 1000) {
      facture = `D${currentYear}0${count}`;
    } else if (count > 1000) {
      facture = `D${currentYear}${count}`;
    }
  } else {
    facture = `D${currentYear}0001`;
  }

  const provider = await Providers.findById(req.body.archId);

  const obj = {
    Facture: facture,
    providerName: `${provider.name} ${provider.firstname}`,
    providerEmail: provider.email,
    providerPhone: provider.telephone_no,
    providerAddress: provider.address1,
    date: moment(new Date()).format("DD MMMM YYYY"),
    subscriptionCode: req.body.subscriptionCode,
    subscriptionName: req.body.subscriptionName,
    DESTINATAIRE: req.body.address1,
    alertPrice: req.body.alertPrice,
    alertCount: req.body.alertCount,
    alertTotal: req.body.alertTotal,
    referenPrice: req.body.referenPrice?.toFixed(2),
    referenCount: req.body.referenCount,
    referenTotal: req.body.referenTotal?.toFixed(2),
    totalHT: req.body.totalHT.toFixed(2),
    tvaPercentage: req.body.tvaPercentage,
    tvaAmount: req.body.tvaAmount.toFixed(2),
    totalTTC: req.body.TotalCost.toFixed(2),
    paymentMode: req.body.paymentMode,
  };

  const document = {
    html: html,
    data: obj,
    path: `./uploads/invoice/${filename}`,
  };
  await pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  const filepath = `${process.env.BASE_URL}/uploads/invoice/${filename}`;
  obj.invoiceCount = count ? count : 1;
  await Invoice.create(obj);

  // Sending email to user
  sendQuoteEmail("contact@qbsoft.fr", filepath)
    .then(async () => {
      // Success
      console.log("Email has been sent");
    })
    .catch((err) => {
      // Error handling
      console.log("Error ----> ", err);
    });

  res.status(200).json({
    path: filepath,
  });
};
