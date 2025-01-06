import { Router } from "express";
import * as categoryController from './category.controller.js';

import fileUpload, { fileType } from "../../utls/multer.js";
import { auth, roles } from "../../middleware/auth.js";
import { endPoints } from "./category.role.js";

const router = Router();

router.post('/',auth(endPoints.create), fileUpload(fileType.image).single('image'), categoryController.create);
router.get('/',auth(endPoints.get),categoryController.getAll);
router.get('/active',auth(endPoints.getActive), categoryController.getActive);//admin and user
router.get('/:id',auth(endPoints.getActive), categoryController.getDetails);
router.patch('/:id',auth(endPoints.update), fileUpload(fileType.image).single('image'), categoryController.update);
router.delete('/:id',auth(endPoints.destroy),categoryController.destroy);

export default router;
