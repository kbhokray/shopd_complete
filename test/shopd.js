const ShopD = artifacts.require('./ShopD.sol');

contract('ShopD', function(accounts) {
	let shopD;

	let ownerAccount = accounts[0];
	let sellerAccount = accounts[1];
	let buyerAccount = accounts[2];
	let shipperAccount = accounts[3];
	let nonShipperAccount = accounts[4];

	let ITEM_ID = "Id1";
	let ORDER_ID = "OrderId1";
	let ITEM_PRICE = 30;

	const SHIPMENT_STATUS = { 
		InTransit: 0, 
		Delivered: 1 
	};

	it('should add item', function(done) {
		ShopD.deployed().then(function(instance) {
			shopD = instance;
			assert.isOk(shopD);
			return shopD.addItem(ITEM_ID, "ItemName1", ITEM_PRICE, {from: sellerAccount});
		}).then(function(result) {
			assert.isOk(result);
			return shopD.isInStock(ITEM_ID);
		}).then(function(isInStock) {
			assert.equal(isInStock, true, "Item not added");
			console.log("Item added: " + ITEM_ID);
			done();
		});
	});

	it('should reject low payment order', function(done) {
		shopD.placeOrder(ORDER_ID, ITEM_ID, {from: buyerAccount, value: 29})
		.catch(function(err) {
			assert.isOk(err);
			done();
		});
	});

	it('should place order', function(done) {
		shopD.order(ORDER_ID, ITEM_ID, {from: buyerAccount, value: ITEM_PRICE})
		.then(function(result) {
			assert.isOk(result);
			return shopD.isActiveOrder(ORDER_ID);
		}).then(function(isActiveOrder) {
			assert.equal(isActiveOrder, true, "Order not placed");
			console.log("Order placed: " + ORDER_ID);
			done();
		});
	});

	it('should add shipper', function(done) {
		shopD.addShipper(shipperAccount)
		.then(function(result) {
			assert.isOk(result);
			return shopD.isShipper(shipperAccount);
		}).then(function(isShipper) {
			assert.equal(isShipper, true, "Shipper account not added");
			done();
		});
	});

	it('should not ship order from an unregistered shipper', function(done) {
		shopD.shipOrder(ORDER_ID, {from: nonShipperAccount})
		.catch(function(err) {
			assert.isOk(err);
			done();
		});
	});

	it('should ship order from a registered shipper', function(done) {
		shopD.shipOrder(ORDER_ID, {from: shipperAccount})
		.then(function(result) {
			assert.isOk(result);
			return shopD.getShipper(ORDER_ID);
		}).then(function(shipper) {
			console.log("Order shipped by: " + shipper);
			assert.equal(shipper, shipperAccount, "Order not being shipped by shipper account");
			done();
		});
	});

	it('should not ship an intransit order', function(done) {
		shopD.shipOrder(ORDER_ID, {from: shipperAccount})
		.catch(function(err) {
			assert.isOk(err);
			done();
		});
	});

	it('should update shipment status', function(done) {
		shopD.updateShipmentStatus(ORDER_ID, SHIPMENT_STATUS.Delivered, {from: shipperAccount})
		.then(function(result) {
			assert.isOk(result);
			return shopD.getShipmentStatus(ORDER_ID);
		}).then(function(shipmentStatus) {
			assert.equal(shipmentStatus.toString(), SHIPMENT_STATUS.Delivered, "Shipment not updated to delivered");
			done();
		});
	});

	it('should settle order', function(done) {
		let balBeforeSettling = web3.eth.getBalance(sellerAccount);
		console.log("Seller balance before settling = " + balBeforeSettling.toString());
		shopD.settle(ORDER_ID, {from: buyerAccount})
		.then(function(result) {
			assert.isOk(result);
			let balAfterSettling = web3.eth.getBalance(sellerAccount)
			console.log("Seller balance after settling = " + balAfterSettling.toString());

			assert.equal(balBeforeSettling.plus(ITEM_PRICE).toString(), balAfterSettling.toString(), "Money not added to seller account")
			return shopD.getOwner(ITEM_ID);
		}).then(function(owner) {
			assert.equal(owner, buyerAccount,"Ownership not transfered to buyer");
			console.log("Item settled: " + ITEM_ID);
			done();
		});
	});
});