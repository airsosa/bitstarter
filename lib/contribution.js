'use strict';

const bodyParser = require('body-parser');
const Contributor = require('./../models/contributor');

module.exports = (app) => {
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.post('/api/contribution', async (req, res) => {
		//console.log(req.body);
		//console.log(`donation by ${req.body.fullname}`);
		res.status(200).json(req.body);


		const donation = new Contributor({
			fullname: req.body.fullname,
			email: req.body.email,
			amount: req.body.amount,
			currency: req.body.currency,
			country: req.body.country,
			reference: req.body.reference,
			timestamp: req.body.timestamp
		});

		await donation.save().then(()=> console.log(`Donation with Ref: ${req.body.reference} saved`))
										.catch( error => console.log(error.message) );

		//res.status(200).send('contribution listened');

	});
};
