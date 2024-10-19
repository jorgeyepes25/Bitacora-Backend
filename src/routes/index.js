import { Router } from "express";
import { protect } from '../middlewares/authMiddleware.js';
import authRoutes from './authRoutes.js';
import routerUser from "./userRoute.js";
import routerRole from "./roleRoute.js";

const router = Router();
router.use('/auth', authRoutes);
router.use("/user", protect, routerUser);
router.use("/role", protect, routerRole);

export default router;
