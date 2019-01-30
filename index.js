var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');
var auth = require('basic-auth');


var Connection = require('./connection');
var Config = require('./serverconfig');

var app = express();
var connection = null;

var config = new Config();

app.use(bodyParser.json());
app.use(cors());

//Server
fs.readFile('config.txt', 'utf8', function (err, contents) {
	if (!err) {
		config.loadConfig(contents);
	}

	var server = app.listen(config.serverPort(), function () {
		var host = server.address().address;
		var port = server.address().port;
		connection = new Connection(config);
		console.log("API Base url http://" + host + ":" + port);

	});
});

//******************** API'S *****************************//


app.get('/getUsers', function (req, res) {
	isAuthorization(req, function (valid) {
		if (!valid) {
			notAuthorized(res);
			return;
		}
		connection.getUsers(function (result) {
			sendResponse(res, result);
		});
	})

});
app.get('/getUserById/:id', (req, res) => {
	isAuthorization(req, function (valid) {
		if (!valid) {
			notAuthorized(res);
			return;
		}
		connection.getUserById(req.params.id, function (result) {
			sendResponse(res, result);
		})
	})
});

app.post('/addUserDetails', (req, res) => {
	console.log('addUserDetails')
	isAuthorization(req, function (valid) {
		console.log('addUserDetails', valid)
		if (!valid) {
			notAuthorized(res);
			return;
		}
		validateUserDetails(req.body, function (result1) {
			console.log('addUserDetails', result1)
			if (!result1.status) {
				sendResponse(res, result1);
				return;
			}
			connection.addUserDetails(alphanumeric_unique(), req.body.email, req.body.firstName, req.body.lastName, function (result2) {
				console.log('addUserDetails', result2)
				sendResponse(res, result2);
			})
		})
	});

});


//******************** Functions *****************************//

function alphanumeric_unique() {
	return Math.random().toString(36).split('').filter(function (value, index, self) {
		return self.indexOf(value) === index;
	}).join('').substr(2, 8);
}

function sendResponse(res, result) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(result));
}

function validateUserDetails(obj, callback) {
	var result = {
		status: false
	}
	if (!obj.hasOwnProperty('email')) {
		result['message'] = "Missing Feild Email ";
		callback(result);
		return;
	}
	if (!obj.hasOwnProperty('firstName')) {
		result['message'] = "Missing Feild firstName ";
		callback(result);

		return;
	}
	if (!obj.hasOwnProperty('lastName')) {
		result['message'] = "Missing Feild lastName ";
		callback(result);
		return;
	}
	result.status = true;
	callback(result)
}


//  basic auth
function isAuthorization(req, callback) {
	var credentials = auth(req);
	if (!credentials) {
		callback(false);
		return;
	}
	if (credentials.name = "admin" && credentials.pass == "admin") {
		callback(true);
	} else {
		callback(false);
	}
}

function notAuthorized(res) {
	res.statusCode = 403;
	res.setHeader('WWW-Authenticate', 'Basic realm="Provide your credentials"');
	res.end('Access denied');
}