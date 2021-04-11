var User = require("../models/User.js");
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userId: { type: String, default: "U00", required: true },
  fname: { type: String, default: "Vedija", required: true },
  lname: { type: String, default: "Jagtap", required: true },
  email: { type: String, default: "vjagtap@uncc.edu", required: true },
  address: { type: String, default: "University Terrace Drive", required: true },
  city: { type: String, default: "Charlotte", required: true },
  zipcode: { type: Number, default: 28262, required: true },
  country: { type: String, default: "United States", required: true },
  password: { type: String }
});

var userData = mongoose.model('User', userSchema);

class UserDB {
  //fetch the user with given userid and password
  getUser(userId) {
    return new Promise((resolve, reject) => {
      userData
        .find({
          $and: [{ userId: userId }],
        })
        .then((data) => {
          if (data.length !== 0) {
            var userObj = new User();

            userObj.setUserId(data[0].userId);
            userObj.setFname(data[0].fname);
            userObj.setLname(data[0].lname);
            userObj.setEmail(data[0].email);
            userObj.setAddress(data[0].address);
            userObj.setCity(data[0].city);
            userObj.setZipcode(data[0].zipcode);
            userObj.setCountry(data[0].country);
            userObj.setPassword(data[0].password);

            //resolve with array of data object
            resolve(userObj);
          } else {
            resolve();
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } //end getUser

  // adding a new User
  addNewUser(user) {
    return new Promise((resolve, reject) => {
      var newUser = new userData({
        userId: user.getUserId(),
        fname: user.getFname(),
        lname: user.getLname(),
        email: user.getEmail(),
        address: user.getAddress(),
        city: user.getCity(),
        zipcode: user.getZipcode(),
        country: user.getCountry(),
        password: user.getPassword()
      });

      newUser.save(function (err, data) {
        console.log("user added.");
        console.log(data);
        if (data) resolve(data);
        else return reject(err);
      });
    });
  } //end addNewUser

  //verify if user already exists
  checkUser(uid, email) {
    return new Promise((resolve, reject) => {
      userData
        .find({
          $or: [{ userId: uid }, { email: email }],
        })
        .then((data) => {
          if (data.length !== 0) {
            resolve("exists");
          } else {
            resolve();
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } //end checkUser


}

module.exports = UserDB;
