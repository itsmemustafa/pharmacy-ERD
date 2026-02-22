import { Router } from "express";
import searchMedicine from "../controllers/search/search.js";

const router = Router();

router.get("/", searchMedicine);

export default router;
