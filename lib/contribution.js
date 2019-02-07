'use strict';

const bodyParser = require('body-parser');
const Contributor = require('./../models/contributor');

module.exports = (app) => {
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.post('/api/contribution', async (req, res) => {
		const donation = new Contributor({
			fullname: req.body.fullname,
			email: req.body.email,
			amount: req.body.amount,
			currency: req.body.currency,
			country: req.body.country,
			reference: req.body.reference,
			timestamp: new Date().getTime()
		});

		await donation.save().then(()=> res.status(200).json({"success" : true}))
										.catch( error => res.status(500).json({"success": false, "error": error.message}) );
	});
};
