'use strict';
var fs = require('fs');
var path = require('path');
var pify = require('pify');
var Promise = require('pinkie-promise');
var fsP = pify(fs, Promise);

module.exports.get = function () {
	var dir = '/sys/class/backlight';

	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	return fsP.readdir(dir).then(function (dirs) {
		if (!dirs.length) {
			throw new Error('No backlight device found');
		}

		return fsP.readFile(path.join(dir, dirs[0], 'max_brightness'), 'utf8').then(function (max) {
			return fsP.readFile(path.join(dir, dirs[0], 'brightness'), 'utf8').then(function (data) {
				return parseInt(data, 10) / parseInt(max, 10);
			});
		});
	});
};

module.exports.set = function (val) {
	var dir = '/sys/class/backlight';

	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	if (typeof val !== 'number' || val < 0 || val > 1) {
		return Promise.reject(new Error('Expected a number between 0 and 1'));
	}

	return fsP.readdir(dir).then(function (dirs) {
		if (!dirs.length) {
			throw new Error('No backlight device found');
		}

		return fsP.readFile(path.join(dir, dirs[0], 'max_brightness'), 'utf8').then(function (data) {
			var max = parseInt(data, 10);
			var brightness = Math.floor(val * max).toString();

			return fsP.writeFile(path.join(dir, dirs[0], 'brightness'), brightness).catch(function (err) {
				if (err.code === 'EACCES') {
					err.message = 'You don\'t seem to have permission to change the brightness. Try running this command with sudo.';
				}

				throw err;
			});
		});
	});
};
