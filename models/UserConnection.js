//class userConnection which stores connection and rsvp information about a user
class UserConnection {
  constructor(connection, rsvp) {
    this.connection = connection;
    this.rsvp = rsvp;
  }

  //getters and setters for userConnection properties
  getConnection() {
    return this.connection;
  }

  setConnection(connection) {
    this.connection = connection;
  }

  getRsvp() {
    return this.rsvp;
  }

  setRsvp(rsvp) {
    this.rsvp = rsvp;
  }
}

module.exports = UserConnection;
