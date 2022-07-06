const StaticPages = require('../models/StaticPages');

//StaticPage create
exports.create = async (req, res) => {
  try {
    // Creating StaticPages
    const staticPages = await StaticPages.create(req.body); // Adding StaticPages in db

    // Done
    res.json({ message: 'StaticPages created successfully', staticPages }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all StaticPages
 * @param {object} req
 * @param {object} res
 */
exports.getTerms = async (req, res) => {
  try {
    const staticPages = await StaticPages.find(); // Finding all the StaticPages from db
    res.json({ success: true, data: staticPages[0] }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update staticPages
 * @param {object} req
 * @param {object} res
 */
exports.getPrivacy = async (req, res) => {
  try {
    const staticPages = await StaticPages.find(); // Finding all the StaticPages from db
    res.json({ success: true, data: staticPages[0] }); // Success
  } catch (err) {
    // Error handlings
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update staticPages
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const staticPageId = req.params.StaticPageId;
    const staticPages = await StaticPages.findByIdAndUpdate(staticPageId, req.body, { new: true }); // Finding all the StaticPages from db
    res.json({ success: true, message: 'Updated successfully', data: staticPages }); // Success
  } catch (err) {
    // Error handlings
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
