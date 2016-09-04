'use strict';
const nircmd = require('nircmd');
const WmiClient = require('wmi-client');

module.exports.get = () => {
	if (process.platform !== 'win32') {
		return Promise.reject(new Error('Only Windows systems are supported'));
	}

	const query = 'SELECT CurrentBrightness,InstanceName FROM WmiMonitorBrightness';
	const wmi = new WmiClient({
		host: 'localhost',
		namespace: '\\\\root\\WMI'
	});

	return new Promise((resolve, reject) => {
		wmi.query(query, (err, res) => {
			if (err) {
				reject(err);
				return;
			}

			if (res.length === 0) {
				reject(new Error('Unable to find any monitors to read brightness levels from'));
				return;
			}

			resolve(res[0].CurrentBrightness / 100);
		});
	});
};

module.exports.set = val => {
	if (process.platform !== 'win32') {
		return Promise.reject(new Error('Only Windows systems are supported'));
	}

	if (typeof val !== 'number' || val < 0 || val > 1) {
		return Promise.reject(new Error('Expected a number between 0 and 1'));
	}

	return nircmd(['setbrightness', Math.round(val * 100)]);
};
