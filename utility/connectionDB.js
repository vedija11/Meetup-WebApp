var Connection = require("../models/Connection.js");
var mongoose = require('mongoose');

var connectionSchema = new mongoose.Schema({
  connectionId: { type: Number, required: true, default: 000 },
  connectionName: { type: String, required: true, default: "Outdoor Adventures" },
  connectionTopic: { type: String, required: true, default: "Charlotte Hiking Club" },
  connectionDetails: { type: String, required: true, default: "Details about event" },
  connectionTime: { type: String, required: true, default: "5:30 pm" },
  connectionDate: { type: String, required: true, default: "01-30-2020" },
  connectionPlace: { type: String, required: true, default: "Charlotte" },
  hostedBy: { type: String, required: true, default: "Vedija" },
  imageURL: { type: String, required: true, default: "../assets/images/hiking.png" },
  going: { type: Number, required: true, default: 1 },
  userId: { type: String, required: true, default: "testuser1"}
});

var connData = mongoose.model('Connection', connectionSchema);

class ConnectionDB {
  // update document or add new if no match
  addConnection(conn) {
    return new Promise((resolve, reject) => {
      connData
        .findOneAndUpdate(
          {
            $and: [
              { connectionId: conn.getconnectionId() },
              { connectionName: conn.getname() },
              { connectionTopic: conn.gettopic() },
              { connectionDetails: conn.getdetails() },
              { hostedBy: conn.gethostedBy() },
              { imageURL: conn.getimageURL() },
              { going: conn.getgoing() }
            ],
          },
          {
            $set: {
              connectionTime: conn.gettime(),
              connectionDate: conn.getdate(),
              connectionPlace: conn.getplace(),
              userId: conn.getuserId()
            }
          },
          { new: true, upsert: true },
          function (err, data) {
            console.log("connection either updated or added.");
            console.log(data);
            resolve(data);
          }
        )
        .catch((err) => {
          return reject(err);
        });
    });
  } //end addConnection

  //fetch all connections from database
  getConnections() {
    return new Promise((resolve, reject) => {
      connData
        .find({})
        .then((data) => {
          console.log("fetched all connections from db");

          var connections = [];
          data.forEach((conn) => {
            var connObj = new Connection();

            connObj.setconnectionId(conn.connectionId);
            connObj.setname(conn.connectionName);
            connObj.settopic(conn.connectionTopic);
            connObj.setdetails(conn.connectionDetails);
            connObj.settime(conn.connectionTime);
            connObj.setdate(conn.connectionDate);
            connObj.setplace(conn.connectionPlace);
            connObj.sethostedBy(conn.hostedBy);
            connObj.setimageURL(conn.imageURL);
            connObj.setgoing(conn.going);
            connObj.setuserId(conn.userId);

            connections.push(connObj);
          });

          //resolve with array of data object
          resolve(connections);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } //end getConnections

  //fetch a particular connection with a given connectionId
  getConnection(connectionId) {
    return new Promise((resolve, reject) => {
      connData
        .find({
          $or: [{ connectionId: connectionId }],
        })
        .then((data) => {
          if(data.length != 0){
            var connObj = new Connection();

            connObj.setconnectionId(data[0].connectionId);
            connObj.setname(data[0].connectionName);
            connObj.settopic(data[0].connectionTopic);
            connObj.setdetails(data[0].connectionDetails);
            connObj.settime(data[0].connectionTime);
            connObj.setdate(data[0].connectionDate);
            connObj.setplace(data[0].connectionPlace);
            connObj.sethostedBy(data[0].hostedBy);
            connObj.setimageURL(data[0].imageURL);
            connObj.setgoing(data[0].going);

            //resolve with array of data object
            resolve(connObj);
          } else {
            resolve();
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } // end getConnection

  getUserCreatedEvents(userId){
      return new Promise((resolve, reject) => {
        connData
          .find({
            $or: [{ userId: userId }],
          })
          .then((data) => {
            var events = [];
            if(data.length != 0){
              var connObj = new Connection();

              connObj.setconnectionId(data[0].connectionId);
              connObj.setname(data[0].connectionName);
              connObj.settopic(data[0].connectionTopic);
              connObj.setdetails(data[0].connectionDetails);
              connObj.settime(data[0].connectionTime);
              connObj.setdate(data[0].connectionDate);
              connObj.setplace(data[0].connectionPlace);
              connObj.sethostedBy(data[0].hostedBy);
              connObj.setimageURL(data[0].imageURL);
              connObj.setgoing(data[0].going);
              connObj.setuserId(data[0].userId);

              events.push(connObj);
              //resolve with array of data object
              resolve(events);
            } else {
              resolve();
            }
          })
          .catch((err) => {
            return reject(err);
          });
      });
    } // end getUserCreatedEvents

}

module.exports = ConnectionDB;
