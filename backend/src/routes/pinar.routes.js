import express from "express";
import { generatePinarDocx } from "../controllers/pinar.controller.js";

const router = express.Router();

router.get("/generate-docx", (req, res) => {
    res.send("PINAR DOCX ROUTE OK");
});

router.post("/generate-docx", generatePinarDocx);

export default router;