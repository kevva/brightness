'use strict';
var nircmd = require('nircmd');
var toPercent = require('to-percent');

if (process.platform === 'darwin') {
	module.exports = require('osx-brightness');
} else if (process.platform === 'linux') {
	module.exports = require('xdg-brightness');
} else {
	module.exports.set = function (val, cb) {
		if (typeof val !== 'number' || val < 0 || val > 1) {
			throw new Error('Expected a number between 0 and 1');
		}

		nircmd(['setbrightness', toPercent(val)], function (err) {
			if (err) {
				cb(err);
				return;
			}

			cb();
		});
	};

	module.exports.get = function () {
		throw new Error('Getting brightness is only supported on OS X and Linux systems');
	};
}
