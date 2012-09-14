"use strict";
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

var Transport = function() {
	EventEmitter.call(this);

	this.headersSeparator = '\n\n'; // something we don't expect in JSON
};
inherits(Transport, EventEmitter);

Transport.prototype.decode = function(message) {
	var sepPos = message.indexOf(this.headersSeparator);
	var headersStr = message.substring(0, sepPos);
	var body = message.substring(sepPos + this.headersSeparator.length);

	var headers = JSON.parse(headersStr);

	return {
		headers: headers,
		body: body
	};
};

Transport.prototype.encode = function(headers, data) {
	var body;

	if (data === undefined) {
		body = '';
	}
	else {
		// to default content type
		body = JSON.stringify(data);
	}

	return [
		JSON.stringify(headers),
		body
	].join(this.headersSeparator);
};

Transport.prototype.sendSingleMessage = function (connection, message) {
	connection.write(message);
	this.emit('message_sent', connection, message);
};

Transport.prototype.send = function(recipientConnections, data, opt_connectionsToExclude) {
	if (recipientConnections == null || recipientConnections.length === 0) {
		return;
	}

	var message = this.encode({}, data);

	for (var k in recipientConnections) {
		if (!opt_connectionsToExclude || !(k in opt_connectionsToExclude)) {
			var connection = recipientConnections[k];
			this.sendSingleMessage(connection, message);
		}
	}
};

Transport.prototype.sendResult = function(req, res, result) {
	var headers = res.headers;
	headers.status = res.statusCode;
	// NOTE must not set content-type if 204

	var requestId = req.headers.requestId;
	if (requestId != null) {
		headers.requestId = requestId;
	}

	var message = this.encode(headers, result);
	this.sendSingleMessage(req.connection, message);
};


module.exports = Transport;