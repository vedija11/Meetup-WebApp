//User class with its associated properties
class User {
  constructor(userId, fname, lname, email, address, city, zipcode, country, password) {
    this.userId = userId;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.address = address;
    this.city = city;
    this.zipcode = zipcode;
    this.country = country;
    this.password = password;
  }

  //getters and setters for the User properties
  getUserId() {
    return this.userId;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  getFname() {
    return this.fname;
  }

  setFname(fname) {
    this.fname = fname;
  }

  getLname() {
    return this.lname;
  }

  setLname(lname) {
    this.lname = lname;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    this.email = email;
  }

  getAddress() {
    return this.address;
  }

  setAddress(address) {
    this.address = address;
  }

  getCity() {
    return this.city;
  }

  setCity(city) {
    this.city = city;
  }

  getZipcode() {
    return this.zipcode;
  }

  setZipcode(zipcode) {
    this.zipcode = zipcode;
  }

  getCountry() {
    return this.country;
  }

  setCountry(country) {
    this.country = country;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password) {
    this.password = password;
  }
}

module.exports = User;
