const Architects = require('../models/Architects');
const Providers = require('../models/Providers');
const ArchitectsChap0 = require('../models/ArchitectsChap0');
const Categories = require('../models/Categories');
const Works = require('../models/Works');
const Admins = require('../models/Admins');

const Projects = require('../models/Projects');
const Families = require('../models/Families');

const BookLibraries = require('../models/BookLibraries');
const WorkDetails = require('../models/WorkDetails');
const Stakeholders = require('../models/Stakeholders');

const Subscriptions = require('../models/Subscriptions');
const Licenses = require('../models/Licenses');
const Invoice = require('../models/Invoice');

const moment = require('moment');
moment.locale('fr');

const { sendEmail, sendQuoteEmail } = require('../utils/sendEmail');

const bcrypt = require('bcryptjs');
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const JWT = require('jsonwebtoken');
const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../utils/options');

const fr = require('../utils/frLang');
const en = require('../utils/enLang');

//architect create
exports.create = async (req, res) => {
  try {
    let lang = req.headers.lang ? req.headers.lang : 'fr';
    let email = req.body.email; //email
    let password = req.body.password; //password

    const existingArchitect = await Architects.findOne({ email }); // Finding already existing architect
    const existingAdmin = await Admins.findOne({ email }); // Finding already existing architect

    if (existingArchitect) {
      // If we found existing architect in db
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? fr.ArchitectSignUp1 : en.ArchitectSignUp1,
      });
    }
    if (existingAdmin) {
      // If we found existing admin in db
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? fr.AdminRegisterMsg1 : en.AdminRegisterMsg1,
      });
    }
    if (req.file) {
      req.body.profile_pic = req.file.path;
    }
    let client_code = Math.floor(1000 + Math.random() * 9000); //random number generator for client_code
    req.body.client_code = client_code;
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt));
    // Creating architect
    const architect = await Architects.create(req.body); // Adding architect in db

    // Done
    res.json({ message: 'Architecte créé avec succès', architect }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

//architect create
exports.signup = async (req, res) => {
  try {
    let lang = req.headers.lang ? req.headers.lang : 'fr';
    const subscription = req.body.subscription;
    delete req.body.subscription;

    let email = req.body.email; //email
    let password = req.body.password; //password

    const existingArchitect = await Architects.findOne({ email }); // Finding already existing architect
    const existingAdmin = await Admins.findOne({ email }); // Finding already existing architect

    if (existingArchitect) {
      // If we found existing architect in db
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? fr.ArchitectSignUp1 : en.ArchitectSignUp1,
      });
    }
    if (existingAdmin) {
      // If we found existing admin in db
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? fr.AdminRegisterMsg1 : en.AdminRegisterMsg1,
      });
    }
    let client_code = Math.floor(1000 + Math.random() * 9000); //random number generator for client_code
    req.body.client_code = client_code;
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt));
    // Creating architect
    const architect = await Architects.create(req.body); // Adding architect in db

    // assinging subscription
    const data = {
      start_date: moment(new Date()).add(1, 'days').format('YYYY/MM/DD'),
      end_date: moment(
        moment(new Date()).add(subscription.duration, 'months').add(1, 'days').calendar()
      ).format('YYYY/MM/DD'),
      projects: subscription.projects,
      assigned_to: architect._id,
    };

    const license = await Licenses.create(data);

    architect.subscriptions = license._id;
    await architect.save();

    // Done
    res.json({
      message: 'Prescripteur créé avec succès',
      architect,
    }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.createOnSingup = async (req, res) => {
  try {
    let lang = req.headers.lang ? req.headers.lang : 'fr';
    let email = req.body.email; //email
    let password = req.body.password; //password

    const existingArchitect = await Architects.findOne({ email }); // Finding already existing architect
    const existingAdmin = await Admins.findOne({ email }); // Finding already existing architect

    if (existingArchitect) {
      // If we found existing architect in db
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? fr.ArchitectSignUp1 : en.ArchitectSignUp1,
      });
    }
    if (existingAdmin) {
      // If we found existing admin in db
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? fr.AdminRegisterMsg1 : en.AdminRegisterMsg1,
      });
    }
    let client_code = Math.floor(1000 + Math.random() * 9000); //random number generator for client_code
    req.body.client_code = client_code;
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt));

    // Creating architect
    const architect = await Architects.create(req.body); // Adding architect in db

    // Done
    res.json({
      success: true,
      message: 'Prescripteur créé avec succès',
      architect,
    }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

//BookLibrary create
exports.createBookLibrary = async (req, res) => {
  try {
    let name = req.body.name; //book library name
    let architectId = req.user.id; //architect id

    const existingBookLibrary = await BookLibraries.findOne({ name }); // Finding already existing BookLibrary
    if (existingBookLibrary) {
      // If we found existing BookLibrary in db
      return res.status(404).json({ success: false, message: 'BookLibrary already exists' });
    }

    // Creating BookLibrary
    req.body.architect = architectId;
    const BookLibrary = await BookLibraries.create(req.body); // Adding BookLibrary in db

    await Architects.findByIdAndUpdate(
      architectId,
      { $push: { libraries: BookLibrary._id } },
      {
        new: true,
      }
    ); //update architect to push bookLibrary
    // Done
    res.json({
      message: 'BookLibrary created successfully',
      BookLibrary,
    }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};
//Architect login
exports.login = async (req, res) => {
  try {
    let email = req.body.email; //email
    let password = req.body.password; //password
    const user = await Architects.findOne({ email }).populate({
      path: 'subscriptions',
      populate: {
        path: 'subscription',
        model: 'Subscriptions',
      },
    }); // Finding already existing Architect
    if (!user) {
      // If we found existing user in db
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé!' });
    }

    const isCorrect = bcrypt.compareSync(password, user.password); // Check if user password is correct
    if (!isCorrect) return res.status(401).json({ message: 'Mot de passe incorrect' });
    const token = JWT.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 60,
    });
    const result = { user, token };
    // Done
    res.json({
      success: true,
      message: "L'utilisateur s'est connecté avec succès",
      result,
    }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Forgot Password
 * @param {object} req
 * @param {object} res
 */
exports.forgotPassword = async (req, res) => {
  try {
    let lang = req.headers.lang ? req.headers.lang : 'fr';
    let email = req.body.email;
    let user = await Architects.findOne({ email });

    if (!user) {
      user = await Providers.findOne({ email }); // Finding already existing Provider
      if (!user)
        return res.status(404).json({
          success: false,
          message: lang === 'fr' ? fr.ArchitectSignUp3 : en.ArchitectSignUp3,
        });
    }

    // Generating random password
    let randomPassword = Math.random().toString(36).slice(-8);

    // Sending email to user
    sendEmail(email, randomPassword)
      .then(async () => {
        // If email is sent then we have to update the password in db
        user.password = await bcrypt.hash(randomPassword, parseInt(bcryptSalt));
        await user.save();

        // Done
        res.json({
          success: true,
          message: lang === 'fr' ? fr.AdminForgetPass2 : en.AdminForgetPass2,
        });
      })
      .catch((err) => {
        // Error handling
        console.log('Error ----> ', err);
        res.status(500).json({
          success: false,
          message: lang === 'fr' ? fr.AdminForgetPass3 : en.AdminForgetPass3,
        });
      });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({
      success: false,
      message: lang === 'fr' ? fr.AdminForgetPass3 : en.AdminForgetPass3,
    });
  }
};
/**
 * Reset Password
 * @param {object} req
 * @param {object} res
 */
exports.resetPassword = async (req, res) => {
  try {
    let resetPasswordToken = req.body.resetPasswordToken; //token
    let password = req.body.password;
    let user = await Architects.findOne({ resetPasswordToken }); // Finding already existing Architect
    if (!user) {
      // If we not found existing user in db
      return res.status(401).json({ success: false, message: 'Invalid Token!' });
    }
    let isExpired = Number(user.restPasswordExpires);
    if (isExpired < Date.now()) {
      return res.status(401).json({ success: false, message: 'Token Expired!' });
    }
    password = bcrypt.hashSync(password, parseInt(bcryptSalt));
    user = await Architects.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: password,
        },
      },
      { new: true }
    );
    // Done
    res.json({ message: 'Password Updated successfully', user }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};
/**
 * Get all Architects
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const architects = await Architects.find()
      .sort([['createdAt', -1]])
      .populate({
        path: 'subscriptions',
        populate: {
          path: 'subscription',
          model: 'Subscriptions',
        },
      }); // Finding all the Architects from db
    res.json({ success: true, architects }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get architect by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    const architect = await Architects.findById(architectId); // Finding architect by id
    res.json({ success: true, architect }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// get logged In user
exports.loggedIn = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// get Stakeholders of current architect
exports.getStakeholders = async (req, res) => {
  try {
    const architect = await Architects.findById(req.userId).populate({
      path: 'stakeholders',
      populate: {
        path: 'type',
        model: 'StakeholderTypes',
      },
    });
    res.status(200).json({ success: true, stakeholders: architect.stakeholders });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update architect by admin
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    if (req.file) {
      req.body.profile_pic = req.file.path;
    }
    const architect = await Architects.findByIdAndUpdate(architectId, req.body, {
      new: true,
    }); // Updating the architect
    res.json({
      success: true,
      message: 'Architect updated successfully',
      architect,
    }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update architect by architect
 * @param {object} req
 * @param {object} res
 */
exports.updateByArchitect = async (req, res) => {
  try {
    let lang = req.headers.lang ? req.headers.lang : 'fr';
    if (req.body.oldPassword) {
      if (!req.body.newPassword)
        return res.status(401).json({
          message: lang === 'fr' ? fr.ArchitectSignUp4 : en.ArchitectSignUp4,
        });
      const isCorrect = bcrypt.compareSync(req.body.oldPassword, req.user.password); // Check if old password is correct
      if (!isCorrect)
        return res.status(401).json({
          message: lang === 'fr' ? fr.ArchitectSignUp5 : en.ArchitectSignUp5,
        });

      req.body.password = bcrypt.hashSync(req.body.newPassword, parseInt(bcryptSalt)); // setting new password
      delete req.body.newPassword;
      delete req.body.oldPassword;

      if (req.file) {
        req.body.profile_pic = req.file.path;
      } // checking for file

      const architect = await Architects.findByIdAndUpdate(req.params.architectId, req.body, {
        new: true,
      }); // Updating the architect
      res.json({
        success: true,
        message: 'Updated successfully',
        architect,
      }); // Success
    } else {
      const architectId = req.params.architectId; // Getting architect id from URL parameter
      if (req.file) {
        req.body.profile_pic = req.file.path;
      }
      const architect = await Architects.findByIdAndUpdate(architectId, req.body, {
        new: true,
      }); // Updating the architect
      res.json({
        success: true,
        message: 'Updated successfully',
        architect,
      }); // Success
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
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
    let lang = req.headers.lang ? req.headers.lang : 'fr';
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    let architect = await Architects.findOne({ _id: architectId }); // Finding already existing Architect
    if (!architect) {
      // If we not found existing architect in db
      return res.status(401).json({
        success: false,
        message: lang === 'fr' ? fr.ArchitectSignUp3 : en.ArchitectSignUp3,
      });
    }

    architect = await Architects.findByIdAndDelete(architectId); // Deleting the architect

    await Stakeholders.findOneAndDelete({
      architect: architectId,
    }); // Deleting the Stakeholders

    await ArchitectsChap0.findOneAndDelete({
      architect: architectId,
    }); // Deleting the ArchitectsChap0

    await Projects.findOneAndDelete({
      architect: architectId,
    }); // Deleting from the Projects

    let bookLibraries = await BookLibraries.findOneAndDelete({
      architect: architectId,
    }); // Deleting the BookLibraries
    bookLibraries = await BookLibraries.find({});
    if (bookLibraries.length == 0) {
      return res.json({
        success: true,
        message: 'Architect Deleted Successfully',
        architect,
      }); // Success
    }
    await Families.updateMany(
      { _id: bookLibraries.families },
      { $pull: { book_libraries: bookLibraries._id } }
    ); // Deleting from the Families

    let categories = await Categories.findOneAndDelete({
      book_library: bookLibraries._id,
    }); // Deleting the Categories
    categories = await Categories.find({});
    if (categories.length == 0) {
      return res.json({
        success: true,
        message: 'Architect Deleted Successfully',
        architect,
      }); // Success
    }
    let works = await Works.findOneAndDelete({
      category: categories._id,
    }); // Deleting the Works
    await WorkDetails.findOneAndDelete({
      work: works._id,
    }); // Deleting the WorkDetails

    res.json({
      success: true,
      message: 'Architect Deleted Successfully',
      architect,
    }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * Delete bookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.deleteBookLibrary = async (req, res) => {
  try {
    const BookLibraryId = req.params.BookLibraryId; // Getting BookLibrary id from URL parameter
    let bookLibrary = await BookLibraries.findById(BookLibraryId);
    if (!bookLibrary) {
      return res.status(404).json({ message: 'BookLibraries  not found' });
    } // double check if BookLibraries id is invalid
    await BookLibraries.findByIdAndDelete(BookLibraryId); // Deleting the BookLibrary
    let architectId = bookLibrary.architect;

    await Architects.findByIdAndUpdate(
      architectId,
      { $pull: { libraries: BookLibraryId } },
      {
        new: true,
      }
    ); // Deleting from the architect
    let categories = await Categories.deleteMany({
      book_library: BookLibraryId,
    }); // Deleting from the Categories in BookLibraries
    const works = await Works.deleteMany({
      category: categories._id,
    }); // Deleting the Works
    await WorkDetails.deleteMany({
      work: works._id,
    }); // Deleting the WorkDetails

    res.json({
      success: true,
      message: 'BookLibrary deleted successfully',
      BookLibrary: bookLibrary,
    }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// addSubscription
exports.addSubscription = async (req, res) => {
  try {
    if (!req.body.subscriptionId) {
      await Architects.findByIdAndUpdate(req.params.architectId, {
        subscriptions: [],
        authorized: 'No',
      });
      res.json({ success: true, message: 'Subscription Removed!' });
    } else {
      const subscription = await Subscriptions.findById(req.body.subscriptionId);

      const data = {
        subscription: subscription._id,
        start_date: moment(req.body.start_date).format('YYYY/MM/DD'),
        end_date: moment(req.body.end_date).format('YYYY/MM/DD'),
        credit: subscription.credit,
        projects: req.body.projects,
        architect: req.params.architectId,
        assigned_to: req.params.architectId,
      };

      const license = await Licenses.create(data);

      await Architects.findByIdAndUpdate(
        req.params.architectId,
        {
          subscriptions: license._id,
        },
        { new: true }
      );
      res.json({ success: true, message: 'Subscription Updated!' });
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.generatePdf = async (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, '../templates/invoice.html'), 'utf-8');
  const filename = Math.random() + '_doc' + '.pdf';

  const invoice = await Invoice.find();
  let facture = '';
  let count = '';
  let currentYear = moment().format('YYYY');
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

  const architect = await Architects.findById(req.body.archId);
  const obj = {
    Facture: facture,
    architectEstablishment: architect.establishment,
    architectAddress: architect.address_1,
    architectPostalcode: architect.postal_code,
    architectCity: architect.city,
    architectName: `${architect.last_name} ${architect.first_name}`,
    architectEmail: architect.email,
    architectPhone: architect.phone,
    date: moment(new Date()).format('DD MMMM YYYY'),
    subscriptionsData: req.body.subscriptionsData,
    totalHT: req.body.totalHT,
    tvaPercentage: req.body.tvaPercentage,
    tvaAmount: req.body.tvaAmount,
    totalTTC: req.body.TotalCost,
    paymentMode: req.body.paymentMode,
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
  let temp = req.body.subscriptionsData.map((item) => {
    return { subscription: item._id, count: item.count };
  });
  obj.subscriptionsData = temp;
  await Invoice.create(obj);
  res.status(200).json({
    path: filepath,
  });
};

exports.generateQuotePdf = async (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, '../templates/quote.html'), 'utf-8');
  const filename = Math.random() + '_doc' + '.pdf';

  const invoice = await Invoice.find();
  let facture = '';
  let count = '';
  let currentYear = moment().format('YYYY');
  let currentMonth = moment().format('MM');
  if (invoice.length > 0) {
    count = invoice[invoice.length - 1].invoiceCount + 1;
    if (count < 10) {
      facture = `D${currentYear}${currentMonth}000${count}`;
    } else if (count < 100) {
      facture = `D${currentYear}${currentMonth}00${count}`;
    } else if (count < 1000) {
      facture = `D${currentYear}${currentMonth}0${count}`;
    } else if (count > 1000) {
      facture = `D${currentYear}${currentMonth}${count}`;
    }
  } else {
    facture = `D${currentYear}${currentMonth}0001`;
  }

  const architect = await Architects.findById(req.body.archId);
  const obj = {
    Facture: facture,
    architectEstablishment: architect.establishment,
    architectAddress: architect.address_1,
    architectPostalcode: architect.postal_code,
    architectCity: architect.city,
    architectName: `${architect.last_name} ${architect.first_name}`,
    architectEmail: architect.email,
    architectPhone: architect.phone,
    date: moment(new Date()).format('DD MMMM YYYY'),
    subscriptionsData: req.body.subscriptionsData,
    totalHT: req.body.totalHT,
    tvaPercentage: req.body.tvaPercentage,
    tvaAmount: req.body.tvaAmount,
    totalTTC: req.body.TotalCost,
    paymentMode: req.body.paymentMode,
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
  let temp = req.body.subscriptionsData.map((item) => {
    return { subscription: item._id, count: item.count };
  });
  obj.subscriptionsData = temp;
  await Invoice.create(obj);

  // Sending email to user
  sendQuoteEmail('contact@qbsoft.fr', filepath)
    .then(async () => {
      // Success
      console.log('Email has been sent');
    })
    .catch((err) => {
      // Error handling
      console.log('Error ----> ', err);
    });
  res.status(200).json({
    path: filepath,
  });
};
