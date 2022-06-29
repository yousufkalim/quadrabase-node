const Subscriptions = require("../models/Subscriptions");
const Licenses = require("../models/Licenses");
const Architects = require("../models/Architects");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_URI);
const Invoice = require("../models/Invoice");
const fs = require("fs");
const pdf = require("pdf-creator-node");
const path = require("path");
const options = require("../utils/options");
const Admins = require("../models/Admins");
const bcrypt = require("bcryptjs");
const Providers = require("../models/Providers");
const { sendQuoteEmail } = require("../utils/sendEmail");

//subscription create
exports.buy = async (req, res) => {
  try {
    const subscription = await Subscriptions.findById(req.body.subscription);

    const data = {
      subscription: subscription._id,
      start_date: moment(new Date()).add(1, "days").format("YYYY/MM/DD"),
      end_date: moment(moment(new Date()).add(subscription.duration, "months").add(1, "days").calendar()).format("YYYY/MM/DD"),
      credit: subscription.credit,
      projects: subscription.projects,
      architect: req.params.architectId,
    };

    const license = await Licenses.create(data);

    await Architects.findByIdAndUpdate(req.params.architectId, { $push: { myLicenses: license._id } }, { new: true });

    res.json({ success: true, message: "Success!", license });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

//buy credits
exports.buyprojects = async (req, res) => {
  try {
    const subscription = await Subscriptions.findById(req.body.subscription);

    const license = await Licenses.findById(req.params.licenseId);
    license.projects = license.projects + subscription.projects;
    await license.save();

    res.json({ success: true, message: "Success!", license });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

//buy credits
exports.renew = async (req, res) => {
  try {
    const subscription = await Subscriptions.findById(req.body.subscription);

    const license = await Licenses.findById(req.params.licenseId);
    license.end_date = moment(moment(license.end_date).add(subscription.duration, "months").calendar()).format("YYYY/MM/DD");
    await license.save();

    res.json({ success: true, message: "Success!", license });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

// get by architect id
exports.getByArchitectId = async (req, res) => {
  try {
    const license = await Licenses.find({
      architect: req.params.architectId,
    })
      .populate("subscription")
      .populate("assigned_to");

    res.json({ success: true, license });
  } catch (err) {
    // Error handling
    console.log("Error---->", err.message);
    res.status(500).json({ message: err.message });
  }
};

// assign unassign Subscription
exports.assign = async (req, res) => {
  try {
    if (!req.body.email) {
      await Architects.findOneAndUpdate(
        {
          "subscriptions.license": req.params.licenseId,
        },
        {
          subscriptions: null,
        },
        { new: true }
      );
      await Licenses.findByIdAndUpdate(
        req.params.licenseId,
        {
          assigned_to: null,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Subscription Unassigned!",
      });
    } else {
      const architect = await Architects.findOne({
        email: req.body.email,
      });
      if (!architect) {
        return res.status(404).json({ success: false, message: "Architect Not Found!" });
      }
      const license = await Licenses.findByIdAndUpdate(
        req.params.licenseId,
        {
          assigned_to: architect._id,
        },
        { new: true }
      );

      architect.subscriptions = license._id;
      await architect.save();

      res.json({
        success: true,
        message: "Subscription Assigned!",
      });
    }
  } catch (err) {
    // Error handling
    console.log("Error---->", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.json({ success: true, url: invoice.filePath });
  } catch (err) {
    // Error handling
    console.log("Error---->", err.message);
    res.status(500).json({ message: err.message });
  }
};

// checkout
exports.checkout = async (req, res) => {
  try {
    let metaData = req.body.metaData;
    let lineItems = req.body.line_items;
    let invoice = "";
    if (metaData.type === "providerSignup") {
      invoice = await providerInvoice(req.body.invoiceData);
    } else {
      invoice = await architectInvoice(req.body.invoiceData);
    }
    metaData.filePath = invoice.filePath;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [req.body.paymentMethod],
      line_items: lineItems,
      locale: "fr",
      mode: "payment",
      success_url: invoice ? `${process.env.CLIENT_URL}/auth/login` : process.env.STRIPE_RETURN_URL,
      cancel_url: process.env.STRIPE_REJECT_URL,
      metadata: metaData,
    });
    res.json({ success: true, url: session.url });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.Webhook = async (req, res) => {
  let sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.WEBHOOK_URI //////webhook scret key
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const metaData = session.metadata;
      // Check if buy subscription
      if (metaData.type === "architectSignup") {
        const subscription = {
          id: metaData.subscriptionid,
          duration: parseInt(metaData.subscriptionDuration),
          projects: parseInt(metaData.subscriptionProjects),
        };
        delete metaData.subscriptionid;
        delete metaData.subscriptionDuration;
        delete metaData.subscriptionProjects;
        delete metaData.type;
        // finding architect
        const architect = await Architects.findById(metaData.id); // Adding architect in db

        // assinging subscription
        const data = {
          subscription: subscription.id,
          start_date: moment(new Date()).format("YYYY/MM/DD"),
          end_date: moment(moment(new Date()).add(subscription.duration, "months").calendar()).format("YYYY/MM/DD"),
          projects: subscription.projects,
          assigned_to: architect._id,
        };

        const license = await Licenses.create(data);
        architect.subscriptions = license._id;
        architect.authorized = "Yes";
        await architect.save();
        // Sending email to user
        sendQuoteEmail(architect.email, metaData.filepath)
          .then(async () => {
            // Success
            console.log("Email has been sent");
          })
          .catch((err) => {
            // Error handling
            console.log("Error ----> ", err);
          });
      } else if (metaData.type === "providerSignup") {
        const subscription = {
          id: metaData.subscriptionid,
          name: metaData.subscriptionName,
          start_date: metaData.subscriptionStartDate,
          end_date: metaData.subscriptionEndDate,
        };
        // Creating provider
        const provider = await Providers.findByIdAndUpdate(metaData.id, { subscription, authorized: "Yes" }, { new: true }); // Adding provider in db
        // Sending email to user
        sendQuoteEmail(provider.email, metaData.filepath)
          .then(async () => {
            // Success
            console.log("Email has been sent");
          })
          .catch((err) => {
            // Error handling
            console.log("Error ----> ", err);
          });
      } else if (metaData.type === "ProviderOrder") {
        const provider = await Providers.findById(metaData.providerId); // Adding architect in db
        let endDate = moment(moment(provider.subscription.end_date).add(metaData.duration, "months")).format("YYYY/MM/DD");
        provider.subscription.end_date = endDate;
        provider.save();
        sendQuoteEmail(provider.email, metaData.filepath)
          .then(async () => {
            // Success
            console.log("Email has been sent");
          })
          .catch((err) => {
            // Error handling
            console.log("Error ----> ", err);
          });
      } else {
        const subscription = await Subscriptions.findById(metaData.subscription);

        const data = {
          subscription: subscription._id,
          start_date: subscription.duration > 0 ? moment(new Date()).add(1, "days").format("YYYY/MM/DD") : null,
          end_date:
            subscription.duration > 0
              ? moment(
                  moment(new Date())
                    .add(subscription.duration * parseInt(metaData.count), "months")
                    .add(1, "days")
                    .calendar()
                ).format("YYYY/MM/DD")
              : null,
          projects: subscription.projects >= 0 ? subscription.projects : 0,
          architect: metaData.architectId,
        };
        const license = await Licenses.create(data);

        const architect = await Architects.findByIdAndUpdate(
          metaData.architectId,
          { $push: { myLicenses: license._id } },
          { new: true }
        );
        sendQuoteEmail(architect.email, metaData.filepath)
          .then(async () => {
            // Success
            console.log("Email has been sent");
          })
          .catch((err) => {
            // Error handling
            console.log("Error ----> ", err);
          });
      }

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.send();
};

const architectInvoice = async (data) => {
  const html = fs.readFileSync(path.join(__dirname, "../templates/invoice.html"), "utf-8");
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

  const obj = {
    Facture: facture,
    date: moment(new Date()).format("DD MMMM YYYY"),
    DESTINATAIRE: data.address1,
    initialprice: data.initialPrice.toFixed(2),
    initialCount: data.initialCount,
    initialTotal: (data.initialPrice * data.initialCount).toFixed(2),
    reprice: data.extendedPrice.toFixed(2),
    reCount: data.extendedCount,
    reTotal: (data.extendedPrice * data.extendedCount).toFixed(2),
    packprice: data.packPrice.toFixed(2),
    packCount: data.packCount,
    packTotal: (data.packPrice * data.packCount).toFixed(2),
    projects: data.packCount * 5,
    totalHT: data.totalHT.toFixed(2),
    tvaPercentage: data.tvaPercentage,
    tvaAmount: data.tvaAmount.toFixed(2),
    totalTTC: data.TotalCost.toFixed(2),
    paymentMode: data.paymentMode,
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
  obj.filePath = filepath;
  const newInvoice = await Invoice.create(obj);
  return newInvoice;
};

const providerInvoice = async (data) => {
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

  const obj = {
    Facture: facture,
    date: moment(new Date()).format("DD MMMM YYYY"),
    DESTINATAIRE: data.address1,
    alertPrice: data.alertPrice,
    alertCount: data.alertCount,
    alertTotal: data.alertTotal,
    referenPrice: data.referenPrice,
    referenCount: data.referenCount,
    referenTotal: data.referenTotal,
    totalHT: data.totalHT.toFixed(2),
    tvaPercentage: data.tvaPercentage,
    tvaAmount: data.tvaAmount.toFixed(2),
    totalTTC: data.TotalCost.toFixed(2),
    paymentMode: data.paymentMode,
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
  obj.filePath = filepath;
  const newInvoice = await Invoice.create(obj);
  return newInvoice;
};
