var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../config');
var transporter = nodemailer.createTransport(smtpTransport(config.mail_opts));
var SITE_ROOT_URL = 'http://' + config.host;
var util = require('util');

/**
 * 发送邮件
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var sendMail = function (data) {
  // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
  transporter.sendMail(data, function (err, info) {
    if (err) {
    	// TODO 打印日志
      console.log('err:', err);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
};
exports.sendMail = sendMail;


/**
 * 发送欢迎邮件
 * @param  {[type]} username [description]
 * @param  {[type]} email    [description]
 * @return {[type]}          [description]
 */
exports.sendWelcomeMail = function(username, email) {
  exports.sendMail({
	  from: util.format('%s <%s>', config.name, config.mail_opts.auth.user),
	  to: email,
	  subject: '欢迎使用emergeDemo',
	  html: '<p>您好：' + username + '</p>' +
	  '<p>我们收到您在emergeDemo的注册信息，欢迎使用emergeDemo</p>' +
	  '<p>本邮件由系统自动发出，请勿直接回复</p>'
  });
}

/**
 * 发送找回密码邮件
 * @param  {[type]} email [description]
 * @param  {[type]} code  [description]
 * @return {[type]}       [description]
 */
exports.sendFindPassMail = function(email, code) {
  exports.sendMail({
    from: util.format('%s <%s>', config.name, config.mail_opts.auth.user),
    to: email,
    subject: '欢迎使用emergeDemo',
    html: '<p>您好!</p>' +
    '<p>验证码：' + code + '，感谢您注册emergeDemo，请在10分钟内完成注册。工作人员不会向您索取验证码，请勿泄露。消息来自：emergeDemo</p>' +
    '<p>本邮件由系统自动发出，请勿直接回复</p>'
  });
}