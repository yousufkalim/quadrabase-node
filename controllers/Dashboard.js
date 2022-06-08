// get admin model
const Admins = require("../models/Admins");
// Architects model
const Architects = require("../models/Architects");
// Providers model
const Providers = require("../models/Providers");

// Subscriptions model
const Subscriptions = require("../models/Subscriptions");
// Projects model
const Projects = require("../models/Projects");

/**
 * Get all Units
 * @param {object} req
 * @param {object} res
 */
exports.getQuadrabaseUsers = async (req, res) => {
  try {
    let sum = 0;
    const admin = await Admins.find().count(); //get all admins
    const architect = await Architects.find().count(); //get all arhitects
    const providers = await Providers.find().count(); //get all arhitects

    sum = admin + architect + providers;

    res.status(200).json({ success: true, numberofusers: sum });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.NumberofRegistered = async (req, res) => {
  try {
    let sum = 0;

    const architect = await Architects.find().count(); //get all arhitects
    const providers = await Providers.find().count(); //get all Providers

    sum = architect + providers;

    res.status(200).json({ success: true, NumberofRegistered: sum });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.numberofsubscriber = async (req, res) => {
  try {
    let sum = 0;

    const architect = await Architects.find().count(); //get all arhitects
    const providers = await Providers.find().count(); //get all arhitects
    const subscriptions = await Subscriptions.find().count(); //get all Subscriptions

    sum = architect + providers + subscriptions;

    res.status(200).json({ success: true, numberofsubscriber: sum });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.ProjectsinProgress = async (req, res) => {
  try {
    const projects = await Projects.find().sort("-createdAt").limit(4); //get all arhitects

    res
      .status(200)
      .json({ success: true, ProjectsTop: projects, count: projects.length });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
