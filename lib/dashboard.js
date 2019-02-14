'use strict';

const Contributor = require('./../models/contributor');
const CONSTANTS = require('./../constants');

module.exports = (app) => {
	app.get('/api/dashboard', (req, res) => {
		let days_left = CONSTANTS.days_left();
		days_left = days_left > 0 ? days_left : 0;
		let dashboard = {
			target_USD: CONSTANTS.FUNDING_TARGET,
			target_NGN: CONSTANTS.FUNDING_TARGET * CONSTANTS.CURRENCY_RATE,
			days_left: days_left
		};
		// get database connection;
		let res1 = Contributor.estimatedDocumentCount().exec((err, count)=> {
			if (err) {
			console.log(err)
			return
		}
		dashboard.backers = count;
	});

	// return total amount in NGN and USD
	let res2 = Contributor.aggregate([
		{$group : {_id: "$currency", total: {$sum: "$amount"}}}
	], (err, result) => {
		if (err) console.log(err);
		else {
			const amount = result;
			let donations = {};
			result.forEach(curr => {
				donations[curr._id] = curr.total/100;
			});
			dashboard.donations_USD = donations.USD + donations.NGN/CONSTANTS.CURRENCY_RATE;
			dashboard.donations_NGN = donations.NGN + donations.USD * CONSTANTS.CURRENCY_RATE
			//result.forEach(curr => console.log(`${curr._id} = ${curr.total/100}`));
			//console.log(dashboard);
			//res.status(200).json(dashboard);
		}
	});

	let allDone = Promise.all([res1, res2]);
	allDone.then(() => {
		//console.log(dashboard);
		res.status(200).json(dashboard);
	})

});
};
