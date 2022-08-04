/**
 * Node-JS Boilerplate
 * @author Shehzad Ahmed
 */
require('dotenv').config();
const app = require('express')();
const port = process.env.PORT || 5000;
require('./database');

// Middleware
require('./middleware/common')(app);

// Middleware
require('./cronjob/emailSummary');
require('./cronjob/confidential');

// API Routes
app.use('/api/v1', require('./routes'));

// Server
app.listen(port, () => {
  console.log(`Server is running at port ${port} :)`);
});
