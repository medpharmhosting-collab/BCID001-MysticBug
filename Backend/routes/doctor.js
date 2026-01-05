import { deleteDoctorById, fetchActiveDoctorData, fetchDoctors, getCountOfActiveDoctors, getDoctor, getDoctorById, getPatientsofDoctor, updateDoctorByUid } from "../controllers/doctor.js";
import express from "express";
export const doctorRoutes = express.Router();

// get doctor by id
doctorRoutes.get('/get_doctor_by_id/:id', getDoctorById)

// fetch doctors
doctorRoutes.get('/', fetchDoctors)
doctorRoutes.get('/active_doctors_data', fetchActiveDoctorData)

//get count of active doctors
doctorRoutes.get('/get_active_doctor_count', getCountOfActiveDoctors)

// get patients of doctor
doctorRoutes.get('/:uid/patients', getPatientsofDoctor)

// get doctor
doctorRoutes.get('/:doctorId', getDoctor)

// update doctor data
doctorRoutes.patch('/:uid', updateDoctorByUid)

// delete doctor
doctorRoutes.delete('/delete_doctor/:id', deleteDoctorById)