const ShopD = artifacts.require('./ShopD.sol');

contract('ShopD', function(accounts) {
	let shopD;

	let ownerAccount = accounts[0];//'0xE4F3fA7723E95237D4837FF9b47735502BD07D5a';
	let sellerAccount = accounts[1];
	let buyerAccount = accounts[2];
	let shipperAccount = accounts[3];
	let nonShipperAccount = accounts[4];

	it('should add item', function(done) {
		ShopD.deployed().then(function(instance) {
			shopD = instance;
			assert.isOk(shopD);
			return shopD.addItem("Id1", "ItemName1", 30, {from: sellerAccount});
		}).then(function(result) {
			assert.isOk(result);
			done();
		});
	});

	it('should reject low payment order', function(done) {
		shopD.placeOrder("Id1", {from: buyerAccount, value: 29})
		.catch(function(err) {
			assert.isOk(err);
			done();
		});
	});

	it('should place order', function(done) {
		shopD.placeOrder("Id1", {from: buyerAccount, value: 30})
		.then(function(result) {
			assert.isOk(result);
			done();
		});
	});

	it('should add shipper', function(done) {
		shopD.addShipper(shipperAccount)
		.then(function(result) {
			assert.isOk(result);
			done();
		});
	});

	it('should not ship order from an unregistered shipper', function(done) {
		shopD.shipOrder("Id1", {from: nonShipperAccount})
		.catch(function(err) {
			assert.isOk(err);
			done();
		});
	});

	it('should ship order from a registered shipper', function(done) {
		shopD.shipOrder("Id1", {from: shipperAccount})
		.then(function(result) {
			assert.isOk(result);
			done();
		});
	});

	it('should not ship an intransit order', function(done) {
		shopD.shipOrder("Id1", {from: shipperAccount})
		.catch(function(err) {
			assert.isOk(err);
			done();
		});
	});

	it('should not ship an intransit order', function(done) {
		shopD.shipOrder("Id1", {from: shipperAccount})
		.catch(function(err) {
			assert.isOk(err);
			done();
		});
	});

	it('should update shipment status', function(done) {
		shopD.updateShipmentStatus("Id1", 1, {from: shipperAccount})
		.then(function(result) {
			assert.isOk(result);
			done();
		});
	});

	it('should settle order', function(done) {
		shopD.settle("Id1", {from: buyerAccount})
		.then(function(result) {
			assert.isOk(result);
			done();
		});
	});
});