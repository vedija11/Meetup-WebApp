var UserConnection = require("../models/UserConnection");

var mongoose = require('mongoose');

var Conn = new mongoose.Schema({
  connectionId: { type: Number, required: true },
  connectionName: { type: String, required: true },
  connectionTopic: { type: String, required: true },
});

var UserConnectionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  connection: Conn,
  rsvp: { type: String, default: "Yes", required: true }
});

var userConnData = mongoose.model('UserConnection', UserConnectionSchema);

class UserProfileDB {

  getUserProfile(userId) {
    return new Promise((resolve, reject) => {
      userConnData
        .find({
          $or: [{ userId: userId }],
        })
        .then((data) => {
          var userConnList = [];
          data.forEach((item) => {
            var userConnObj = new UserConnection();

            userConnObj.setConnection(item.connection);
            userConnObj.setRsvp(item.rsvp);

            userConnList.push(userConnObj);
          })
          //resolve with array of data object
          resolve(userConnList);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } //end getUserProfile

  // update docment or add new if no match
  updateRSVP(userId, conn, rsvp) {
    return new Promise((resolve, reject) => {
      userConnData
        .findOneAndUpdate(
          {
            $and: [
              { userId: userId },
              { "connection.connectionId": conn.connectionId },
            ],
          },
          {
            $set: {
              userId: userId,
              connection: conn,
              rsvp: rsvp
            }
          },
          { new: true, upsert: true },
          function (err, data) {
            console.log("RSVP either updated or added.");
            console.log(data);
            resolve(data);
          }
        )
        .catch((err) => {
          return reject(err);
        });
    });
  } //end updateRSVP

  //delete a connection from savedConnections page
  removeConnection(conn) {
    return new Promise((resolve, reject) => {
      userConnData
        .deleteOne({
          "connection.connectionId": conn.connectionId
        })
        .then(function () {
          resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

}

module.exports = UserProfileDB;
