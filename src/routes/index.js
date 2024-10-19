import { Router } from "express";
import routerUser from "./userRoute.js";

const router = Router();
router.use("/user", routerUser);

export default router;
