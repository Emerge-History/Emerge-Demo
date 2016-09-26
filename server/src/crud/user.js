import models from '../models'

const User = models.User


const crud = {}


crud.create = (username, password, email) => {
    return User.create({
      username,
      password,
      email
    })
}

crud.findAll = () => {
    return User.findAll()
}


export default crud
