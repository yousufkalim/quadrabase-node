const Subscriptions = require("../models/Subscriptions");
const Licenses = require("../models/Licenses");
const Architects = require("../models/Architects");
const moment = require("moment");

//subscription create
exports.buy = async (req, res) => {
  try {
    const subscription = await Subscriptions.findById(req.body.subscription);

    const data = {
      subscription: subscription._id,
      start_date: moment(new Date()).add(1, "days").format("YYYY/MM/DD"),
      end_date: moment(
        moment(new Date())
          .add(subscription.duration, "months")
          .add(1, "days")
          .calendar()
      ).format("YYYY/MM/DD"),
      credit: subscription.credit,
      architect: req.params.architectId,
    };

    const license = await Licenses.create(data);

    await Architects.findByIdAndUpdate(
      req.params.architectId,
      { $push: { myLicenses: license._id } },
      { new: true }
    );

    res.json({ success: true, message: "Success!", license });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

//buy credits
exports.buycredits = async (req, res) => {
  try {
    const subscription = await Subscriptions.findById(req.body.subscription);

    const license = await Licenses.findById(req.params.licenseId);
    license.credit = license.credit + subscription.credit;
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
    license.end_date = moment(
      moment(license.end_date).add(subscription.duration, "months").calendar()
    ).format("YYYY/MM/DD");
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
      console.log("architectaa", architect);
      if (!architect) {
        return res
          .status(404)
          .json({ success: false, message: "Architect Not Found!" });
      }
      const license = await Licenses.findByIdAndUpdate(
        req.params.licenseId,
        {
          assigned_to: architect._id,
        },
        { new: true }
      );

      let data = {
        id: license.subscription,
        start_date: license.start_date,
        end_date: license.end_date,
        license: license._id,
      };
      architect.subscriptions = data;
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
