import { Router } from 'express';
import sign from './controllers/sign';
import demo from './controllers/demo';
import jwt from 'express-jwt'
import config from './config'
const router = Router();

router.get('/test1', sign.test1)
router.get('/test2', jwt({secret: config.secret}), sign.test2)

// sign
router.post('/register', sign.register);
router.post('/login', sign.login);

// register verify 
// router.get('/verify', sign.verify);

// reset password
router.post('/reset', sign.reset)
router.post('/find_pwd', sign.findPwd)

// demo
router.get('/demos', demo.list)
router.get('/demos/:id', demo.get)
router.post('/demos', demo.create)
router.put('/demos/:id', demo.update)
router.delete('/demos/:id', demo.remove)

export default router
