import { Prescription } from "../models/PrescriptionSchema.js"
import { supabase } from "../config/supabaseClient.js"
export const createPrescriptions = async (req, res) => {
  try {
    const { patientId, doctorId, doctorName, medication, notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileName = req.file.originalname;
    // Upload to Supabase bucket
    const timestamp = Date.now();
    const filePath = `${timestamp}_${fileName}`;

    // Upload to supabase
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_PRESCRIPTION_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });


    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({
        message: "Failed to upload file to storage",
        error: error.message
      });
    }

    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_PRESCRIPTION_BUCKET)
      .getPublicUrl(filePath);

    const pdfUrl = urlData.publicUrl;
    const newPrescription = new Prescription({
      patientId,
      doctorId,
      medication,
      doctorName,
      notes,
      fileName,
      pdfUrl
    });

    await newPrescription.save();

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: newPrescription
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({
      error: "Failed to create prescription",
      details: error.message
    });
  }
}
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { uid } = req.params;

    const prescriptions = await Prescription.find({ patientId: uid })
      .sort({ createdAt: -1 });

    res.status(200).json({ prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: error.message });
  }
}