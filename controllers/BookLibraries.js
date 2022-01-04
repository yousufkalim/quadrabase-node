const BookLibraries = require("../models/BookLibraries");
const Families = require("../models/Families");
const Categories = require("../models/Categories");
const Works = require("../models/Works");
const WorkDetails = require("../models/WorkDetails");
const Providers = require("../models/Providers");
const mongoose = require("mongoose");

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
    const familyId = req.body.familyId; // Getting familyId id from body

    if (req.body.type !== "private") {
      const existingBookLibrary = await BookLibraries.findOne({ name }); // Finding already existing BookLibrary
      if (existingBookLibrary) {
        // If we found existing BookLibrary in db
        return res
          .status(404)
          .json({ success: false, message: "BookLibrary already exists" });
      }
    } else {
      const existingBookLibrary = await BookLibraries.findOne({
        name,
        architect: req.body.architect,
      }); // Finding already existing BookLibrary
      if (existingBookLibrary) {
        // If we found existing BookLibrary in db
        return res
          .status(404)
          .json({ success: false, message: "BookLibrary already exists" });
      }
    }

    //Creating BookLibrary
    const BookLibrary = await BookLibraries.create(req.body); // Adding BookLibrary in db
    let BookLibraryId = BookLibrary._id;
    if (familyId) {
      await BookLibraries.findByIdAndUpdate(
        BookLibraryId,
        { $push: { families: familyId } },
        {
          new: true,
        }
      );
    }
    // Done
    res.json({
      message: "BookLibrary created successfully",
      BookLibrary,
    }); //Success
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
    let bookLibraries = await BookLibraries.aggregate([
      // Finding all the BookLibraries from db
      {
        $lookup: {
          from: "categories",
          localField: "_id",

          foreignField: "book_library",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "works",
          localField: "categories._id",
          foreignField: "category",
          as: "works",
        },
      },
      {
        $lookup: {
          from: "workdetails",
          localField: "works._id",
          foreignField: "work",
          as: "work_details",
        },
      },

      { $sort: { ranking: 1 } },
    ]);

    res.json({ success: true, bookLibraries }); // Success
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
    const bookLibrary = await BookLibraries.findById(BookLibraryId).populate(
      populateQuery
    ); // Finding BookLibrary by id
    res.json({ success: true, bookLibrary }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// search bookLibrary by name
exports.search = async (req, res) => {
  try {
    if (!req.query.q) {
      // if search query is empty
      return res
        .status(500)
        .json({ success: false, message: "Search is Empty" });
    }

    // using RegExp for search
    const regex = new RegExp(req.query.q, "i");
    const bookLibraries = await BookLibraries.find({
      name: { $regex: regex }, //// find where name matches with regex
    });

    res.json({ success: true, bookLibraries }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get BookLibrary by id
 * @param {object} req
 * @param {object} res
 */
exports.getByArchitectId = async (req, res) => {
  try {
    const ArchitectId = req.params.ArchitectId; // Getting BookLibrary id from URL parameter
    let bookLibrary = await BookLibraries.aggregate([
      // Finding all the BookLibraries from db
      {
        $match: {
          architect: mongoose.Types.ObjectId(ArchitectId),
          type: "private",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",

          foreignField: "book_library",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "works",
          localField: "categories._id",
          foreignField: "category",
          as: "works",
        },
      },
      {
        $lookup: {
          from: "workdetails",
          localField: "works._id",
          foreignField: "work",
          as: "work_details",
        },
      },

      { $sort: { ranking: 1 } },
    ]);
    res.json({ success: true, bookLibrary }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
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
    let bookLibrary = await BookLibraries.findById(BookLibraryId);
    if (!bookLibrary) {
      return res.status(404).json({ message: "BookLibraries  not found" });
    } // double check if BookLibraries id is invalid
    await BookLibraries.findByIdAndDelete(BookLibraryId); // Deleting the BookLibrary

    let categories = await Categories.deleteMany({
      book_library: BookLibraryId,
    }); // Deleting from the Categories in BookLibraries
    const works = await Works.deleteMany({
      category: categories._id,
    }); // Deleting the Works
    await WorkDetails.deleteMany({
      work: works._id,
    }); // Deleting the WorkDetails

    await Families.updateMany(
      { _id: bookLibrary.families },
      { $pull: { book_libraries: bookLibrary._id } }
    ); // Deleting from the Families
    res.json({
      success: true,
      message: "BookLibrary deleted successfully",
      BookLibrary: bookLibrary,
    }); // Success
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
    const BookLibraryId = req.body.BookLibraryId; // Getting BookLibrary id from body
    const familyId = req.body.familyId; // Getting familyId id from body

    let BookLibrary = await BookLibraries.findById({ _id: BookLibraryId });
    if (!BookLibrary) {
      return res.status(404).json({ message: "BookLibray id not found" });
    } // double check if bookLibrary id is invalid
    let family = await Families.findById(familyId);
    if (!family) {
      return res.status(404).json({ message: "Family id not found" });
    } // double check if bookLibrary id is invalid
    BookLibrary = await BookLibraries.findByIdAndUpdate(
      BookLibraryId,
      { $push: { families: familyId } },
      {
        new: true,
      }
    ); // Updating the BookLibrary
    await Families.findByIdAndUpdate(
      familyId,
      { $push: { book_libraries: BookLibraryId } },
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
    const BookLibraryId = req.body.libraryId; // Getting BookLibrary id from URL parameter
    const name = req.body.name;

    let BookLibrary = await BookLibraries.findById({ _id: BookLibraryId });
    if (!BookLibrary) {
      return res.status(404).json({ message: "BookLibray id not found" });
    } // double check if bookLibrary id is invalid
    let categoryExist = await Categories.findOne({ name: name });
    if (categoryExist) {
      return res.status(400).json({ message: "Category name exists" });
    } // double check if category name exists
    let category = await Categories.create(req.body);
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
      category,
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
    let BookLibraryId = Category.book_library; //bookLibraryId in Category collection
    await BookLibraries.findByIdAndUpdate(
      BookLibraryId,
      { $pull: { categories: categoryId } },
      {
        new: true,
      }
    ); // Updating the BookLibrary

    let workList = await Works.findOneAndDelete({ category: categoryId }); // delete works

    if (!workList) {
      return res.json({
        success: true,
        message: "Category deleted successfully",
      }); // Success
    }
    await WorkDetails.deleteOne({ work: workList._id }); // delete work details
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
    const workName = req.body.name;

    let category = await Categories.findById({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category id not found" });
    } // double check if category id is invalid
    let workExist = await Works.findOne({ name: workName });
    if (workExist) {
      return res.status(400).json({ message: "Work name exists" });
    } // double check if work name exists
    let work = await Works.create(req.body);
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
      work,
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
    await WorkDetails.deleteOne({ work: workId }); // delete work details
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
    const workDetail = req.body.name;

    let works = await Works.findById({ _id: workId });
    if (!works) {
      return res.status(404).json({ message: "workId id not found" });
    } // double check if works id is invalid
    let workDetailExist = await WorkDetails.findOne({ name: workDetail });
    if (workDetailExist) {
      return res.status(400).json({ message: "Work Detail  exists" });
    } // double check if work detail  exists
    let workDetails = await WorkDetails.create(req.body);
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
      workDetails,
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
