const nedbPromise = require('../../utils/nedbPromise.js');

const stockdbPromise = new nedbPromise(new Datastore({ filename: path.join(__dirname, 'stock.db'), autoload: true }));

const ITEM_STATUS = {
	OPEN: 'OPEN',
	ORDERED: 'ORDERED',
	SOLD: 'SOLD'
};

function addItem(item) {
	item.status = ITEM_STATUS.OPEN;

	stockdbPromise.insert(item)
	.then(function(newDoc) {
		console.log(newDoc);
	}).catch(function(err) {
		console.log(err.stack);
		return;
	});
}

function getOpenItems(requester) {
	let selectQuery = {};
	selectQuery.status = ITEM_STATUS.OPEN;

	let notEqual = {};
	notEqual['$ne'] = requester;

	selectQuery.owner = notEqual;

	stockdbPromise.find(selectQuery)
	.then(function(docs) {
		callback(null, docs);
	}).catch(function(err) {
		console.log(err.stack);
	});
}

function order() {
	
}