import login from "../controllers/auth/login.js";
import logout from "../controllers/auth/logout.js";
import signUp from "../controllers/auth/signUp.js";
import { Router } from "express";

const route= Router();

route.post('/sign-up',signUp);
route.post('/login',login)
route.post("/logout",logout)
export default route;