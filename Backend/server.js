import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { admin } from "./firebase.js";


import { dbConn } from "./config/dbconnection.js";
import { getCount, patientRoutes, usersRoutes } from "./routes/users.js";
import { FaqRoutes } from "./routes/faq.js";
import { messageRoutes } from "./routes/message.js";
import { adminRoutes } from "./routes/admin.js";
import { taskRouter } from "./routes/task.js";
import { feedbackRouter } from "./routes/feedback.js";
import { investorRoutes } from "./routes/investor.js";
import { doctorRoutes } from "./routes/doctor.js";
import { medicalRoutes } from "./routes/medical.js";
import { appointmentsRoutes } from "./routes/appointment.js";
import notificationRoutes from "./routes/notification.js";

dotenv.config();

const app = express();
app.use(
  cors(
    {
      origin: ['http://localhost:5173',
        'https://bcid-001-mystic-bug.vercel.app',
        'https://www.medih.in',
        'https://medih.in',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  )
);
app.use(express.json());

// Connect to DB
dbConn();

// Export Firebase Admin Auth
export const firebaseAdmin = admin.auth();
console.log("Firebase Admin Initialized");
console.log(admin.app().options.credential.projectId)

// Routes 
app.use("/api/users", usersRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/medical_records", medicalRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api", feedbackRouter);
app.use("/api/tasks", taskRouter);
app.use("/api", getCount);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/faqs", FaqRoutes);
app.use("/api/notifications", notificationRoutes);

// hidden for vercel deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

export default app;
