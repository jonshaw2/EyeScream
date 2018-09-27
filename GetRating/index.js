const mongoClient = require("mongodb").MongoClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.ratingId) {
		const client = await mongoClient.connect('mongodb://icescream.documents.azure.com:10255/?ssl=true', {
			auth: {
				user: 'icescream',
				password: 'ZCRVuteyMqxkYGT2CWCcDxxX40k873ToOKTe9EKki0qsS6wR1889ZzLYg38BPP6erxM3EBqq3HvQJHS9OMHEWw=='
			}
		});
		const db = client.db('Icecream');
		const rating = await db.collection('Ratings').findOne({ id: req.query.ratingId});
		if (rating) {
			context.res = {
				status: 200,
				body: rating
			};
		} else {
			context.res = {
				status: 404,
				body: "Could not find rating"
			};
		}
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a rating ID on the query string or in the request body"
        };
    }
};