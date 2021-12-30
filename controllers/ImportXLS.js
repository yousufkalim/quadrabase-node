const xlsx = require('xlsx');
const fs = require("fs");

// TODO import models
const Families = require("../models/Families");
const BookLibraries = require("../models/BookLibraries");
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

// XLS import
exports.import = async (req, res) => {

  try {

    if(!req.file){
      return res.status(400).send({ success: false, message: "file was not found." });
    }

    let file = req.file;

    const workbook = xlsx.readFile(
      file.path
    );
    const sheets = workbook.SheetNames;
    var xlData = workbook.Sheets[sheets[0]];
    let jsonData = xlsx.utils.sheet_to_json(xlData);

    let activeRow;

    let lastCreatedIDFamily;
    let lastCreatedIDBookLibrary;
    let lastCreatedIDCategory;
    let lastCreatedIDWork;
    // let lastCreatedIDWorkDetail; // Don't need this, as its the last link in the hierarchy

    const existingfamily = await Families.findOne({name: jsonData[0].Domaine}); // Finding already existing family
    if (existingfamily) {
      lastCreatedIDFamily = existingfamily._id;
    } else {
      // Creating family
      const family = await Families.create({
        name: jsonData[0].Domaine,
        ranking: 1
      });

      lastCreatedIDFamily = (await Families.find().sort([["createdAt", -1]]))[0]._id;
    }

    for(let i = 0; i < jsonData.length - 1; i++){

      activeRow = jsonData[i];

      if(activeRow.Niveau == 1){

        // console.log(`THIS IS THE i: ${i}, lastCreatedIDFamily: ${lastCreatedIDFamily}, activeRow.Libellé: ${activeRow.Libellé}`);

        const existingBookLibrary = await BookLibraries.findOne({name: activeRow.Libellé}); // Finding already existing BookLibrary
        if (existingBookLibrary) {
          lastCreatedIDBookLibrary = existingBookLibrary._id;
          continue;
        }

        //Creating BookLibrary
        const BookLibrary = await BookLibraries.create({
          "name": activeRow.Libellé,
          "type": "public",
          "ranking": 10,
          "families": [
            lastCreatedIDFamily
          ]
        }); // Adding BookLibrary in db

        lastCreatedIDBookLibrary = (await BookLibraries.find().sort([["createdAt", -1]]))[0]._id;

      } else if(activeRow.Niveau == 2){

        // console.log(`THIS IS THE i: ${i}, lastCreatedIDBookLibrary: ${lastCreatedIDBookLibrary}, activeRow.Libellé: ${activeRow.Libellé}`);

        let categoryExist = await Categories.findOne({name: activeRow.Libellé});
        if (categoryExist) {
          lastCreatedIDCategory = categoryExist._id;
          continue;
        } // double check if category name exists

        let category = await Categories.create({
          "BookLibraryId": lastCreatedIDBookLibrary,
          "name": activeRow.Libellé
        });

        const categoryId = category._id;
        BookLibrary = await BookLibraries.findByIdAndUpdate(
          lastCreatedIDBookLibrary,
          { $push: { categories: categoryId } },
          {
            new: true,
          }
        ); // Updating the BookLibrary

        category = await Categories.findByIdAndUpdate(
          categoryId,
          { $set: { book_library: lastCreatedIDBookLibrary } },
          {
            new: true,
          }
        ); // Updating the Families Schema

        lastCreatedIDCategory = (await Categories.find().sort([["createdAt", -1]]))[0]._id;

      } else if(activeRow.Niveau == 3){

        // console.log(`THIS IS THE i: ${i}, lastCreatedIDCategory: ${lastCreatedIDCategory}, activeRow.Libellé: ${activeRow.Libellé}`);

        let workExist = await Works.findOne({name: activeRow.Libellé});
        if (workExist) {
          lastCreatedIDWork = workExist._id;
          continue;
        } // double check if work name exists
        
        let work = await Works.create({
          "categoryId": lastCreatedIDCategory,
          "name": activeRow.Libellé
        });

        const workId = work._id;
        category = await Categories.findByIdAndUpdate(
          lastCreatedIDCategory,
          { $push: { works: workId } },
          {
            new: true,
          }
        ).populate(populateQuery); // Updating the category

        work = await Works.findByIdAndUpdate(
          workId,
          { $set: { category: lastCreatedIDCategory } },
          {
            new: true,
          }
        ); // Updating the Works Schema

        lastCreatedIDWork = (await Works.find().sort([["createdAt", -1]]))[0]._id;

      } else if(activeRow.Niveau == 4){

        // console.log(`THIS IS THE i: ${i}, lastCreatedIDWork: ${lastCreatedIDWork}, activeRow.Libellé: ${activeRow.Libellé}`);

        let works = await Works.findById({ _id: lastCreatedIDWork });
        if (!works) {
          continue;
        } // double check if works id is valid
        let workDetailExist = await WorkDetails.findOne({ name: activeRow.Libellé });
        if (workDetailExist) {
          continue;
        } // double check if work detail exists
        let workDetails = await WorkDetails.create({
          "workId": lastCreatedIDWork,
          "name": activeRow.Libellé
        });
        const workDetailId = workDetails._id;
        works = await Works.findByIdAndUpdate(
          lastCreatedIDWork,
          { $push: { work_details: workDetailId } },
          {
            new: true,
          }
        ); // Updating the works

        works = await WorkDetails.findByIdAndUpdate(
          workDetailId,
          { $set: { work: lastCreatedIDWork } },
          {
            new: true,
          }
        ); // Updating the Families Schema

      }

    }

    res.status(200).send({
      success: true,
      message: "All good."
    });

  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

