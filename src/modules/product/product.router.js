import { Router } from "express";
import * as productController from './product.controller.js';
import fileUpload, { fileType } from "../../utls/multer.js";
import { endPoints } from "./product.role.js";
import { auth, roles } from "../../middleware/auth.js";

const router = Router();

router.post('/', auth(endPoints.create), fileUpload(fileType.image).single('image'), productController.create);
router.get('/',productController.getProducts);
router.delete('/:id',auth(endPoints.destroy),productController.destroy);

export default router;

