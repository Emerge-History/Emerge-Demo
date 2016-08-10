var bcrypt = require('bcryptjs');

/**
 * 哈希化
 * @param  {[type]}   str      [字符串]
 * @param  {Function} callback [err, hash]
 * @return {[type]}            [none]
 */
exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);
};

/**
 * 哈希值比较
 * @param  {[type]}   str      [字符串]
 * @param  {[type]}   hash     [被比较的哈希值]
 * @param  {Function} callback [err, result(boolean)]
 * @return {[type]}            [none]
 */
exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};

/**
 * 4-20位中文字母数字下划线
 * @param  {[type]} str [字符串]
 * @return {[type]}     [boolean]
 */
exports.validateUsername = function(str) {
	return (/^[\u4e00-\u9fa5_a-zA-Z0-9]{4,20}$/).test(str);
}
/**
 * 6-22位密码
 * @param  {[type]} str [字符串]
 * @return {[type]}     [boolean]
 */
exports.validatePassword = function(str) {
	return (/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/).test(str);
}