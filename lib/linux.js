'use strict';
const fs = require('fs');
const path = require('path');
const pify = require('pify');

const fsP = pify(fs);
const dir = '/sys/class/backlight';

const getBrightness = device => fsP.readFile(path.join(dir, device, 'brightness'), 'utf8');
const getMaxBrightness = device => fsP.readFile(path.join(dir, device, 'max_brightness'), 'utf8');
const setBrightness = (device, val) => fsP.writeFile(path.join(dir, device, 'brightness'), val);

const getBacklight = () => fsP.readdir(dir).then(dirs => {
	if (dirs.length === 0) {
		throw new Error('No backlight device found');
	}

	return dirs[0];
});

module.exports.get = () => {
	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	return getBacklight()
		.then(device => Promise.all([getMaxBrightness(device), getBrightness(device)]))
		.then(res => Number(res[1]) / Number(res[0]));
};

module.exports.set = val => {
	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	if (typeof val !== 'number' || val < 0 || val > 1) {
		return Promise.reject(new Error('Expected a number between 0 and 1'));
	}

	return getBacklight()
		.then(device => Promise.all([getMaxBrightness(device), device]))
		.then(res => {
			const max = Number(res[0]);
			const brightness = Math.floor(val * max).toString();

			return setBrightness(res[1], brightness);
		})
		.catch(err => {
			if (err.code === 'EACCES') {
				err.message = 'You don\'t seem to have permission to change the brightness. Try running this command with `sudo`.';
			}

			throw err;
		});
};
