import signUp from "../controllers/auth/signUp.js";
import { Router } from "express";

const route= Router();

route.post('/sign-up',signUp);

export default route;