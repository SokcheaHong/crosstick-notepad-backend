const moment = require('moment');

const self = {
	error(e, caller = null, ...extra) {
		console.log('\x1b[31m<======');
		let output = `\x1b[31m[${moment(new Date()).format()}]`;
		if (caller && caller.name) {
			output = `${output} [Function ${caller.name}]`;
		}
		console.log(output, e);
		if (extra) {
			for (const arg of extra) {
				console.log(`\x1b[31mExtra: ${arg}`);
			}
		}
		console.log('\x1b[31m======>');
	},
};

module.exports = self;
