import { Router } from "express";
import addMedicine from "../controllers/Medicine/addMedicine.js";
import deleteMedicine from "../controllers/Medicine/deleteMedicine.js";
import getMedicine from "../controllers/Medicine/getMedicine.js";
import updateMedicine from "../controllers/Medicine/updateMedicine.js";
import getAllMedicines from "../controllers/Medicine/getAllMedicines.js";


const router=Router();
router.get("/",getAllMedicines)
router.get('/:id',getMedicine)
router.post('/',addMedicine);
router.delete("/:id",deleteMedicine)
router.patch('/:id',updateMedicine)

export default router;