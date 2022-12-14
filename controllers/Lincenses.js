const Subscriptions = require('../models/Subscriptions');
const Licenses = require('../models/Licenses');
const Architects = require('../models/Architects');
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_URI);
const Invoice = require('../models/Invoice');
const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../utils/options');
const Admins = require('../models/Admins');
const bcrypt = require('bcryptjs');
const Providers = require('../models/Providers');
const { sendQuoteEmail } = require('../utils/sendEmail');
const { logo, screenshot } = require('../templates/logo');

//subscription create
exports.buy = async (req, res) => {
  try {
    const subscription = await Subscriptions.findById(req.body.subscription);

    const data = {
      subscription: subscription._id,
      start_date: moment(new Date()).add(1, 'days').format('YYYY/MM/DD'),
      end_date: moment(
        moment(new Date()).add(subscription.duration, 'months').add(1, 'days').calendar()
      ).format('YYYY/MM/DD'),
      credit: subscription.credit,
      projects: subscription.projects,
      architect: req.params.architectId
    };

    const license = await Licenses.create(data);

    await Architects.findByIdAndUpdate(
      req.params.architectId,
      { $push: { myLicenses: license._id } },
      { new: true }
    );

    res.json({ success: true, message: 'Success!', license });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

//buy credits
exports.buyprojects = async (req, res) => {
  try {
    const subscription = await Subscriptions.findById(req.body.subscription);

    const license = await Licenses.findById(req.params.licenseId);
    license.projects = license.projects + subscription.projects;
    await license.save();

    res.json({ success: true, message: 'Success!', license });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

//buy credits
exports.renew = async (req, res) => {
  try {
    const subscription = await Subscriptions.findById(req.body.subscription);

    const license = await Licenses.findById(req.params.licenseId);
    license.end_date = moment(
      moment(license.end_date).add(subscription.duration, 'months').calendar()
    ).format('YYYY/MM/DD');
    await license.save();

    res.json({ success: true, message: 'Success!', license });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

// get by architect id
exports.getByArchitectId = async (req, res) => {
  try {
    const license = await Licenses.find({
      architect: req.params.architectId
    })
      .populate('subscription')
      .populate('assigned_to');

    res.json({ success: true, license });
  } catch (err) {
    // Error handling
    console.log('Error---->', err.message);
    res.status(500).json({ message: err.message });
  }
};

// assign unassign Subscription
exports.assign = async (req, res) => {
  try {
    if (!req.body.email) {
      res.status(500).json({
        success: false,
        message: 'Email is required!'
      });
    } else {
      const architect = await Architects.findOne({
        email: req.body.email
      }).populate('subscriptions');

      if (!architect) {
        return res.status(404).json({ success: false, message: 'Architect Not Found!' });
      }

      const license = await Licenses.findByIdAndUpdate(
        req.params.licenseId,
        {
          assigned_to: architect._id
        },
        { new: true }
      );

      let updatedSubscription = {
        end_date:
          license.end_date && architect.subscriptions.end_date
            ? moment(license.end_date).isAfter(architect.subscriptions.end_date)
              ? license.end_date
              : architect.subscriptions.end_date
            : architect.subscriptions.end_date,
        projects: license.projects + architect.subscriptions.projects
      };

      await Licenses.findByIdAndUpdate(architect.subscriptions._id, updatedSubscription, {
        new: true
      });

      res.json({
        success: true,
        message: 'Subscription Assigned!'
      });
    }
  } catch (err) {
    // Error handling
    console.log('Error---->', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.json({ success: true, url: invoice.filePath });
  } catch (err) {
    // Error handling
    console.log('Error---->', err.message);
    res.status(500).json({ message: err.message });
  }
};

// checkout
exports.checkout = async (req, res) => {
  try {
    let metaData = req.body.metaData;
    let lineItems = req.body.line_items;
    let invoice = '';
    if (metaData.type === 'providerSignup' || metaData.type === 'ProviderOrder') {
      invoice = await providerInvoice(req.body.invoiceData);
    } else {
      invoice = await architectInvoice(req.body.invoiceData);
    }
    metaData.filePath = invoice.filePath;
    metaData.invoiceId = invoice._id.toString();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [req.body.paymentMethod],
      line_items: lineItems,
      locale: 'fr',
      mode: 'payment',
      success_url: process.env.STRIPE_RETURN_URL,
      cancel_url: process.env.STRIPE_REJECT_URL,
      metadata: metaData
    });
    res.json({ success: true, url: session.url });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};
// checkoutMandat
exports.checkoutMandat = async (req, res) => {
  try {
    let metaData = req.body.metaData;
    let lineItems = req.body.line_items;
    let invoice = '';
    if (metaData.type === 'providerSignup' || metaData.type === 'ProviderOrder') {
      invoice = await providerInvoice(req.body.invoiceData);
    } else {
      invoice = await architectInvoice(req.body.invoiceData);
    }
    metaData.filePath = invoice.filePath;
    metaData.invoiceId = invoice._id.toString();

    console.log('invoice mandat', invoice);
    console.log('metaData mandat', metaData);

    // webhook data
    const subscriptionsData = (
      await Invoice.findById(metaData.invoiceId).populate('subscriptionsData.subscription')
    ).subscriptionsData;
    delete metaData.invoiceId;
    delete metaData.type;
    let totalProjects = 0;
    let totalDuration = 0;
    let durationsArray = [];
    console.log('subscriptionsData mandat', subscriptionsData);

    subscriptionsData.map(async item => {
      totalProjects += item.subscription.projects * item.count;
      durationsArray.push(item.subscription.duration * item.count);
      if (parseInt(item.count) !== 0) {
        const data = {
          subscription: item.subscription._id,
          start_date:
            item.subscription.duration > 0
              ? moment(new Date()).add(1, 'days').format('YYYY/MM/DD')
              : null,
          end_date:
            item.subscription.duration > 0
              ? moment(
                  moment(new Date())
                    .add(item.subscription.duration * parseInt(item.count), 'months')
                    .add(1, 'days')
                    .calendar(),
                  'DD/MM/YYYY'
                ).format('YYYY/MM/DD')
              : null,
          projects:
            item.subscription.projects >= 0 ? item.subscription.projects * parseInt(item.count) : 0,
          architect: metaData.id,
          assigned_to: metaData.id
        };
        const license = await Licenses.create(data);

        await Architects.findByIdAndUpdate(
          metaData.id,
          { $push: { myLicenses: license._id } },
          { new: true }
        );
      }
    });

    if (durationsArray.length > 0) {
      totalDuration = Math.max(...durationsArray);
    }

    // finding architect
    const architect = await Architects.findById(metaData.id); // Adding architect in db

    // // assinging subscription
    const data = {
      start_date: moment(new Date()).format('YYYY/MM/DD'),
      end_date: moment(
        moment(new Date()).add(totalDuration, 'months').calendar(),
        'DD/MM/YYYY'
      ).format('YYYY/MM/DD'),
      projects: totalProjects,
      assigned_to: architect._id
    };

    const license = await Licenses.create(data);
    architect.subscriptions = license._id;
    architect.authorized = 'Yes';
    await architect.save();
    // Sending email to user
    console.log('architect.email', architect.email);
    console.log('metaData', metaData.filePath);
    sendQuoteEmail(architect.email, metaData.filePath)
      .then(async () => {
        // Success
        console.log('Email has been sent');
      })
      .catch(err => {
        // Error handling
        console.log('Error ----> ', err);
      });

    // end web hook

    res.json({ success: true, url: process.env.STRIPE_RETURN_URL });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.Webhook = async (req, res) => {
  let sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.WEBHOOK_URI //////webhook scret key
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const metaData = session.metadata;
      // Check if buy subscription
      if (metaData.type === 'architectSignup') {
        const subscriptionsData = (
          await Invoice.findById(metaData.invoiceId).populate('subscriptionsData.subscription')
        ).subscriptionsData;
        delete metaData.invoiceId;
        delete metaData.type;
        let totalProjects = 0;
        let totalDuration = 0;
        let durationsArray = [];
        subscriptionsData.map(async item => {
          totalProjects += item.subscription.projects * item.count;
          durationsArray.push(item.subscription.duration * item.count);
          if (parseInt(item.count) !== 0) {
            const data = {
              subscription: item.subscription._id,
              start_date:
                item.subscription.duration > 0
                  ? moment(new Date()).add(1, 'days').format('YYYY/MM/DD')
                  : null,
              end_date:
                item.subscription.duration > 0
                  ? moment(
                      moment(new Date())
                        .add(item.subscription.duration * parseInt(item.count), 'months')
                        .add(1, 'days')
                        .calendar(),
                      'DD/MM/YYYY'
                    ).format('YYYY/MM/DD')
                  : null,
              projects:
                item.subscription.projects >= 0
                  ? item.subscription.projects * parseInt(item.count)
                  : 0,
              architect: metaData.id,
              assigned_to: metaData.id
            };
            const license = await Licenses.create(data);

            await Architects.findByIdAndUpdate(
              metaData.id,
              { $push: { myLicenses: license._id } },
              { new: true }
            );
          }
        });
        if (durationsArray.length > 0) {
          totalDuration = Math.max(...durationsArray);
        }

        // finding architect
        const architect = await Architects.findById(metaData.id); // Adding architect in db

        // // assinging subscription
        const data = {
          start_date: moment(new Date()).format('YYYY/MM/DD'),
          end_date: moment(
            moment(new Date()).add(totalDuration, 'months').calendar(),
            'DD/MM/YYYY'
          ).format('YYYY/MM/DD'),
          projects: totalProjects,
          assigned_to: architect._id
        };

        const license = await Licenses.create(data);
        architect.subscriptions = license._id;
        architect.authorized = 'Yes';
        await architect.save();
        // Sending email to user
        sendQuoteEmail(architect.email, metaData.filepath)
          .then(async () => {
            // Success
            console.log('Email has been sent');
          })
          .catch(err => {
            // Error handling
            console.log('Error ----> ', err);
          });
      } else if (metaData.type === 'architectOrder') {
        const subscriptionsData = (
          await Invoice.findById(metaData.invoiceId).populate('subscriptionsData.subscription')
        ).subscriptionsData;
        delete metaData.invoiceId;
        delete metaData.type;
        let architect = {};
        subscriptionsData.map(async item => {
          if (parseInt(item.count) !== 0) {
            const data = {
              subscription: item.subscription._id,
              start_date:
                item.subscription.duration > 0
                  ? moment(new Date()).add(1, 'days').format('YYYY/MM/DD')
                  : null,
              end_date:
                item.subscription.duration > 0
                  ? moment(
                      moment(new Date())
                        .add(item.subscription.duration * parseInt(item.count), 'months')
                        .add(1, 'days')
                        .calendar(),
                      'DD/MM/YYYY'
                    ).format('YYYY/MM/DD')
                  : null,
              projects:
                item.subscription.projects >= 0
                  ? item.subscription.projects * parseInt(item.count)
                  : 0,
              architect: metaData.id
            };
            const license = await Licenses.create(data);

            architect = await Architects.findByIdAndUpdate(
              metaData.id,
              { $push: { myLicenses: license._id } },
              { new: true }
            );
          }
        });
        sendQuoteEmail(architect.email, metaData.filepath)
          .then(async () => {
            // Success
            console.log('Email has been sent');
          })
          .catch(err => {
            // Error handling
            console.log('Error ----> ', err);
          });
      } else if (metaData.type === 'providerSignup') {
        const subscription = {
          id: metaData.subscriptionid,
          name: metaData.subscriptionName,
          start_date: metaData.subscriptionStartDate,
          end_date: metaData.subscriptionEndDate
        };
        // Creating provider
        const provider = await Providers.findByIdAndUpdate(
          metaData.id,
          { subscription, authorized: 'Yes' },
          { new: true }
        ); // Adding provider in db
        // Sending email to user
        sendQuoteEmail(provider.email, metaData.filepath)
          .then(async () => {
            // Success
            console.log('Email has been sent');
          })
          .catch(err => {
            // Error handling
            console.log('Error ----> ', err);
          });
      } else if (metaData.type === 'ProviderOrder') {
        const provider = await Providers.findById(metaData.providerId); // Adding architect in db
        let endDate = moment(
          moment(provider.subscription.end_date).add(metaData.duration, 'months'),
          'DD/MM/YYYY'
        ).format('YYYY/MM/DD');
        provider.subscription.end_date = endDate;
        provider.save();
        sendQuoteEmail(provider.email, metaData.filepath)
          .then(async () => {
            // Success
            console.log('Email has been sent');
          })
          .catch(err => {
            // Error handling
            console.log('Error ----> ', err);
          });
      }

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.send();
};

const architectInvoice = async data => {
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
  const architect = await Architects.findById(data.archId);
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
    subscriptionsData: data.subscriptionsData,
    totalHT: data.totalHT,
    tvaPercentage: data.tvaPercentage,
    tvaAmount: data.tvaAmount,
    totalTTC: data.TotalCost,
    paymentMode: data.paymentMode,
    logo,
    screenshot
  };

  const document = {
    html: html,
    data: obj,
    path: `./uploads/invoice/${filename}`
  };
  await pdf
    .create(document, options)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    });
  const filepath = `${process.env.BASE_URL}/uploads/invoice/${filename}`;
  obj.invoiceCount = count ? count : 1;
  obj.filePath = filepath;
  let temp = data.subscriptionsData.map(item => {
    return { subscription: item._id, count: item.count };
  });
  obj.subscriptionsData = temp;
  const newInvoice = await Invoice.create(obj);
  return newInvoice;
};

const providerInvoice = async data => {
  const html = fs.readFileSync(path.join(__dirname, '../templates/providerInvoice.html'), 'utf-8');
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
  const provider = await Providers.findById(data.archId);

  const obj = {
    Facture: facture,
    providerEstablishment: provider.establishment,
    providerAddress: provider.address1,
    providerPostalcode: provider.zipcode,
    providerCity: provider.city,
    providerName: `${provider.name} ${provider.firstname}`,
    providerEmail: provider.email,
    providerPhone: provider.telephone_no,
    date: moment(new Date()).format('DD MMMM YYYY'),
    subscriptionCode: data.subscriptionCode,
    subscriptionName: data.subscriptionName,
    DESTINATAIRE: data.address1,
    alertPrice: data.alertPrice,
    alertCount: data.alertCount,
    alertTotal: data.alertTotal,
    referenPrice: data.referenPrice,
    referenCount: data.referenCount,
    referenTotal: data.referenTotal,
    totalHT: data.totalHT,
    tvaPercentage: data.tvaPercentage,
    tvaAmount: data.tvaAmount,
    totalTTC: data.TotalCost,
    paymentMode: data.paymentMode,
    logo,
    screenshot
  };

  const document = {
    html: html,
    data: obj,
    path: `./uploads/invoice/${filename}`
  };
  await pdf
    .create(document, options)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    });
  const filepath = `${process.env.BASE_URL}/uploads/invoice/${filename}`;
  obj.invoiceCount = count ? count : 1;
  obj.filePath = filepath;
  const newInvoice = await Invoice.create(obj);
  return newInvoice;
};
