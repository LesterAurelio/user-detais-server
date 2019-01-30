
module.exports = Config;

function Config() {
	this.config = {};
}

Config.prototype.loadConfig = function (jsonStr) {
	try {
		this.config = JSON.parse(jsonStr);
	}
	catch (e) {
		this.config = {};
	}
}

Config.prototype.get = function (key, defaultVal) {
	try {
		if (this.config.hasOwnProperty(key)) {
			return this.config[key];
		}
	}
	catch (e) {
	}
	return defaultVal;
}

Config.prototype.serverPort = function () {
	return this.get("serverPort", 8081);
}

Config.prototype.mongoIP = function () {
	return this.get("mongoIP", "localhost");
}

Config.prototype.mongoDBName = function () {
	return this.get("mongoDBName", "MockDB_DEV");
}

Config.prototype.mongoDBUserName = function () {
	return this.get("mongoDBUserName", "");
}

Config.prototype.mongoDBPasswd = function () {
	return this.get("mongoDBPasswd", "");
}