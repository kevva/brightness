var xbacklight = require('xbacklight');
var Promise = require('pinkie-promise');

function get() {
	return new Promise(function (resolve, reject) {
		xbacklight.get()
		.then(function (val) {
			resolve(val / 100);
		})
		.catch(function (err) {
			reject(err);
		});
	});
}

function set(val) {
	return xbacklight.set(val * 100);
}

module.exports = {
	isInstalledSync: xbacklight.isInstalledSync,
	get: get,
	set: set
};
