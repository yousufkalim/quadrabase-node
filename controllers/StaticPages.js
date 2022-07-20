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
 * Update staticPages
 * @param {object} req
 * @param {object} res
 */
exports.getStaticPages = async (req, res) => {
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

/**
 * Update staticPages
 * @param {object} req
 * @param {object} res
 */
exports.addSupport = async (req, res) => {
  try {
    const staticPageId = req.params.StaticPageId;
    const staticPages = await StaticPages.findByIdAndUpdate(
      staticPageId,
      { $push: { supports: req.body } },
      { new: true }
    ); // pushing new support in support array
    res.json({ success: true, message: 'Created successfully', data: staticPages }); // Success
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
exports.editSupport = async (req, res) => {
  try {
    const staticPageId = req.params.StaticPageId;
    const supportId = req.params.supportId;
    const staticPage = await StaticPages.findById(staticPageId); // finding page by id
    staticPage.supports.map((item) => {
      if (item._id.toString() === supportId.toString()) {
        item.title = req.body.title;
        item.text = req.body.text;
      }
      return item;
    });

    staticPage.save();
    res.json({ success: true, message: 'Updated successfully', data: staticPage }); // Success
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
exports.deleteSupport = async (req, res) => {
  try {
    const staticPageId = req.params.StaticPageId;
    const supportId = req.params.supportId;
    const staticPages = await StaticPages.findByIdAndUpdate(
      staticPageId,
      { $pull: { supports: { _id: supportId } } },
      { new: true }
    ); // pushing new support in support array
    res.json({ success: true, message: 'Deleted successfully', data: staticPages }); // Success
  } catch (err) {
    // Error handlings
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
