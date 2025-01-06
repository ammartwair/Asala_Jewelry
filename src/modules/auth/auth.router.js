import { Router } from "express";
import * as authController from './auth.controller.js';
import fileUpload, { fileType } from "../../utls/multer.js";

const router = Router();

router.post('/register', authController.register);//Create
router.post('/login',authController.login);
/*router.get('/active', categoryController.getActive);
router.get('/:id', categoryController.getDetails);
router.patch('/:id', fileUpload(fileType.image).single('image'), categoryController.update);
router.delete('/:id',categoryController.destroy);*/


export default router;
