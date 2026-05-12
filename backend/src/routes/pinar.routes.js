import express from "express";
import { generatePinarDocx } from "../controllers/pinar.controller.js";

console.log("PINAR ROUTES CARGADAS");

const router = express.Router();

router.post("/generate-docx", generatePinarDocx);

export default router;





