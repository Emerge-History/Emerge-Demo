import models from '../models'

const User = models.User

const crud = {}

crud.create = (username, password, email, code) => {
  return User.create({
    username,
    password,
  email,
  code,
verified:true
})
}

crud.findAll = () => {
  return User.findAll()
}

crud.findUser = (username, email) => {
  return User.findOne({
    where: {
      $or: [
        {username},
        {email}
      ]
    }
  })
}


crud.findUserByUsername = function(username) {
	return User.findOne({
		where: {
			username
		}
	});
}


crud.findUserByEmail = function(email) {
	return User.findOne({
		where: {
			email
		}
	});
}


crud.findUserByCode = function(code) {
	return User.findOne({
		where: {
			code
		}
	});
}



export default crud
