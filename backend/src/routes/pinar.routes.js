import express from "express";
import { generatePinarDocx, generateAspectosCriticos } from "../controllers/pinar.controller.js";

console.log("PINAR ROUTES CARGADAS");

const router = express.Router();

router.post("/generate-docx", generatePinarDocx);
router.post("/generate-aspectos", generateAspectosCriticos);

export default router;