import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.ts';

const router = Router();

router.post('/signup/request-otp', authCtrl.requestSignupOtp);
router.post('/signup/verify', authCtrl.verifySignupOtp);

router.post('/login/request-otp', authCtrl.requestLoginOtp);
router.post('/login/verify', authCtrl.verifyLoginOtp);

router.post('/google', authCtrl.googleSignIn);

router.post('/logout', authCtrl.logout);

export default router;
