import { deleteInvestorById, getAllInvestors, getInvestmentsByInvestorId, getSpecificInvestor, getWorkforceCounts, updateInvestorById } from "../controllers/investor.js";
import express from "express";

export const investorRoutes = express.Router();

// Get investments by investor ID
investorRoutes.get("/", getInvestmentsByInvestorId);

// ✅ Get all investors
investorRoutes.get("/get_investors", getAllInvestors);

// get specific investor data
investorRoutes.get('/get_investor/:uid', getSpecificInvestor)

// Update investor by ID
investorRoutes.put("/update_investor/:id", updateInvestorById);

// delete investor by id
investorRoutes.delete("/delete_investor/:id", deleteInvestorById)

// get workforce counts
investorRoutes.get("/workforce_counts", getWorkforceCounts)
