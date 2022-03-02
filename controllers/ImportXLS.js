const xlsx = require('xlsx');
const fs = require("fs");

// TODO import models
const Families = require("../models/Families");
const BookLibraries = require("../models/BookLibraries");
const Categories = require("../models/Categories");
const Works = require("../models/Works");
const WorkDetails = require("../models/WorkDetails");
const Units = require("../models/Units");

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

function cctpsArr(
  activeRow
){

  const cctps = [];

  const cctp1 = activeRow.CCTP1;
  if(cctp1){
    cctps.push(cctp1);
  }

  const cctp2 = activeRow.CCTP2;
  if(cctp2){
    cctps.push(cctp2);
  }

  const cctp3 = activeRow.CCTP3;
  if(cctp3){
    cctps.push(cctp3);
  }

  const cctp4 = activeRow.CCTP4;
  if(cctp4){
    cctps.push(cctp4);
  }

  return cctps;

}

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

    let rankingArr;
    let ranking;

    const existingfamily = await Families.findOne({name: jsonData[0].Domaine}); // Finding already existing family
    if (existingfamily) {
      lastCreatedIDFamily = existingfamily._id;
    } else {

      rankingArr = await Families.find();
      ranking = rankingArr.length;

      // Creating family
      const family = await Families.create({
        "name": jsonData[0].Domaine,
        "ranking": ranking
      });

      lastCreatedIDFamily = (await Families.find().sort([["createdAt", -1]]))[0]._id;
    }

    for(let i = 0; i < jsonData.length - 1; i++){

      activeRow = jsonData[i];

      if(activeRow.Niveau == 1){

        rankingArr = await BookLibraries.find({ families: { $all : [lastCreatedIDFamily] } });
        ranking = rankingArr.length;

        //Creating BookLibrary
        let bookLibrary = await BookLibraries.create({
          "name": activeRow.Libellé,
          "type": "public",
          "ranking": ranking,
          "families": [
            lastCreatedIDFamily
          ]
        }); // Adding BookLibrary in db

        const bookLibraryId = bookLibrary._id;

        // Update family
        const family = await Families.findByIdAndUpdate(
          lastCreatedIDFamily,
          { $push: { book_libraries: bookLibraryId } },
          {
            new: true,
          }
        ); // Updating the Family

        const cctps = cctpsArr(activeRow);
        const objCctpsArr = bookLibrary.cctp_text;

        for( let j = 0; j < cctps.length; j++ ){

          let cctp = cctps[j];

          const existingCCTP = objCctpsArr.includes(cctp);
          if (existingCCTP) {
            // do nothing
          } else {
            // Update booklibrary
            bookLibrary = await BookLibraries.findByIdAndUpdate(
              bookLibraryId,
              { $push: { cctp_text: cctp } },
              {
                new: true,
              }
            ); // Updating the BookLibrary
          }

        }

        lastCreatedIDBookLibrary = (await BookLibraries.find().sort([["createdAt", -1]]))[0]._id;

      } else if(activeRow.Niveau == 2){

        // console.log(`THIS IS THE i: ${i}, lastCreatedIDBookLibrary: ${lastCreatedIDBookLibrary}, activeRow.Libellé: ${activeRow.Libellé}`);

        rankingArr = await Categories.find({ book_library: lastCreatedIDBookLibrary });
        ranking = rankingArr.length;

        let category = await Categories.create({
          "BookLibraryId": lastCreatedIDBookLibrary,
          "name": activeRow.Libellé,
          "ranking": ranking
        });

        const categoryId = category._id;
        const bookLibrary = await BookLibraries.findByIdAndUpdate(
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

        const cctps = cctpsArr(activeRow);
        const objCctpsArr = category.cctp_text;

        for( let j = 0; j < cctps.length; j++ ){

          let cctp = cctps[j];

          const existingCCTP = objCctpsArr.includes(cctp);
          if (existingCCTP) {
            // do nothing
          } else {
            // Update Categories
            category = await Categories.findByIdAndUpdate(
              categoryId,
              { $push: { cctp_text: cctp } },
              {
                new: true,
              }
            ); // Adding cctp in category
          }

        }

        lastCreatedIDCategory = (await Categories.find().sort([["createdAt", -1]]))[0]._id;

      } else if(activeRow.Niveau == 3){

        // console.log(`THIS IS THE i: ${i}, lastCreatedIDCategory: ${lastCreatedIDCategory}, activeRow.Libellé: ${activeRow.Libellé}`);

        rankingArr = await Works.find({ category: lastCreatedIDCategory });
        ranking = rankingArr.length;

        let work = await Works.create({
          "categoryId": lastCreatedIDCategory,
          "name": activeRow.Libellé,
          "ranking": ranking
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

        const cctps = cctpsArr(activeRow);
        const objCctpsArr = work.cctp_text;

        for( let j = 0; j < cctps.length; j++ ){

          let cctp = cctps[j];

          const existingCCTP = objCctpsArr.includes(cctp);
          if (existingCCTP) {
            // do nothing
          } else {
            // Update Works
            work = await Works.findByIdAndUpdate(
              workId,
              { $push: { cctp_text: cctp } },
              {
                new: true,
              }
            ); // Updating the Works for cctps.
          }

        }

        // Update unit_price
        if(activeRow["P.U. H.T."] ?? activeRow["PU HT"]){
          // Update Works
          work = await Works.findByIdAndUpdate(
            workId,
            { unit_price: activeRow["P.U. H.T."] ?? activeRow["PU HT"] },
          ); // Updating the Works for unit_price.
        }

        // Update bpu_text
        const objBpuArr = work.bpu_text;
        if(activeRow["BPU"]){

          const existingBPU = objBpuArr.includes(activeRow["BPU"]);
          if (existingBPU) {
            // do nothing
          } else {
            // Update Works
            work = await Works.findByIdAndUpdate(
              workId,
              { $push: { bpu_text: activeRow["BPU"] } },
              {
                new: true,
              }
            ); // Updating the Works for bpu_text.
          }
        }

        // Update unit
        let unit;
        let unitID;
        const existingUnit = await Units.findOne({name: activeRow.Unité}); // Finding already existing BookLibrary
        if (existingUnit) {
          unit = existingUnit;
        } else {
          rankingArr = await Units.find();
          ranking = rankingArr.length;

          //Creating Unit
          unit = await Units.create({
            "name": activeRow.Unité,
            "symbol": activeRow.Unité,
            "ranking": ranking,
          }); // Adding Unit in db
        }

        unitID = unit._id;

        // Update Work
        work = await Works.findByIdAndUpdate(
          workId,
          { unit: unitID },
        ); // Update Work for unitID

        lastCreatedIDWork = (await Works.find().sort([["createdAt", -1]]))[0]._id;

      } else if(activeRow.Niveau == 4){

        // console.log(`THIS IS THE i: ${i}, lastCreatedIDWork: ${lastCreatedIDWork}, activeRow.Libellé: ${activeRow.Libellé}`);

        let works = await Works.findById({ _id: lastCreatedIDWork });
        if (!works) {
          continue;
        } // double check if works id is valid

        rankingArr = await WorkDetails.find({ work: lastCreatedIDWork });
        ranking = rankingArr.length;

        let workDetails = await WorkDetails.create({
          "workId": lastCreatedIDWork,
          "name": activeRow.Libellé,
          "ranking": ranking
        });
        const workDetailId = workDetails._id;
        works = await Works.findByIdAndUpdate(
          lastCreatedIDWork,
          { $push: { work_details: workDetailId } },
          {
            new: true,
          }
        ); // Updating the works

        workDetails = await WorkDetails.findByIdAndUpdate(
          workDetailId,
          { $set: { work: lastCreatedIDWork } },
          {
            new: true,
          }
        ); // Updating the WorkDetails Schema

        // Update unit_price
        if(activeRow["P.U. H.T."] ?? activeRow["PU HT"]){
          // Update Works
          workDetails = await WorkDetails.findByIdAndUpdate(
            workDetailId,
            { unit_price: activeRow["P.U. H.T."] ?? activeRow["PU HT"] },
          ); // Updating the Works for unit_price.
        }

        // Update unit
        let unit;
        let unitID;
        const existingUnit = await Units.findOne({name: activeRow.Unité}); // Finding already existing BookLibrary
        if (existingUnit) {
          unit = existingUnit;
        } else {
          rankingArr = await Units.find();
          ranking = rankingArr.length;

          //Creating Unit
          unit = await Units.create({
            "name": activeRow.Unité,
            "symbol": activeRow.Unité,
            "ranking": ranking,
          }); // Adding Unit in db
        }

        unitID = unit._id;

        // Update WorkDetails
        workDetails = await WorkDetails.findByIdAndUpdate(
          workDetailId,
          { unit: unitID },
        ); // Update WorkDetails for unitID

      }

    }

    // deleting Excel File after saving data to database
    fs.unlinkSync(file.path, (err) => {
      console.log(err);
    });

    res.status(200).send({
      success: true,
      message: `Imported -> ${file.originalname} Successfully.`
    });
    
  } catch (error) {
    console.trace("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

