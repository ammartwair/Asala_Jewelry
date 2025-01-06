import { Router } from "express";
import * as authController from './auth.controller.js';
import fileUpload, { fileType } from "../../utls/multer.js";

const router = Router();

router.post('/register', authController.register);//Create
router.post('/login',authController.login);
router.patch('/sendCode',authController.sendCode);
router.patch('/forgotPassword',authController.forgotPassword);


export default router;
