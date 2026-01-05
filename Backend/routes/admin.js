import { addDoctor, addInvestor, getActiveStatus, updateDoctor } from "../controllers/admin.js";
import express from "express";

export const adminRoutes = express.Router();

// GET /admin/active-status
adminRoutes.get("/active-status", getActiveStatus);

// Admin adds doctor
adminRoutes.post("/add-doctor", addDoctor);
// admin update doctor
adminRoutes.put('/update-doctor/:id', updateDoctor)

// Admin adds investor
adminRoutes.post("/add-investor", addInvestor);