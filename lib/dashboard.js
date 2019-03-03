'use strict';

const Contributor = require('./../models/contributor');
const CONSTANTS = require('./../constants');

module.exports = (app) => {
	app.get('/api/dashboard', async (req, res) => {
		console.log('Dashboard called');
		let days_left = CONSTANTS.days_left();
		days_left = days_left > 0 ? days_left : 0;
		let dashboard = {
			target_USD: CONSTANTS.FUNDING_TARGET,
			target_NGN: CONSTANTS.FUNDING_TARGET * CONSTANTS.CURRENCY_RATE,
			days_left: days_left
		};
		console.log('Before db connection');
		console.log(dashboard);
		// get database connection;
		await Contributor.estimatedDocumentCount().exec((err, count)=> {
			if (err) {
			console.log(err)
			return
		}
		dashboard.backers = count;
		console.log("backers =", dashboard.backers);
	});

	// return total amount in NGN and USD
	await Contributor.aggregate([
		{$group : {_id: "$currency", total: {$sum: "$amount"}}}
	], (err, result) => {
		if (err) console.log(err);
		else {
			const amount = result;
			let donations = {};
			result.forEach(curr => {
				console.log(`${curr._id} = ${curr.total}`);
				donations[curr._id] = curr.total/100;
			});
			dashboard.donations_USD = donations.USD + donations.NGN/CONSTANTS.CURRENCY_RATE;
			dashboard.donations_NGN = donations.NGN + donations.USD * CONSTANTS.CURRENCY_RATE;
			console.log("Donation NG =", dashboard.donations_NGN);
		}
	});

	//let counter = 0;
	let loaded = setInterval(() => {
		//console.log("counter", counter++);
		if (dashboard.backers && dashboard.donations_USD && dashboard.donations_NGN) {
			clearInterval(loaded);
			console.log(dashboard);
			res.status(200).json(dashboard);
		}
	}, 100);

});
};
