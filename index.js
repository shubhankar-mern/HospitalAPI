const express = require('express');
const port = 8000;
const app = express();
const Router = require('./routes/index');
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
var cors = require('cors');
//for fetching data from url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors());

//use of express router
app.use('/', Router);

app.listen(port, function (err) {
  if (err) {
    console.log('Error in server ', err);
  } else {
    console.log(`Server is running at ${port}`);
  }
});
