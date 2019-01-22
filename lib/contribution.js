'use strict';

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

module.exports = (app) => {
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.post('/api/contribution', (req, res) => {
		console.log(req.body);
		console.log(`donation by ${req.body.fullname}`);
		res.status(200).json(req.body);
		if (!process.env.DB_URL) require('dotenv').config();
		mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

		const contributorSchema = new mongoose.Schema( {
			fullname: String,
			email: String,
			amount: Number,
			currency: String,
			country: String,
			reference: String,
			timestamp: {type: Date, default: Date.now }
		});

		/*const Contributor = mongoose.model('Contributor', contributorSchema);

		const donation = new Contributor({

		}); */

		//res.status(200).send('contribution listened');

	});
};
