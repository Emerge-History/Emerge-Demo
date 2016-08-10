var express = require('express');

var sign = require('./controllers/sign');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/index', { title: 'Express' });
});

router.post('/register', sign.register);
router.post('/login', sign.login);


module.exports = router;
