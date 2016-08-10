var nodemailer = require('nodemailer');
var config = require('../config');
var SITE_ROOT_URL = 'http://' + config.host;
var transporter = nodemailer.createTransport(config.mail_opts);



exports.sendActiveMail = function(username, email, token) {
	var mailOptions = {
	  from: config.mail_opts.auth.user,
	  to: email,
	  subject: 'emergeDemo激活账号',
	  text: 'Hello world',
	  html: '<p>您好：' + username + '</p>' +
	  '<p>我们收到您在emergeDemo的注册信息，请点击下面的链接来激活帐户：</p>' +
	  '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&email=' + email + '">激活链接</a>' +
	  '<p>若您没有在emergeDemo填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
	  '<p>本邮件由系统自动发出，请勿直接回复</p>'
	};

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
    	// TODO 日志打印
      console.log(err);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
}