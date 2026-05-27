import express from "express";
import {
    generatePinarDocx,
    generateAspectosCriticos,
    generatePinarIA
} from "../controllers/pinar.controller.js";

console.log("PINAR ROUTES CARGADAS");

const router = express.Router();

router.post("/generate-docx", generatePinarDocx);
router.post("/generate-aspectos", generateAspectosCriticos);
router.post("/generate-ia", generatePinarIA);

export default router;