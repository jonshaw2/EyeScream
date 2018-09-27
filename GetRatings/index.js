const mongoClient = require("mongodb").MongoClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

	const client = await mongoClient.connect('mongodb://icescream.documents.azure.com:10255/?ssl=true', {
		auth: {
			user: 'icescream',
			password: 'ZCRVuteyMqxkYGT2CWCcDxxX40k873ToOKTe9EKki0qsS6wR1889ZzLYg38BPP6erxM3EBqq3HvQJHS9OMHEWw=='
		}
	});
	const db = client.db('Icecream');
	const ratings = await db.collection('Ratings').find().toArray();
	context.res = {
		status: 200,
		body: ratings
	};
};