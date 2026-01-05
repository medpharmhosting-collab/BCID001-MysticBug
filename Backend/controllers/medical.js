import { MedicalRecord } from "../models/medical.js";
import { supabase } from "../config/supabaseClient.js";

export const createPastMedicalRecords = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { uid } = req.params;
    const { sender } = req.query;

    if (!uid) return res.status(400).json({ message: "UID is required" });
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = req.file.originalname;
    const filePath = `${uid}/${Date.now()}_${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_PAST_MEDICAL_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      return res.status(500).json({ message: "Failed to upload file", error: uploadError.message });
    }

    const { data: urlData, error: urlError } = supabase.storage
      .from(process.env.SUPABASE_PAST_MEDICAL_BUCKET)
      .getPublicUrl(filePath);

    if (urlError) {
      return res.status(500).json({
        message: "Failed to generate public url",
        error: urlError.message
      });
    }
    const record = new MedicalRecord({
      uid,
      name,
      email,
      sender,
      type: "past",
      fileName,
      pdfUrl: urlData.publicUrl
    });

    await record.save();
    res.status(201).json({ message: "Record uploaded successfully", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create record" });
  }
};

// Doctor uploads any type of record
export const createMedicalRecordDynamic = async (req, res) => {
  try {
    const { uid, type } = req.params;
    const { patientId, doctorName, medication, notes } = req.body;
    const { sender } = req.query;
    if (!uid) return res.status(400).json({ message: "UID is required" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = req.file.originalname;
    const filePath = `${uid}/${Date.now()}_${type}_${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_MEDICAL_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) return res.status(500).json({ message: uploadError.message });

    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_MEDICAL_BUCKET)
      .getPublicUrl(filePath);

    const record = new MedicalRecord({
      uid: patientId,
      name: doctorName,
      medication,
      notes,
      fileName,
      pdfUrl: urlData.publicUrl,
      type,
      sender: sender || "doctor",
    });

    await record.save();
    res.status(201).json({ message: "Record uploaded", record });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create record" });
  }
};

// Get medical records by patient, optional filters: type & sender
export const getMedicalRecords = async (req, res) => {
  try {
    const { uid } = req.params;
    const { sender, type } = req.query;

    if (!uid) return res.status(400).json({ message: "UID missing" });

    const filter = { uid };
    if (sender) filter.sender = sender;
    if (type) filter.type = type;
    const records = await MedicalRecord.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("Error fetching medical records:", err);
    res.status(500).json({ message: "Failed to fetch medical records" });
  }
};