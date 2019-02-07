'use strict';

const Contributor = require('./../models/contributor');
const CONSTANTS = require('./../constants');

module.exports = (app) => {
	app.get('/api/dashboard', async (req, res) => {
		let dashboard = {
			target_usd: CONSTANTS.FUNDING_TARGET,
			target_ngn: CONSTANTS.FUNDING_TARGET * CONSTANTS.CURRENCY_RATE,
			days_left: CONSTANTS.days_left()
		};
		// get database connection;
		await Contributor.estimatedDocumentCount().exec((err, count)=> {
			if (err) {
			console.log(err)
			return
		}
		dashboard.backers = count;
		console.log(count);
		res.status(200).json({"backers" : count});
	});

	// return total amount in NGN and USD
	await Contributor.aggregate([
		{$group : {_id: "$currency", total: {$sum: "$amount"}}}
	], (err, result) => {
		if (err) console.log(err);
		else {
			const amount = result;
			result.forEach(curr => console.log(`${curr._id} = ${curr.total/100}`));
			//console.log(amount);
		}
	});
	console.log(dashboard);
});
};
