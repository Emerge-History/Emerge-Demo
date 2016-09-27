import User from '../crud/user'
import { bad, good, validator, bhash, bcompare, mail } from '../tool'
const sign = {}

sign.test = (req, res) => {
  User.findAll().then((v) => {
    res.json(v)
  })
}

sign.register = async(req, res, next) => {

  let {username, password, email} = req.body

  username = validator.trim(req.body.username||'')
  password = validator.trim(req.body.password||'')
  email = validator.trim(req.body.email||'')

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

export default sign
