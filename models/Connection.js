//javascript object created with specific properties defined
class Connection {
    constructor() {
    }

    //function which returns list of connection details
    connection(data) {
        return {
            connectionId: data.connectionId,
            connectionName: data.connectionName,
            connectionTopic: data.connectionTopic,
            connectionDetails: data.connectionDetails,
            connectionTime: data.connectionTime,
            connectionDate: data.connectionDate,
            connectionPlace: data.connectionPlace,
            hostedBy: data.hostedBy,
            imageURL: data.imageURL,
            going: data.going,
            userId: data.userId
        };
    }

    //getters and setters for connection properties
    setconnectionId(connectionId) {
        this.connectionId = connectionId;
    };

    getconnectionId() {
        return this.connectionId;
    };

    setname(name) {
        this.connectionName = name;
    };

    getname() {
        return this.connectionName;
    };

    settopic(topic) {
        this.connectionTopic = topic;
    };

    gettopic() {
        return this.connectionTopic;
    };

    setdetails(details) {
        this.connectionDetails = details;
    };

    getdetails() {
        return this.connectionDetails;
    };

    settime(time) {
        this.connectionTime = time;
    };

    gettime() {
        return this.connectionTime;
    };

    setdate(date) {
        this.connectionDate = date;
    };

    getdate() {
        return this.connectionDate;
    };

    setplace(place) {
        this.connectionPlace = place;
    };

    getplace() {
        return this.connectionPlace;
    };

    sethostedBy(hostedBy) {
        this.hostedBy = hostedBy;
    };

    gethostedBy() {
        return this.hostedBy;
    };

    setimageURL(imageURL) {
        this.imageURL = imageURL;
    };

    getimageURL() {
        return this.imageURL;
    };

    setgoing(going) {
        this.going = going;
    };

    getgoing() {
        return this.going;
    };

        setuserId(userId) {
            this.userId = userId;
        };

        getuserId() {
            return this.userId;
        };
}

module.exports = Connection;
