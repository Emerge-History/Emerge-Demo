import bcrypt from 'bcryptjs'

export const bhash = (str, cb) => {
  bcrypt.hash(str, 10, cb)
}

export const bcompare = (str, hash, cb) => {
  bcrypt.compare(str, hash, cb)
}

export const bad = (res, msg, data) => {
  return res.json({msg, success: false, data})
}

export const good = (res, msg, data) => {
  return res.json({msg, success: true, data})
}

const validator = {}

validator.trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

validator.isUsername = (str) => {
  return (/^[\u4e00-\u9fa5_a-zA-Z0-9]{4,20}$/).test(str)
}

validator.isEmail = (str) => {
  return (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/).test(str)
}

validator.isPassword = (str) => {
  return (/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/).test(str)
}
export { validator }
