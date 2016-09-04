'use strict';
const fs = require('fs');
const path = require('path');
const pify = require('pify');

const fsP = pify(fs);

module.exports.get = () => {
	const dir = '/sys/class/backlight';

	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	return fsP.readdir(dir).then(dirs => {
		if (dirs.length === 0) {
			throw new Error('No backlight device found');
		}

		return fsP.readFile(path.join(dir, dirs[0], 'max_brightness'), 'utf8').then(max => {
			return fsP.readFile(path.join(dir, dirs[0], 'brightness'), 'utf8').then(data => {
				return parseInt(data, 10) / parseInt(max, 10);
			});
		});
	});
};

module.exports.set = val => {
	const dir = '/sys/class/backlight';

	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	if (typeof val !== 'number' || val < 0 || val > 1) {
		return Promise.reject(new Error('Expected a number between 0 and 1'));
	}

	return fsP.readdir(dir).then(dirs => {
		if (dirs.length === 0) {
			throw new Error('No backlight device found');
		}

		return fsP.readFile(path.join(dir, dirs[0], 'max_brightness'), 'utf8').then(data => {
			const max = parseInt(data, 10);
			const brightness = Math.floor(val * max).toString();

			return fsP.writeFile(path.join(dir, dirs[0], 'brightness'), brightness).catch(err => {
				if (err.code === 'EACCES') {
					err.message = 'You don\'t seem to have permission to change the brightness. Try running this command with sudo.';
				}

				throw err;
			});
		});
	});
};
