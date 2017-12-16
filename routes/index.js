var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.addItem('/seller/addItem', function(req, res, next) {
	req.body;
});

module.exports = router;
