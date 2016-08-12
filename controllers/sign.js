var User = require('../proxy').User;
var tools = require('../utils/tools');
var validator = require('validator');
var eventproxy = require('eventproxy');
var authMiddleWare = require('../middlewares/auth');
var mail = require('../utils/mail');
var captchapng = require('captchapng');

/**
 * 返回验证码
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [验证码图片]
 */
exports.captchapng = function (req, res) {
  var check_code = parseInt(Math.random()*9000+1000);
  req.session.captcha = check_code+'';
  var p = new captchapng(80, 30, check_code);
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);
  var img = p.getBase64();
  var imgbase64 = new Buffer(img,'base64');
  res.writeHead(200, {
      'Content-Type': 'image/png'
  });
  res.end(imgbase64);
}

/**
 * 注册
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.register = function (req, res) {
	var username = validator.trim(req.body.username);
	var password = validator.trim(req.body.password);
  var email = validator.trim(req.body.email);
  var captcha = req.body.captcha;
  var ep = new eventproxy();
  var ep1 = new eventproxy();
  // 异常处理
  // ep.fail(next);
  ep.on('prop_err', function (msg) {
  	res.json({msg: msg, success: false});
  });
  // 验证数据
  if ([username, password, email].some(function (item) { return item === ''; })) {
    return ep.emit('prop_err', '信息不完整！');
  }
  if (!tools.validateUsername(username)) {
  	return ep.emit('prop_err', '用户名不合法！');
  }
  if (!tools.validatePassword(password)) {
  	return ep.emit('prop_err', '密码不合法！');
  }
  if (!validator.isEmail(email)) {
    return ep.emit('prop_err', '邮箱不合法！');
  }
  // 如果不访问验证码session就没有值，所以要判断undefined
  if (req.session.captcha === null || req.session.captcha === undefined || req.session.captcha !== captcha) {
    // 清除验证码
    req.session.captcha = null;
    return ep.emit('prop_err', '验证码错误！');
  }
  ep1.all('username', 'email', function () {
    // 创建用户
    tools.bhash(password, function(err, hash) {
      User.createUser(username, hash, email).then(function(user){
        if(!user){
          res.json({msg: '注册失败！请稍后再试', success: false});
        } else {
          // 邮件发送测试未通过
          mail.sendWelcomeMail(username, email);
          res.json({msg: '注册成功！', success: true});
        }
      });
    });
  });
  // 清除验证码
  req.session.captcha = null;
  // 查询用户名使用
  User.findUserByUsername(username).then(function(user) {
    if (user) {
      return ep.emit('prop_err', '用户名已被使用！');
    } else {
      ep1.emit('username');
    }
    // 查询邮箱使用
    User.findUserByEmail(email).then(function(user) {
      if (user) {
        return ep.emit('prop_err', '邮箱已被使用！');
      } else {
        ep1.emit('email');
      }
    });
  });
}

/**
 * 登录
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.login = function (req, res) {
  var loginname = validator.trim(req.body.loginname);
  var password = validator.trim(req.body.password);
  var ep = new eventproxy();
  // 异常处理
  // ep.fail(next);
  ep.on('login_err', function (msg) {
    res.json({msg: msg, success: false});
  });
  // 验证数据
  if ([loginname, password].some(function (item) { return item === ''; })) {
    return ep.emit('login_err', '信息不完整。');
  }
  // 判断邮箱还是用户名
  var getUser; 
  if (loginname.indexOf('@') !== -1) {
    if (!validator.isEmail(loginname)) {
      return ep.emit('login_err', '邮箱不合法！');
    }
    getUser = User.findUserByEmail;
  } else {
    if (!tools.validateUsername(loginname)) {
      return ep.emit('login_err', '用户名不合法！');
    }
    getUser = User.findUserByUsername;
  }
  if (!tools.validatePassword(password)) {
    return ep.emit('login_err', '密码不合法！');
  }
  getUser(loginname).then(function(user) {
    if(!user) {
      return ep.emit('login_err', '账号不存在！');
    } else {
      tools.bcompare(password, user.password, function(err, result) {
        if(!result) {
          return ep.emit('login_err', '密码错误！');
        } else {
          // TODO 登录成功 存储session到数据库
          req.session.user = user;
          res.json({msg: '登录成功', success: true});
        }
      })
    }
  });
}

/**
 * 注销
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.logout = function (req, res) {
  req.session.destroy();
  //res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect('/');
};

/**
 * 发送找回密码邮件
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.sendFindPassMail = function(req, res) {
  var email = validator.trim(req.body.email);
  if (!validator.isEmail(email)) {
    return res.json({msg: '邮箱不合法', success: false});
  }
  var code = Math.round(900000*Math.random()+100000) + '';// 随机生成一个6位数字find_pass_code 存session
  req.session.visitor = {
    email: email,
    check_code: code
  };
  mail.sendFindPassMail(email, code);
  res.json({msg: '已经发送邮件，请查看邮箱', success: true});
}

/**
 * 验证找回密码的验证码
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.checkFindPassCode = function(req, res) {
  // TODO 考虑是否刷新验证码 重新发送邮件功能
  var code = validator.trim(req.body.code);
  if((/^\d{6}$/).test(code)) {
    if(req.session.visitor === undefined || req.session.visitor.check_code !== code) {
      res.json({msg: '验证失败', success: false});
    } else {
      req.session.visitor.check = true;
      res.json({msg: '验证成功', success: true});
    }   
  } else {
    res.json({msg: '验证码格式错误', success: false});
  }
}

/**
 * 忘记密码重置
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.resetPass = function(req, res) {
  
}

/**
 * 修改密码更新
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.updatePass = function(req, res) {
  
}