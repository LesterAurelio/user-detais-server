var mongoClient = require('mongodb').MongoClient;

var NO_OF_COLLECTION = 1;

var Connection = function (_config) {
    this.db = null;
    this.config = _config;
    this.connectDB(function (res) {

    })
    return this;
}

module.exports = Connection;

Connection.prototype.connectDB = function (callback) {
    var self = this;

    function checkComplete(count, callback) {
        if (NO_OF_COLLECTION == count) {
            callback(true);
        }
    }

    var authString = "";
    if (this.config.mongoDBUserName() != "") {
        authString = encodeURIComponent(this.config.mongoDBUserName()) + ":" + encodeURIComponent(this.config.mongoDBPasswd()) + "@"
    }
    var url = "mongodb://" + authString + this.config.mongoIP() + ":27017/" + this.config.mongoDBName();

    mongoClient.connect(url, { useNewUrlParser: true }, function (err, database) {
        if (err) {
            callback(false);
        } else {
            self.db = database.db(self.config.mongoDBName());
            var count = 0;
            self.db.collection("userData", { strict: true }, function (err, collection) {
                if (err) {
                    self.db.createCollection("userData", function (err, res) {
                        if (!err) {

                        }
                        count++;
                        checkComplete(count, callback);
                    });
                    return
                }
                count++;
                checkComplete(count, callback);
            });
        }
    })
}

Connection.prototype.getUsers = function (callback) {
    var result = {
        status: false
    }
    this.db.collection('userData', { strict: true }, function (err, collection) {
        if (err) {
            if (callback) {
                callback(result);
            }
            return;
        }
        collection.find({}).toArray(function (err, users) {
            if (err) {
                callback(result);
                return;
            }
            result.status = true;
            result['users'] = users;
            callback(result);
        });
    });
}

Connection.prototype.getUserById = function (userId, callback) {
    var result = {
        status: false
    }
    this.db.collection('userData', { strict: true }, function (err, collection) {
        if (err) {
            if (callback) {
                callback(result);
            }
            return;
        }
        collection.findOne({ userId: userId }, { _id: 0 }, function (err, userData) {
            if (err) {
                callback(result);
                return;
            }
            result.status = true;
            result['details'] = userData;
            callback(result);
        });
    });
}

Connection.prototype.addUserDetails = function (userId, email, fname, lname, callback) {
    var result = {
        status: false
    }
    var obj = { userId: userId, email: email, fname: fname, lname: lname };
    this.db.collection('userData', { strict: true }, function (err, collection) {
        if (err) {
            if (callback) {
                callback(result);
            }
            return;
        }
        collection.insert(obj, function (err, res) {
            if (err) {
                callback(result);
                return;
            }
            result.status = true;
            result['userId'] = userId;
            callback(result);
        });
    });
}