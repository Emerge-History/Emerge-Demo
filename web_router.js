var express = require('express');

var sign = require('./controllers/sign');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var name;
	if(req.session.user) {
		name = req.session.user.username;
	}else {
		name = 'null fuxk';
	}
  res.render('../views/index', { title: name });
});

router.post('/register', sign.register);
router.post('/login', sign.login);
router.get('/logout', sign.logout);
router.get('/captchapng', sign.captchapng);
router.post('/sendFindPassMail', sign.sendFindPassMail);
router.post('/checkFindPassCode', sign.checkFindPassCode);



module.exports = router;
