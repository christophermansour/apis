"use strict";
var inherits = require('util').inherits;
var Handler = require('./core/handler');


var Impl = function (implFunc, isSync) {
	Handler.call(this);

	this.impl = implFunc;
	this.isSync = isSync;
};
inherits(Impl, Handler);

Impl.prototype.name = 'Impl';

Impl.prototype.setup = function (handlerContainer) {
	var found = false;
	var info = handlerContainer.info;
	if (info && info.core) {
		var ret = info.core.ret;
		if (ret) {
			found = true;
			ret.setImpl(this.impl, this.isSync);
		}
	}

	if (!found) {
		throw new Error('Impl requires Ret');
	}

	// don't include in chain
	return false;
};


Impl.impl = function (implFunc, isSync) {
	return new Impl(implFunc, isSync);
};

Impl.impls = function (implFunc) {
	return Impl.impl(implFunc, true);
};


module.exports = Impl;
