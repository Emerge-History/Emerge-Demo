import User from '../crud/user'

const sign = {}

sign.test = (req, res) => {
    User.findAll().then((v)=>{
        res.json(v)
    })
}

sign.register = (req, res) =>{
    User.create('username', 'password', 'email').then((user)=>{
        if(user) {
            res.json({msg: '注册成功！', success: true});
        }
    })
}



export default sign;