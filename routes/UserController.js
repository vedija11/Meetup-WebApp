//importing the necessary libraries and files
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var ConnectionDB = require('../utility/connectionDB');
var connectDB = new ConnectionDB();
var UserProfileDB = require('../utility/UserProfileDB');
var UserProfile = new UserProfileDB();
var User = require('../utility/UserDB');
var addUser = require('../models/User');
var userDB = new User();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');

//route to signup page
router.get('/signup', function (req, res) {
  res.render('signup', { session: undefined, login: undefined, errors: undefined });
});

//route to signup page
router.post('/signup',
  [
    //validation for input fields of signup form
    check('fname').trim().isAlpha().withMessage('First name must only contain alphabets without spaces'),
    check('lname').trim().isAlpha().withMessage('Last name must only contain alphabets without spaces'),
    check('email').trim().isEmail().withMessage('Must be in a proper email format'),
    check('address').trim().matches(/^[#.0-9a-zA-Z\s,-]+$/).isLength({ min: 6 }).withMessage('Address must contain minimum 6 or more characters'),
    check('city').trim().isAlpha().withMessage('City must only contain alphabets'),
    check('zipcode').trim().isNumeric().withMessage('Zipcode must only contain digits')
      .isLength({ min: 3, max: 10 }).withMessage('Zipcode must contain mininum 3 and maximum 10 digits'),
    check('country').trim().matches(/^[a-zA-Z ]*$/).withMessage('Country must only contain alphabets').isLength({ min: 2 }).withMessage('Country must contain atleast 2 characters'),
    check('uid').trim().isAlphanumeric().withMessage('User Id must only contain alphabets and numbers'),
    check('pwd').trim().matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/).withMessage('Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters'),
  ],
  async function (req, res) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errArray = errors.array();
      return res.render('signup', { session: undefined, login: undefined, errors: errArray })
    }
    if (Object.keys(req.body).length != 0) {
      if (req.body.userSignUp) {

        //store all user inputs from signup form into variables
        var uid = req.body.uid;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        var address = req.body.address;
        var city = req.body.city;
        var zipcode = req.body.zipcode;
        var country = req.body.country;
        var pwd = req.body.pwd;

        const salt = await bcrypt.genSalt(10);
        console.log(pwd);
        pwd = await bcrypt.hash(pwd, salt);
        console.log("hashed password", pwd);

        //create model object and set values
        var userModel = new addUser();

        userModel.setUserId(uid);
        userModel.setFname(fname);
        userModel.setLname(lname);
        userModel.setEmail(email);
        userModel.setAddress(address);
        userModel.setCity(city);
        userModel.setZipcode(zipcode);
        userModel.setCountry(country);
        userModel.setPassword(pwd);

        //check if the new user already present in db
        var check = await userDB.checkUser(uid, email);
        if (check === "exists") {
          //if user exists then show error message of duplicate user
          req.session.login = 'Invalid';
          res.render('signup', { login: req.session.login, session: undefined, errors: errArray });
        } else {


          //add a new user to database if not already present
          await userDB.addNewUser(userModel);
          res.redirect('/login');
        }
      }
    } else {
      res.render('signup', { session: undefined, login: undefined, errors: undefined });
    }
  });

//route to login page
router.get('/login', function (req, res) {
  res.render('login', { session: undefined, login: undefined, errors: undefined });
});

//POST login information
router.post('/login',
  [
    //validation for input fields of login form
    check('username').trim().isAlphanumeric().withMessage('Username must only contain alphabets and numbers'),
    check('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 or more characters'),
  ],
  async function (req, res) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      var errArray = errors.array();
    }
    if (req.body.username && req.body.password) {
      //check if body contains username and password parameters
      var username = req.body.username;
      var pass = req.body.password;

      //get the user from db with entered username and password
      var user = await userDB.getUser(username);

      //check if user credentials are correct
      //if not, show an error message
      if (user === undefined || user.length === 0) {
        req.session.login = 'Invalid';
        res.render('login', { session: undefined, login: req.session.login, errors: errArray });
      } else {
        if(await bcrypt.compare(pass, user.password)){
        console.log('passsss', pass);
        //if user already present in database
        //successfully login
        req.session.userProfileSession = user;
        res.redirect('savedConnections');
      } else {
        req.session.login = 'Invalid';
        res.render('login', { session: undefined, login: req.session.login, errors: null });
      }
      }
    } else {
      res.render('login', { session: undefined, login: undefined, errors: null });
    }


  });

//route to logout
router.get('/logout', function (req, res) {
  //delete data from session
  req.session.destroy(function (err) {
    if (err) {
      res.negotiate(err);
    }
    res.redirect('/');
  });
});

//route to myEvents page
router.get('/myEvents', async function (req, res) {
  //check if user session is present
  if (req.session.userProfileSession != undefined) {

    //initialize a userProfile model and store it in session
    req.session.userEventsSession = await connectDB.getUserCreatedEvents(req.session.userProfileSession.userId);

    //store userEventsSession and username in session
    var userEventsList = req.session.userEventsSession;
    //var session = req.session.userProfileSession;
    console.log('userEventsList', userEventsList);

    res.render('myEvents', { userEventsList: userEventsList, session: req.session.userProfileSession });
  } else {
    //if currently no user present then redirect to login
    res.redirect('/login');
  }
});


//route to myEvents page
router.post('/myEvents', async function (req, res) {
  var activeUserSession = req.session.userProfileSession;
  var action = req.query.action;
  var connId = req.query.connectionId;
  //save a new connection and add/update RSVP to UserProfile
  if (action == 'edit') {
    await connectDB.getConnection(connId);
  }
});


//route to savedConnections page
router.get('/savedConnections', async function (req, res) {
  //check if user session is present
  if (req.session.userProfileSession != undefined) {

    //initialize a userProfile model and store it in session
    req.session.userProfileListSession = await UserProfile.getUserProfile(req.session.userProfileSession.userId);

    //store userConnectionsList and username in session
    var userConnectionsList = req.session.userProfileListSession;
    var session = req.session.userProfileSession;

    res.render('savedConnections', { userConnectionsList: userConnectionsList, session: session });
  } else {
    //if currently no user present then redirect to login
    res.redirect('/login');
  }
});

router.post('/savedConnections', urlencodedParser, async function (req, res) {

  var activeUserSession = req.session.userProfileSession;

  //indicates 'save', 'update' or 'delete' a connection
  var action = req.query.action;

  //get current connectionId
  var connId = req.query.connectionId;

  //stores 'Yes', 'No' or 'Maybe'
  var connResponse = req.body.response;

  //save a new connection and add/update RSVP to UserProfile
  if (action == 'save') {
    await UserProfile.updateRSVP(activeUserSession.userId, await connectDB.getConnection(connId), connResponse);

  } else if (action == 'delete') {
    //delete a user's RSVP to a connection from UserProfile
    await UserProfile.removeConnection(await connectDB.getConnection(connId));
  }

  var userProfileObj = await UserProfile.getUserProfile(activeUserSession.userId);

  req.session.userProfileListSession = userProfileObj;

  //render the savedConnections page with dynamic list and session data
  res.render('savedConnections', { userConnectionsList: req.session.userProfileListSession, session: activeUserSession });
});

module.exports = router;
