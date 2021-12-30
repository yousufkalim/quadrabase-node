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
    let nextRow;

    let lastCreatedID;

    for(let i = 0; i < jsonData.length - 1; i++){

      activeRow = jsonData[i];
      nextRow = jsonData[i+1];

      if(activeRow.Niveau == 1){

        const existingfamily = await Families.findOne({name: activeRow.Libellé}); // Finding already existing family
        if (existingfamily) {
          lastCreatedID = existingfamily._id;
          continue;
        }

        // Creating family
        const family = await Families.create({
          name: activeRow.Libellé,
          ranking: 10
        });

        lastCreatedID = (await Families.find().sort([["createdAt", -1]]))[0]._id;

      } else if(activeRow.Niveau == 2){

        // For 2,3,4 lastCreatedID can't be null 
        if(!lastCreatedID){
          continue;
        }

        const existingBookLibrary = await BookLibraries.findOne({name: activeRow.Libellé}); // Finding already existing BookLibrary
        if (existingBookLibrary) {
          if(nextRow.Niveau == 3){
            lastCreatedID = existingBookLibrary._id;
          }
          continue;
        }

        //Creating BookLibrary
        const BookLibrary = await BookLibraries.create({
          "name": activeRow.Libellé,
          "type": "public",
          "ranking": 10,
          "families": [
            lastCreatedID
          ]
        }); // Adding BookLibrary in db

        if(nextRow.Niveau == 3){
          lastCreatedID = (await BookLibraries.find().sort([["createdAt", -1]]))[0]._id;
        }

      } else if(activeRow.Niveau == 3){

        // For 2,3,4 lastCreatedID can't be null 
        if(!lastCreatedID){
          continue;
        }

        let categoryExist = await Categories.findOne({name: activeRow.Libellé});
        if (categoryExist) {
          if(nextRow.Niveau == 4){
            lastCreatedID = categoryExist._id;
          }
          continue;
        } // double check if category name exists

        let category = await Categories.create({
          "BookLibraryId": lastCreatedID,
          // "categoryName": activeRow.Libellé
          "name": activeRow.Libellé
        });

        const categoryId = category._id;
        BookLibrary = await BookLibraries.findByIdAndUpdate(
          lastCreatedID,
          { $push: { categories: categoryId } },
          {
            new: true,
          }
        ); // Updating the BookLibrary

        category = await Categories.findByIdAndUpdate(
          categoryId,
          { $set: { book_library: lastCreatedID } },
          {
            new: true,
          }
        ); // Updating the Families Schema

        if(nextRow.Niveau == 4){
          lastCreatedID = (await Categories.find().sort([["createdAt", -1]]))[0]._id;
        }

      } else if(activeRow.Niveau == 4){

        // For 2,3,4 lastCreatedID can't be null 
        if(!lastCreatedID){
          continue;
        }

        let workExist = await Works.findOne({name: activeRow.Libellé});
        if (workExist) {
          continue;
        } // double check if work name exists
        
        let work = await Works.create({
          "categoryId": lastCreatedID,
          // "workName": activeRow.Libellé
          "name": activeRow.Libellé
        });

        const workId = work._id;
        category = await Categories.findByIdAndUpdate(
          lastCreatedID,
          { $push: { works: workId } },
          {
            new: true,
          }
        ).populate(populateQuery); // Updating the category

        work = await Works.findByIdAndUpdate(
          workId,
          { $set: { category: lastCreatedID } },
          {
            new: true,
          }
        ); // Updating the Families Schema

      }

      console.log(`THIS IS THE i: ${i}, lastCreatedID: ${lastCreatedID}`);

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

