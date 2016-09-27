import { Router } from 'express';
import sign from './controllers/sign';
const router = Router();







router.get('/test', sign.test)

router.post('/register', sign.register);
router.post('/login', sign.login);





export default router
