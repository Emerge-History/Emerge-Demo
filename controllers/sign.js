var User = require('../proxy').User;
var tools = require('../utils/tools');
var validator = require('validator');
var eventproxy = require('eventproxy');
var authMiddleWare = require('../middlewares/auth');
var mail = require('../utils/mail');

exports.register = function (req, res) {
	var username = validator.trim(req.body.username);
	var password = validator.trim(req.body.password);
  var email = validator.trim(req.body.email);
  var ep = new eventproxy();

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

// TODO token用邮箱hash
// 然后再比较
mail.sendActiveMail(username, email, 'token');
res.json({msg: 'send email', success: true});

  // // 查询用户名
  // User.findUserByUsername(username).then(function(user) {
  //   if (user) {
  //     if(!user.email_active) {
  //       // 邮箱已经注册但没有激活
  //       // 跳转到激活邮箱
  //     } else {
  //       // 用户名已被使用
  //       return ep.emit('prop_err', '用户名已被使用！');
  //     }
  //   } else {
  //     // 查询邮箱
  //     User.findUserByEmail(email).then(function(user) {
  //       if (user) {
  //         if(!user.email_active) {
  //         // 邮箱已经注册但没有激活
  //         // 跳转到激活邮箱
  //         } else {
  //           // 邮箱已被使用
  //           return ep.emit('prop_err', '邮箱已被使用！');
  //         }
  //       } else {
  //         // TODO 发送邮件
  //         mail.sendActiveMail(username, email, 'token');
  //         // 创建用户
  //         tools.bhash(password, function(err, hash) {
  //           User.createUser(username, hash).then(function(user){
  //             if(!user){
  //               res.json({msg: '注册失败！请稍后再试', success: false});
  //             } else {
  //               res.json({msg: '注册成功！', success: true});
  //             }
  //           });
  //         });
          
          
  //       }
  //     });
  //   }
  // });



}

exports.login = function (req, res) {
  var username = validator.trim(req.body.username);
  var password = validator.trim(req.body.password);
  var ep = new eventproxy();

  // 异常处理
  // ep.fail(next);
  ep.on('login_err', function (msg) {
    res.json({msg: msg, success: false});
  });

  // 验证数据
  if ([username, password].some(function (item) { return item === ''; })) {
    ep.emit('login_err', '信息不完整。');
    return;
  }
  if (!tools.validateUsername(username)) {
    ep.emit('login_err', '用户名不合法！');
    return;
  }
  if (!tools.validatePassword(password)) {
    ep.emit('login_err', '密码不合法！');
    return;
  }
  User.findUserByUsername(username).then(function(user) {
    if(!user) {
      ep.emit('login_err', '账号不存在！');
      return;
    } else {
      tools.bcompare(password, user.password, function(err, result) {
        if(!result) {
          ep.emit('login_err', '密码错误！');
          return;
        } else {
          // 登录成功 TODO 加session 还有 增加验证码
          // store session cookie
          // authMiddleWare.gen_session(user, res);
          // req.session = user;
          res.json({msg: '登录成功', success: true});
        }
      })
    }
  });

}

