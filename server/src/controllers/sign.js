import User from '../crud/user'
import config from '../config'
import { bad, good, validator, bhashSync, bcompareSync, mail } from '../tool'
import jwt from 'jsonwebtoken'
import uuid from 'node-uuid'
const sign = {}

sign.test1 = (req, res) => {
  User.findAll().then((v) => {
    res.json({user: req.user, allUser:v})
  })
}
sign.test2 = (req, res) => {
  User.findAll().then((v) => {
    res.json({user: req.user, allUser:v})
  })
}




// register
// TODO next version need to use email to vertify the register
// 
sign.register = async(req, res, next) => {
  let {username, password, email} = req.body
  username = validator.trim(username)
  password = validator.trim(password)
  email = validator.trim(email)
  if(!(username && password && email)) {
    return bad(res, '信息不完整！')
  }
  if(!validator.isUsername(username)){
    return bad(res, '用户名不合法！');
  } 
  if(!validator.isEmail(email)){
    return bad(res, '邮箱不合法！');
  }
  if(!validator.isPassword(password)){
    return bad(res, '密码不合法！');
  }
  const user = await User.findUser(username, email)
  if (user) {
    if(user.username === username) {
      return bad(res, '用户名已被使用！') 
    }
    if(user.email === email) {
      return bad(res, '邮箱已被使用！')
    }
  } 

  const hash = bhashSync(password)
  const code = bhashSync(uuid.v4())

  User.create(username, hash, email, code).then((user) =>{
    if(user){
      mail.sendWelcomeMail(username, email);
      return good(res, '注册成功！')
    } else{
      return bad(res, '注册失败！请稍后再试')
    }
  })
}

sign.verify = async(req, res, next) => {
  let { email, code } = req.query;
  email = validator.trim(email)
  code = validator.trim(code)
  if(!(email && code)){
    return bad(res, '验证失败！')
  }
  if(!validator.isEmail(email)) {
    return bad(res, '验证失败！')
  }

  const user = await User.findUserByEmail(email);

  if(user) {
    if(user.verified === true ) {
      return good(res, '账号已经验证通过！')
    }
    if(user.code === code) {
      user.verified = true;
      await user.save();
      return good(res, '验证通过！')
    }else {
      return bad(res, '验证失败！')
    }
  } else {
    return bad(res, '验证失败！')
  }
}




// login
sign.login = async(req, res, next) => {
  let {account, password} = req.body
  account = validator.trim(account)
  password = validator.trim(password)
  if(!(account && password)) {
    return bad(res, '信息不完整！')
  }
  let way
  if(account.indexOf('@') !== -1){
    if(!validator.isEmail(account)){
      return bad(res, '邮箱不合法！');
    }
    way = User.findUserByEmail
  } else {
    if(!validator.isUsername(account)){
      return bad(res, '用户名不合法！');
    } 
    way = User.findUserByUsername
  }
  const user = await way(account)
  if (user) {
    let result = bcompareSync(password, user.password);
    if(!result){
      return bad(res, '密码错误！')
    } else {
      const token = jwt.sign({
        userId: user.id
      }, config.secret, {
        expiresIn: '30 days'
      })
      return good(res, '登录成功！',{token})
    }
  } else {
    return bad(res, '账号不存在！');
  }
}

sign.reset = async(req, res, next) => {
  let { password, code } = req.body

  password = validator.trim(password)
  code = validator.trim(code)
  if(!(code&&password)) {
    return bad(res, '信息不完整！')
  }
  if(!validator.isPassword(password)){
    return bad(res, '密码不合法！');
  }

  const user = await User.findUserByCode(code);

  if(user){
    if(user.verified === false) {
      user.verified = true;
    }
    user.password = bhashSync(password)
    await user.save();
    return good(res, '修改成功！')
  }else{
    return bad(res, '账号不存在！');
  }
}


sign.findPwd = async(req, res, next) => {
  let { email } = req.body
  email = validator.trim(email)
  if(!email) {
    return bad(res, '信息不完整！')
  }
  if(!validator.isEmail(email)){
    return bad(res, '邮箱不合法！');
  }
  const user = await User.findUserByEmail(email);
  if(user){
    mail.sendFindPassMail(email, user.verified);
    return good(res, '已经向您的邮箱发送了一封邮件！');
  }else{
    return bad(res, '账号不存在！');
  }
}


export default sign
