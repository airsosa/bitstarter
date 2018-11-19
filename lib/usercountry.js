'use strict';

const rp = require('request-promise-native');

module.exports = (app) => {
	app.get('/api/usercountry', async (req, res) => {
		const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
		if (!process.env.IPSTACK_ACCESS_KEY) require('dotenv').config();
		const options = {
			uri: `http://api.ipstack.com/${ip}`,
			qs : {
				access_key: process.env.IPSTACK_ACCESS_KEY
			},
			json: true
		};

		try {
			const ipGeo = await rp.get(options);
			res.status(200).json(ipGeo);
		} catch(err) {
			res.status(err.statusCode || 502).json(null);
		}

		
	});
};