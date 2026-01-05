import { conversationBetweenUsers, deleteConversationBetweenUsers, getAllMessagesBetweenDoctors, getLastMessageBetweenDoctors, getLastMessageBetweenUsers, incomingMessagetoDoctorViaPatient, incomingMessagetoPatientViaDoctor, markMessagesAsRead, sendMessage, sendMessageFromDoctorToDoctor } from "../controllers/message.js";
import express from "express";

export const messageRoutes = express.Router();


messageRoutes.get('/doctor-patients/:doctorId', incomingMessagetoDoctorViaPatient);
messageRoutes.get('/patient-doctors/:patientId', incomingMessagetoPatientViaDoctor);

messageRoutes.get('/conversation/:userId1/:userId2', conversationBetweenUsers);
messageRoutes.delete('/conversation/:userId1/:userId2', deleteConversationBetweenUsers);
// Send a new message
messageRoutes.post('/send', sendMessage);

// Mark messages as read
messageRoutes.patch('/mark-read/:senderId/:receiverId', markMessagesAsRead);

// Get last message for each conversation
messageRoutes.get('/last-messages/:userId/:otherUserId', getLastMessageBetweenUsers);

// Get all messages between two doctors
messageRoutes.get('/doctor-messages/:doctorId1/:doctorId2', getAllMessagesBetweenDoctors);

// Get last message between two doctors
messageRoutes.get('/doctor-last-messages/:doctorId1/:doctorId2', getLastMessageBetweenDoctors);

// Send message from doctor to doctor
messageRoutes.post('/doctor-send', sendMessageFromDoctorToDoctor);
