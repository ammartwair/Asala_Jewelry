import { Router } from "express";
import * as cartController from './cart.controller.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoints } from "./cart.role.js";

const router = Router();

router.get('/',auth(endPoints.create),cartController.get);
router.post('/',auth(endPoints.create), cartController.create);
router.put('/updateQuantity/:productId',auth(endPoints.create),cartController.updateQuantity);
router.put('/clear',auth(endPoints.delete), cartController.clearCart);
router.put('/:productId',auth(endPoints.delete), cartController.remove);




export default router;
