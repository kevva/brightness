'use strict';
var nircmd = require('nircmd');
var Promise = require('pinkie-promise');
var WmiClient = require('wmi-client');

module.exports.get = function () {
	if (process.platform !== 'win32') {
		return Promise.reject(new Error('Only Windows systems are supported'));
	}

	var query = 'SELECT CurrentBrightness,InstanceName FROM WmiMonitorBrightness';
	var wmi = new WmiClient({
		host: 'localhost',
		namespace: '\\\\root\\WMI'
	});

	return new Promise(function (resolve, reject) {
		wmi.query(query, function (err, res) {
			if (err) {
				reject(err);
				return;
			}

			if (!res.length) {
				reject(new Error('Unable to find any monitors to read brightness levels from'));
				return;
			}

			resolve(res[0].CurrentBrightness / 100);
		});
	});
};

module.exports.set = function (val) {
	if (process.platform !== 'win32') {
		return Promise.reject(new Error('Only Windows systems are supported'));
	}

	if (typeof val !== 'number' || val < 0 || val > 1) {
		return Promise.reject(new Error('Expected a number between 0 and 1'));
	}

	return nircmd(['setbrightness', Math.round(val * 100)]);
};
