var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// Use body-parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST users */
router.post('/', function(req, res, next) {
  console.log(req.body);
  res.send('POST received!');
});

module.exports = router;
