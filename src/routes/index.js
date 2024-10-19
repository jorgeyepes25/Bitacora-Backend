import { Router } from "express";
import routerUser from "./userRoute.js";
import routerRole from "./roleRoute.js";

const router = Router();
router.use("/user", routerUser);
router.use("/role", routerRole);

export default router;
