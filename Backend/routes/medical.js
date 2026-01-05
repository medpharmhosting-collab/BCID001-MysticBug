import { createMedicalRecordDynamic, createPastMedicalRecords, getMedicalRecords } from "../controllers/medical.js";
import express from "express";
import { uploadMedicalRecords, uploadPastMedicalRecords } from "../middleware/multer.js";
export const medicalRoutes = express.Router();

// Get query based medical records by patient
medicalRoutes.get('/:uid', getMedicalRecords);

// POST past medical records by patient
medicalRoutes.post("/past/:uid", uploadPastMedicalRecords.single("file"), createPastMedicalRecords);

// Doctor uploads ANY TYPE (ehr, imaging, lab, prescriptions…)
medicalRoutes.post("/:type/:uid", uploadMedicalRecords.single("file"), createMedicalRecordDynamic
);