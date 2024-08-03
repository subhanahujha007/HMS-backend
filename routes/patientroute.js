import express from 'express';
const router = express.Router();
import  { createPatient, getPatients, getPatientById, updatePatient, deletePatient } from '../Controllers/patientcontroller.js'

// Create a new patient
router.post('/add', createPatient);

// Get all patients
router.get('/', getPatients);

// Get a patient by ID
router.get('/:id', getPatientById);

// Update a patient
router.put('/:id', updatePatient);

// Delete a patient
router.delete('/:id', deletePatient);

export default router