// 登录拦截
exports.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
  	res.redirect('/'); 
  }
  next();
};

// exports.gen_session = function (user, res) {
//   var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
//   var opts = {
//     path: '/',
//     maxAge: 1000 * 60 * 60 * 24 * 30,
//     signed: true,
//     httpOnly: true
//   };
//   res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
// }



