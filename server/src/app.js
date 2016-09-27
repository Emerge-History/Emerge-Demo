import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import log4js from 'log4js'
import config from './config'
import routes from './routes'
import models from './models'
import http from 'http'
import xss from 'xss'

const app = express()
const server = http.createServer(app)
const log = log4js.getLogger('DEBUG::log')
const conf = config[config.env]

// use middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compress())
app.use(helmet())
app.use(cors())

// development server request loger
if (config.env === 'development') {
  app.use(logger('dev'))
}




// use routes
app.use('/api', routes)





// handle errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(500).json({
      msg: '验证失败！',
      success: false
    })
  }
});
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   log.debug(err.message)
//   log.error(err)
// });





// set port
app.set('port', conf.port)

// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(() => {
  server.listen(conf.port)
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error
    }
    switch (error.code) {
      case 'EACCES':
        log.error('requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        log.error(`port: ${conf.port} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  })
  server.on('listening', () => {
    log.debug(`server start on port ${conf.port}`)
  })
})

