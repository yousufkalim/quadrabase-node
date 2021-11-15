const BookLibraries = require("../models/BookLibraries");
const Families = require("../models/Families");
const Categories = require("../models/Categories");
const Works = require("../models/Works");
const WorkDetails = require("../models/WorkDetails");
const populateQuery = [
  {
    path: "families",
    populate: [
      {
        path: "Families",
      },
    ],
  },
  {
    path: "categories",
    populate: [
      {
        path: "Categories",
      },
    ],
  },
  {
    path: "works",
    populate: [
      {
        path: "Works",
      },
    ],
  },
];
//BookLibrary create
exports.create = async (req, res) => {
  try {
    let name = req.body.name; //name
    const existingBookLibrary = await BookLibraries.findOne({ name }); // Finding already existing BookLibrary
    if (existingBookLibrary) {
      // If we found existing BookLibrary in db
      return res
        .status(404)
        .json({ success: false, message: "BookLibrary already exists." });
    }

    // Creating BookLibrary
    const BookLibrary = await BookLibraries.create(req.body); // Adding BookLibrary in db

    // Done
    res.json({ message: "BookLibrary created successfully", BookLibrary }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all BookLibraries
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const BookLibrary = await BookLibraries.find(); // Finding all the BookLibraries from db
    res.json({ success: true, BookLibrary }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get BookLibrary by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const BookLibraryId = req.params.BookLibraryId; // Getting BookLibrary id from URL parameter
    const BookLibrary = await BookLibraries.findById(BookLibraryId).populate(
      populateQuery
    ); // Finding BookLibrary by id
    res.json({ success: true, BookLibrary }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update BookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const BookLibraryId = req.params.BookLibraryId; // Getting BookLibrary id from URL parameter

    const BookLibrary = await BookLibraries.findByIdAndUpdate(
      BookLibraryId,
      req.body,
      {
        new: true,
      }
    ); // Updating the BookLibrary
    res.json({
      success: true,
      message: "BookLibrary updated successfully",
      BookLibrary,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const BookLibraryId = req.params.BookLibraryId; // Getting BookLibrary id from URL parameter
    let BookLibrariesExist = await BookLibraries.findById({
      _id: BookLibraryId,
    });
    if (!BookLibrariesExist) {
      return res.status(404).json({ message: "BookLibraries  not found" });
    } // double check if BookLibraries id is invalid
    const BookLibrary = await BookLibraries.findByIdAndDelete(BookLibraryId); // Deleting the BookLibrary
    res.json({ success: true, BookLibrary }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * Add Family into BookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.addFamily = async (req, res) => {
  try {
    const BookLibraryId = req.body.BookLibraryId; // Getting BookLibrary id from URL parameter
    let BookLibrary = await BookLibraries.findById({ _id: BookLibraryId });
    if (!BookLibrary) {
      return res.status(404).json({ message: "BookLibray id not found" });
    } // double check if bookLibrary id is invalid
    const familyId = req.body.familyId;
    BookLibrary = await BookLibraries.findByIdAndUpdate(
      BookLibraryId,
      { $push: { families: familyId } },
      {
        new: true,
      }
    ); // Updating the BookLibrary
    await Families.findByIdAndUpdate(
      familyId,
      { $push: { book_library: BookLibraryId } },
      {
        new: true,
      }
    ); // Updating the Families Schema
    res.json({
      success: true,
      message: "Family added Successfully",
      BookLibrary,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Add Category into BookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.addCategory = async (req, res) => {
  try {
    const BookLibraryId = req.body.BookLibraryId; // Getting BookLibrary id from URL parameter
    const categoryName = req.body.categoryName;

    let BookLibrary = await BookLibraries.findById({ _id: BookLibraryId });
    if (!BookLibrary) {
      return res.status(404).json({ message: "BookLibray id not found" });
    } // double check if bookLibrary id is invalid
    let categoryExist = await Categories.findOne({ name: categoryName });
    if (categoryExist) {
      return res.status(400).json({ message: "Category name exists" });
    } // double check if category name exists
    let category = await Categories.create({ name: categoryName });
    const categoryId = category._id;
    BookLibrary = await BookLibraries.findByIdAndUpdate(
      BookLibraryId,
      { $push: { categories: categoryId } },
      {
        new: true,
      }
    ); // Updating the BookLibrary

    category = await Categories.findByIdAndUpdate(
      categoryId,
      { $set: { book_library: BookLibraryId } },
      {
        new: true,
      }
    ); // Updating the Families Schema
    res.json({
      success: true,
      message: "Category added Successfully",
      BookLibrary,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * Edit Category into BookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.editCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Getting Category id from URL parameter
    let categoryExist = await Categories.findById({ _id: categoryId });
    if (!categoryExist) {
      return res.status(404).json({ message: "Category id not found" });
    } // double check if category id exists
    let Category = await Categories.findByIdAndUpdate(
      categoryId,
      { $set: req.body },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Category updated Successfully",
      Category,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete Category from specific book library
 * @param {object} req
 * @param {object} res
 */
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Getting Category id from URL parameter
    let categoryExist = await Categories.findById({ _id: categoryId });
    if (!categoryExist) {
      return res.status(404).json({ message: "Category  not found" });
    } // double check if Category id is invalid
    const Category = await Categories.findByIdAndDelete(categoryId); // Deleting the Category
    let BookLibraryId = Category.book_library;
    await BookLibraries.findByIdAndUpdate(
      BookLibraryId,
      { $pull: { categories: categoryId } },
      {
        new: true,
      }
    ); // Updating the BookLibrary

    res.json({
      success: true,
      message: "Category deleted successfully",
      Category,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Add Work into BookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.addWork = async (req, res) => {
  try {
    const categoryId = req.body.categoryId; // Getting BookLibrary id from URL parameter
    const workName = req.body.workName;

    let category = await Categories.findById({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category id not found" });
    } // double check if category id is invalid
    let workExist = await Works.findOne({ name: workName });
    if (workExist) {
      return res.status(400).json({ message: "Work name exists" });
    } // double check if work name exists
    let work = await Works.create({ name: workName });
    const workId = work._id;
    category = await Categories.findByIdAndUpdate(
      categoryId,
      { $push: { works: workId } },
      {
        new: true,
      }
    ).populate(populateQuery); // Updating the category

    work = await Works.findByIdAndUpdate(
      workId,
      { $set: { category: categoryId } },
      {
        new: true,
      }
    ); // Updating the Families Schema
    res.json({
      success: true,
      message: "Work added Successfully",
      category,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * Edit Work into BookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.editWork = async (req, res) => {
  try {
    const workId = req.params.workId; // Getting Category id from URL parameter
    let workExist = await Works.findById({ _id: workId });
    if (!workExist) {
      return res.status(404).json({ message: "Work id not found" });
    } // double check if work id exists
    let Work = await Works.findByIdAndUpdate(
      workId,
      { $set: req.body },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Work updated Successfully",
      Work,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete Work from specific book library
 * @param {object} req
 * @param {object} res
 */
exports.deleteWork = async (req, res) => {
  try {
    const workId = req.params.workId; // Getting Category id from URL parameter
    let workExist = await Works.findById({ _id: workId });
    if (!workExist) {
      return res.status(404).json({ message: "Work  not found" });
    } // double check if work detail id is invalid
    const Work = await Works.findByIdAndDelete(workId); // Deleting the Work
    let categoryId = Work.category;
    await Categories.findByIdAndUpdate(
      categoryId,
      { $pull: { works: categoryId } },
      {
        new: true,
      }
    ); // Updating the Category

    res.json({
      success: true,
      message: "Work deleted successfully",
      Work,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * Add WorkDetail into BookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.addWorkDetail = async (req, res) => {
  try {
    const workId = req.body.workId; // Getting BookLibrary id from URL parameter
    const workDetail = req.body.workDetail;

    let works = await Works.findById({ _id: workId });
    if (!works) {
      return res.status(404).json({ message: "workId id not found" });
    } // double check if works id is invalid
    let workDetailExist = await WorkDetails.findOne({ name: workDetail });
    if (workDetailExist) {
      return res.status(400).json({ message: "Work Detail  exists" });
    } // double check if work detail  exists
    let workDetails = await WorkDetails.create({ name: workDetail });
    const workDetailId = workDetails._id;
    works = await Works.findByIdAndUpdate(
      workId,
      { $push: { work_details: workDetailId } },
      {
        new: true,
      }
    ); // Updating the works

    works = await WorkDetails.findByIdAndUpdate(
      workDetailId,
      { $set: { work: workId } },
      {
        new: true,
      }
    ); // Updating the Families Schema
    res.json({
      success: true,
      message: "Work Detail added Successfully",
      works,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * Edit WorkDetail into BookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.editWorkDetail = async (req, res) => {
  try {
    const workDetailId = req.params.workDetailId; // Getting Category id from URL parameter
    let workDetailExist = await WorkDetails.findById({ _id: workDetailId });
    if (!workDetailExist) {
      return res.status(404).json({ message: "Work id not found" });
    } // double check if work id exists
    let WorkDetail = await WorkDetails.findByIdAndUpdate(
      workDetailId,
      { $set: req.body },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Work Detail updated Successfully",
      WorkDetail,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete WorkDetail from specific book library
 * @param {object} req
 * @param {object} res
 */
exports.deleteWorkDetail = async (req, res) => {
  try {
    const workDetailId = req.params.workDetailId; // Getting Category id from URL parameter
    let workDetailExist = await WorkDetails.findById({ _id: workDetailId });
    if (!workDetailExist) {
      return res.status(404).json({ message: "Work Detail  not found" });
    } // double check if work detail id is invalid
    const WorkDetail = await WorkDetails.findByIdAndDelete(workDetailId); // Deleting the Work
    let workId = WorkDetail.work;
    await Works.findByIdAndUpdate(
      workId,
      { $pull: { work_details: workDetailId } },
      {
        new: true,
      }
    ); // Updating the Category

    res.json({
      success: true,
      message: "WorkDetail deleted successfully",
      WorkDetail,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
