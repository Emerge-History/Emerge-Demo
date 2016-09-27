import User from '../crud/user'
import config from '../config'
import { bad, good, validator, bhash, bcompare, mail } from '../tool'
import jwt from 'jsonwebtoken'
const sign = {}

sign.test1 = (req, res) => {
  User.findAll().then((v) => {
    console.log(v)
    res.json({user: req.user})
  })
}
sign.test2 = (req, res) => {
  User.findAll().then((v) => {
    console.log(v)
    res.json({user: req.user})
  })
}



// register
sign.register = async(req, res, next) => {
  let {username, password, email} = req.body
  username = validator.trim(username||'')
  password = validator.trim(password||'')
  email = validator.trim(email||'')
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
  bhash(password, (err, hash) => {
    if(err) {
      return bad(res, '注册失败！请稍后再试')
    }
    User.create(username, hash, email).then((user) =>{
      if(user){
        mail.sendWelcomeMail(username, email);
        return good(res, '注册成功！')
      } else{
        return bad(res, '注册失败！请稍后再试')
      }
    })
  })
}

// login
sign.login = async(req, res, next) => {
  let {account, password} = req.body
  account = validator.trim(account||'')
  password = validator.trim(password||'')
  if(!(account && password)) {
    return bad(res, '信息不完整！')
  }
  if(account.indexOf('@') !== -1){
    if(!validator.isEmail(account)){
      return bad(res, '邮箱不合法！');
    }
  } else {
    if(!validator.isUsername(account)){
      return bad(res, '用户名不合法！');
    } 
  }
  const user = await User.findUser(account, account)
  if (user) {
    bcompare(password, user.password, (err, result)=> {
      if(err){
        return bad(res, '登录失败！请稍后再试')
      }
      if(!result){
        return bad(res, '密码错误！')
      } else {
        const token = jwt.sign({
          user: user.id
        }, config.secret, {
          expiresIn: "10h"
        })
        return good(res, '登录成功！',{token})
      }
    })
  } else {
    return bad(res, '账号不存在！');
  }

}



export default sign
