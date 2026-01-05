import { acceptAppointment, appointmentWithQueryParams, confirmedPatientsToday, confirmedPatientsYesterday, createAppointment, fetchAllAppointments, getPatientsOfDoctor, rejectAppointment, todayAppointmentCount, getPatientAppointment, fetchAllAppointmentsForAdmin, getMonthlyTraffic, getBookedSlots } from "../controllers/appointment.js";
import express from "express";

export const appointmentsRoutes = express.Router();

// --- Create Appointment ---
appointmentsRoutes.post("/", createAppointment);

// Accept appointment
appointmentsRoutes.put('/:id/accept', acceptAppointment);

// Reject appointment
appointmentsRoutes.put('/:id/reject', rejectAppointment);

// --- Get Appointments-- -
appointmentsRoutes.get("/fetch_all_appointments/:uid", fetchAllAppointments);

// get appointment for traffic
appointmentsRoutes.get("/admin/traffic/monthly", getMonthlyTraffic);

// for admin
appointmentsRoutes.get('/admin_get_all_appointment', fetchAllAppointmentsForAdmin)

// for admin
appointmentsRoutes.get("/today_appointments_count", todayAppointmentCount);

// GET /appointments with query params
appointmentsRoutes.get('/smart_userdata', appointmentWithQueryParams);

// get confirmed patients yesterday
appointmentsRoutes.get('/confirmed_patients_yesterday', confirmedPatientsYesterday)

// get confirmed patients today
appointmentsRoutes.get('/confirmed_patients_today', confirmedPatientsToday)

// get appointment for specific patient
appointmentsRoutes.get('/:uid', getPatientAppointment)

// get patients of doctor
appointmentsRoutes.get('/doctor/:uid', getPatientsOfDoctor)

// get booked slots for doctor and date
appointmentsRoutes.get('/booked_slots/:doctorId/:date', getBookedSlots)
