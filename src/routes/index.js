import { Router } from "express";
import { protect } from '../middlewares/authMiddleware.js';
import authRoutes from './authRoutes.js';
import routerUser from "./userRoute.js";
import routerRole from "./roleRoute.js";
import routerBitacora from "./bitacoraRoute.js";

const router = Router();

router.use('/auth', authRoutes);
router.use("/user", routerUser);
router.use("/role", protect, routerRole);
router.use("/bitacora", protect, routerBitacora);

export default router;
