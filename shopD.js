const nedbPromise = require('../../utils/nedbPromise.js');

const stockdbPromise = new nedbPromise(new Datastore({ filename: path.join(__dirname, 'stock.db'), autoload: true }));
const orderdbPromise = new nedbPromise(new Datastore({ filename: path.join(__dirname, 'order.db'), autoload: true }));
const shipmentdbPromise = new nedbPromise(new Datastore({ filename: path.join(__dirname, 'shipment.db'), autoload: true }));

const ITEM_STATUS = {
	OPEN: 'OPEN',
	ORDERED: 'ORDERED',
	SOLD: 'SOLD'
};

const ORDER_STATUS = { 
	ACTIVE: 'ACTIVE',
	SHIPPED: 'SHIPPED',
	COMPLETE: 'COMPLETE' 
};

const SHIPMENT_STATUS= {
	IN_TRANSIT: 'IN_TRANSIT';
	DELIVERED: 'DELIVERED';
}

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

function order(itemId, orderer) {
	let selectQuery = {};
	selectQuery.status = ITEM_STATUS.OPEN;
	selectQuery.itemId = itemId;

	stockdbPromise.find(selectQuery)
	.then(function(docs) {
		let order = {};
		order.item = docs[0];
		order.from = item.owner;
		order.to = orderer;
		order.amount = item.price;
		order.orderId = 1;
		order.status = ORDER_STATUS.ACTIVE;

		return orderdbPromise.insert(order)
	}).then(function(docs) {
		callback(null, docs);
	}).catch(function(err) {
		console.log(err.stack);
	});	
}

function getActiveOrders() {
	let selectQuery = {};
	selectQuery.status = ORDER_STATUS.ACTIVE;

	orderdbPromise.find(selectQuery)
	.then(function(docs) {
		callback(null, docs);
	}).catch(function(err) {
		console.log(err.stack);
	});
}

function shipOrder(orderId, shipper) {
	let select = {};
	select.orderId = orderId;

	let  orderStatus = {};
	orderStatus.status = ORDER_STATUS.SHIPPED;
	let set = { $set: orderStatus}

	orderdbPromise.update(select, set)
	.then(function(numReplaced) {
		let shipment = {};
		shipment.orderId = orderId;
		shipment.shipper = shipper;
		shipment.status = SHIPMENT_STATUS.IN_TRANSIT;
		return shipmentdbPromise.insert(shipment);
	}).then(function(newDoc) {
		callback(null, true)
	}).catch(function(error) {
		logger.warn(err.stack);
	});
}