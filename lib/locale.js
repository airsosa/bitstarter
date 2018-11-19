'use strict';

const fs = require('fs');

module.exports = (app) => {
	app.get('/api/locale', (req, res) => {
		fs.readFile('./models/locale.json', 'utf8', (err, data) => {
			if (err)
				res.status(err.statusCode || 502).json(err);
			else
				res.status(200).json(JSON.parse(data));
		});
			
	});
};