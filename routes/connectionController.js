//importing the necessary libraries and files
var express = require('express');
var router = express.Router();
var Connection = require('../models/Connection');
var ConnectionDB = require('../utility/connectionDB');
var connectDB = new ConnectionDB();
var UserProfileDB = require('../utility/UserProfileDB');
var UserProfile = new UserProfileDB();
const { check, validationResult } = require('express-validator');

//function to check the connectionId present in the URL is valid
async function IdValidation(req, res, connId) {
  var connId = (/^[0-9]+$/).test(req.query.connectionId);
  if (connId) {
    var connData = await connectDB.getConnection(req.query.connectionId);
    //check if the connData with specific id is valid
    //render the correct file based on the conditions below
    if (connData !== undefined) {
      res.render('connection', { data: connData, session: req.session.userProfileSession });
    } else {
      res.redirect('/connections');
    }
  } else {
    res.redirect('/connections');
  }
};

//route to home page
router.get('/', function (req, res) {
  res.render('index', { session: req.session.userProfileSession });
});

//route to home/index page
router.get('/index', function (req, res) {
  res.render('index', { session: req.session.userProfileSession });
});

//route to newConnection page on GET
router.get('/newconnection', function (req, res) {
  //check if session is present
  if (req.session.userProfileSession) {
    res.render('newConnection', { session: req.session.userProfileSession, errors: undefined });
  } else {
    //if currently no user present then redirect to login
    res.redirect('/login');
  }
});

//route to newConnection page on POST
router.post('/newconnection',
  [
    //validation for input fields of newConnection form
    check('topic').trim().matches(/^[a-zA-Z ]*$/).withMessage('Topic must only contain alphabets')
      .isLength({ min: 3 }).withMessage('Topic must contain a minimum of 3 characters'),
    check('name').trim().matches(/^[a-zA-Z ]*$/).withMessage('Name must only contain alphabets'),
    check('details').trim().isLength({ min: 3}).withMessage('Details must contain minimum of 3 characters'),
    check('where').trim().matches(/^[a-zA-Z\s,]*$/).withMessage('Place must contain alphabets with allowed spaces'),
    check('when').trim().matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))T(([01][0-9])|(2[0-3])):[0-5][0-9]/).withMessage('Enter a valid Date and Time ')
      .custom((value, { req }) => {
        //function to check the current date
        //allow dates which are in future
        var currentDateTime = new Date().toJSON().split('T')[0];
        var inputValue = req.body.when;
        var outputValue = inputValue.split('T')[0];
        if (outputValue <= currentDateTime) {
          throw new Error("Date should be after today's date");
        }
        return true;
      })
  ],
  async function (req, res) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //store all errors from validation in an array
      var errArray = errors.array()
      return res.render('newConnection', { session: req.session.userProfileSession, errors: errArray })
    }

    //add new connection function
    if (Object.keys(req.body).length != 0) {
      if (req.body.addConn) {
        //store all inputs from form into variables
        var id = Math.floor(Math.random() * 93) + 107;
        var name = req.body.name;
        var topic = req.body.topic;
        var details = req.body.details;
        var time = new Date(req.body.when).toLocaleTimeString().replace(/:\d{2}\s/, ' ');
        var date = (req.body.when).split('T')[0];
        var place = req.body.where;
        var host = req.session.userProfileSession.fname;
        var imageUrl = '../assets/images/default.jpg';
        var going = 1;
        var user = req.session.userProfileSession.userId;

        //create model object and set values
        var connModel = new Connection();

        connModel.setconnectionId(id);
        connModel.setname(name);
        connModel.settopic(topic);
        connModel.setdetails(details);
        connModel.settime(time);
        connModel.setdate(date);
        connModel.setplace(place);
        connModel.sethostedBy(host);
        connModel.setimageURL(imageUrl);
        connModel.setgoing(going);
        connModel.setuserId(user);

        //add a new connection to connections page
        var newConn = await connectDB.addConnection(connModel);

        //add newly created connection to savedConnections page of the user
        await UserProfile.updateRSVP(req.session.userProfileSession.userId, newConn, "Yes");
        res.redirect('/savedConnections');
      }
    } else {
      res.render('connections', { session: req.session.userProfileSession });
    }
  });

//route to about page
router.get('/about', function (req, res) {
  res.render('about', { session: req.session.userProfileSession });
});

//route to contact page
router.get('/contact', function (req, res) {
  res.render('contact', { session: req.session.userProfileSession });
});

//route to connections page
router.get('/connections', async function (req, res) {
  var connNames = {}
  var connectionInfo = await connectDB.getConnections();

  //collect the data based on connectionName and its respective list of topics
  connectionInfo.forEach(function (conn) {
    if (conn.connectionName in connNames) {
      connNames[conn.connectionName].push([conn.connectionTopic, conn.connectionId, conn.imageURL]);
    } else {
      connNames[conn.connectionName] = [[conn.connectionTopic, conn.connectionId, conn.imageURL]];
    }
  });
  console.log('connNames', connNames);
  res.render('connections', { data: connNames, session: req.session.userProfileSession });
});

//route to connection(event details) page
router.get('/connection', function (req, res) {
  IdValidation(req, res, req.query.connectionId);
});

//POST route information for connection page
router.post('/connection', function (req, res) {
  IdValidation(req, res, req.query.connectionId);
});

//if none of the above path exists then route to home page
router.get('/*', function (req, res) {
  res.render('error', { session: req.session.userProfileSession });
});

module.exports = router;
