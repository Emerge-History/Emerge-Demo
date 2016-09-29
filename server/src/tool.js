// ==============================================bcrypt start
import bcrypt from 'bcryptjs'

export const bhashSync = (str) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(str, salt);
}
export const bcompareSync = (str, hash) => {
  return bcrypt.compareSync(str, hash);
}
export const bhash = (str, cb) => {
  bcrypt.hash(str, 10, cb)
}
export const bcompare = (str, hash, cb) => {
  bcrypt.compare(str, hash, cb)
}
// ==============================================bcrypt end

// ==============================================json start
export const bad = (res, msg, data) => {
  return res.json({msg, success: false, data})
}
export const good = (res, msg, data) => {
  return res.json({msg, success: true, data})
}
// ==============================================json start

// ==============================================validator start
const validator = {}
validator.trim = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
validator.isUsername = (str) => {
  if (typeof str !== 'string') return ''
  return (/^[\u4e00-\u9fa5_a-zA-Z0-9]{4,20}$/).test(str)
}
validator.isEmail = (str) => {
  if (typeof str !== 'string') return ''
  return (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/).test(str)
}
validator.isPassword = (str) => {
  if (typeof str !== 'string') return ''
  return (/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/).test(str)
}
export { validator }
// ==============================================validator end

// ==============================================mail start
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import config from './config'
const transporter = nodemailer.createTransport(smtpTransport(config.mail))

const mail = {}
const sendMail = data => {
  transporter.sendMail(data, function (err, info) {
    if (err) {
      // TODO 打印日志
      console.log('err:', err)
    } else {
      console.log('Message sent: ' + info.response)
    }
  })
}

mail.sendWelcomeMail = (username, email) => {
  sendMail({
    from: config.mail.auth.user,
    to: email,
    subject: '欢迎使用emergeDemo',
    html: '<p>您好：' + username + '</p>' +
      '<p>我们收到您在emergeDemo的注册信息，欢迎使用emergeDemo</p>' +
      '<p>本邮件由系统自动发出，请勿直接回复</p>'
  })
}

mail.sendVerifyMail = (email, code) => {
  sendMail({ from : config.mail.auth.user,
    to: email,
    subject: '欢迎使用emergeDemo',
    html: '<p>您好!</p>' +
      '<p>验证码：' + code + '，感谢您注册emergeDemo，请在10分钟内完成注册。工作人员不会向您索取验证码，请勿泄露。消息来自：emergeDemo</p>' +
      '<p>本邮件由系统自动发出，请勿直接回复</p>'
  })
}

mail.sendFindPassMail = (email, code) => {
  sendMail({ from : config.mail.auth.user,
    to: email,
    subject: 'emergeDemo找回密码',
    html: '<p>您好!</p>' +
      '<p>验证链接：' + '<a href="'+ 'http://127.0.0.1:8080/reset?code=' + code  +'">'+ 'http://127.0.0.1:8080/reset?code='+ code + '</a>' +'</p>'+
      '<p>本邮件由系统自动发出，请勿直接回复</p>'
  })
}

export { mail }
// ==============================================mail end
