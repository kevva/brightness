'use strict';

if (process.platform === 'darwin') {
	module.exports = require('osx-brightness');
} else if (process.platform === 'linux') {
	module.exports = require('xdg-brightness');
} else {
	module.exports = require('win-brightness');
}
