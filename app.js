//importing the required libraries and files
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var connectionController = require('./routes/connectionController.js');
var userController = require('./routes/UserController.js');

//set the view engine to use 'EJS template'
app.set('view engine', 'ejs');

//register the bodyParser middleware for processing forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//register the session with its secret id
app.use(session({ secret: 'nbaditis' }));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/explorers", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});

//Accessing the styles and images from the assets folder
app.use('/assets', express.static('assets'));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Successfully connected to database!');
  
//refer to the controller to navigate to specific page
app.use('/', userController);
app.use('/', connectionController);

//the app is listening to server on port 8080
app.listen(8080, function () {
  console.log('Server is listening...');
})

});
