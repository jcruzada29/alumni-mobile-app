const _ = require('lodash');

const fileHelper = {
	getExtension(fileName) {
		if (!fileName || !_.isString(fileName)) {
			return '';
		}
		const arr = fileName.split('.');
		if (arr.length === 1) {
			return '';
		}
		return arr[arr.length - 1];
	}
};

module.exports = fileHelper;
