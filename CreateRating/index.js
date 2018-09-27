const rp = require('request-promise-native');
const uuid = require('uuid/v4');
const mongoClient = require("mongodb").MongoClient;

module.exports = async function (context, req) {
	context.log('JavaScript HTTP trigger function processed a request.');

	let rating = Number(req.query.rating);
	if ((!rating && rating !== 0) || rating < 0 || rating > 5) {
		context.res = {
			status: 400,
			body: "missing or invalid rating"
		};
		return;
	}

	if (req.query.userId && req.query.productId) {
		try {
			var user = JSON.parse(await rp('https://serverlessohuser.trafficmanager.net/api/GetUser?userId=' + req.query.userId));
			var product = JSON.parse(await rp('https://serverlessohproduct.trafficmanager.net/api/GetProduct?productId=' + req.query.productId));
			const now = new Date;
			const ratingObj = {
				id: uuid(),
				userId: user.userId,
				productId: product.productId,
				timestamp: Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
				now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()),
				rating: rating,
				userNotes: req.query.userNotes
			};
			const client = await mongoClient.connect('mongodb://icescream.documents.azure.com:10255/?ssl=true', {
				auth: {
					user: 'icescream',
					password: 'ZCRVuteyMqxkYGT2CWCcDxxX40k873ToOKTe9EKki0qsS6wR1889ZzLYg38BPP6erxM3EBqq3HvQJHS9OMHEWw=='
				}
			});
			const db = client.db('Icecream');
			await db.collection('Ratings').insertMany([
				ratingObj
			]);
			context.res = {
				status: 200,
				body: ratingObj
			};
		}
		catch (e) {
			context.res = {
				status: 400,
				body: e.error
			};
		}
	} else {
		context.res = {
			status: 400,
			body: "missing user and product id"
		};
	}
};