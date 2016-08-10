var models = require('../models');
var User = models.User;

/**
 * 新建一个用户
 * @param  {[type]} username     [用户名]
 * @param  {[type]} hashPassword [哈希化的密码]
 * @return {[type]}              [promise对象]
 */
exports.createUser = function(username, hashPassword){
	return User.create({
	  username: username,
	  password: hashPassword
	});
};

/**
 * 根据用户名查询用户
 * @param  {[type]} username [用户名]
 * @return {[type]}          [promise对象]
 */
exports.findUserByUsername = function(username) {
	return User.findOne({
		where: {
			username: username
		}
	});
}

/**
 * 根据邮箱查询用户
 * @param  {[type]} email [邮箱]
 * @return {[type]}       [promise对象]
 */
exports.findUserByEmail = function(email) {
	return User.findOne({
		where: {
			email: email
		}
	});
}

/**
 * 根据用户名删除用户
 * @param  {[type]} username [用户名]
 * @return {[type]}          [promise对象]
 */
exports.delUserByUsername = function(username) {
	return User.destroy({
		where: {
			username: username
		}
	});
}

