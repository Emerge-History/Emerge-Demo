import User from '../crud/user'
import { bad, good, validator, bhash, bcompare } from '../tool'
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
    bad(res, '信息不完整！')
  }

  
  if(!validator.isUsername(username)){
    bad(res, '用户名不合法！');
  } 
  console.log(1)
   
  !validator.isEmail(email) && bad(res, '邮箱不合法！');
  console.log(2)
  !validator.isPassword(password) && bad(res, '密码不合法！');

  console.log(3);
  res.json({s:'ok'})
  // const user = await User.findUser(username, email)
  // if (user) {
  //   user.username === username && bad(res, '用户名已被使用！')
  //   user.email === email && bad(res, '邮箱已被使用！')
  // } 
  // bhash(password, (err, hash) => {
  //   err && bad(res, '注册失败！请稍后再试')
  //   User.create(username, hash, email).then((user) =>{
  //     user?good(res, '注册成功！'):bad(res, '注册失败！请稍后再试')
  //   })
  // })
}

export default sign
