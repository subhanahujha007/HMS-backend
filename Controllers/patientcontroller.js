import {asyncHandler} from '../utils/Asynchandler.js';
import Bed from '../model/Bed.model.js'; // Adjust the import path as necessary
import Patient from '../model/Patient.model.js'; // Adjust the import path as necessary

export const createPatient = asyncHandler(async (req, res) => {
    const { name, age, gender, bed, disease, floorno } = req.body;
    const admin = req.admin;
    
    if (!name || !age || !gender || !bed || !disease || !floorno) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Check if bed exists
    const bedExists = await Bed.findById(bed);
    if (!bedExists) {
      return res.status(404).json({ message: 'Bed not found' });
    }
  
    // Check if the bed is already occupied
    if (bedExists.status !== 'available') {
      return res.status(400).json({ message: 'Bed is already occupied' });
    }
  
    // Create patient
    const patient = await Patient.create({
      name,
      age,
      gender,
      bed,
      disease,
      floorno: parseInt(floorno, 10), // Ensure correct field name and type
      admin: admin._id // Assuming you have user authentication and req.admin contains the logged-in user
    });
  
    // Update bed status to occupied
    bedExists.status = 'occupied';
    await bedExists.save();
  
    res.status(201).json(patient);
  });
  

// Get all patients
export const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find().populate('bed', 'bedNumber roomNumber status'); // Populate bed details
  res.status(200).json(patients);
});

// Get a patient by ID
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate('bed', 'bedNumber roomNumber status');
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.status(200).json(patient);
});

export const updatePatient = asyncHandler(async (req, res) => {
    const { name, age, gender, bed, disease, floorno, status } = req.body;
    const { id } = req.params;
  
    // Find the patient by ID
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
  
    // Handle status change logic
    if (status && status !== patient.status) {
      if (status === 'discharged') {
        // If patient is being discharged, make the bed available again
        const oldBed = await Bed.findById(patient.bed);
        if (oldBed) {
          oldBed.status = 'available';
          await oldBed.save();
        }
      }
    }
  
    // Check if the new bed exists and is available
    if (bed) {
      const newBed = await Bed.findById(bed);
      if (!newBed) {
        return res.status(404).json({ message: 'Bed not found' });
      }
  
      if (newBed.status !== 'available' && newBed._id.toString() !== patient.bed.toString()) {
        return res.status(400).json({ message: 'New bed is already occupied' });
      }
  
      // If the bed is different from the current one, update the old bed status
      if (newBed._id.toString() !== patient.bed.toString()) {
        const oldBed = await Bed.findById(patient.bed);
        if (oldBed) {
          oldBed.status = 'available';
          await oldBed.save();
        }
        newBed.status = 'occupied';
        await newBed.save();
      }
    }
  
    // Update patient details
    patient.name = name || patient.name;
    patient.age = age || patient.age;
    patient.gender = gender || patient.gender;
    patient.bed = bed || patient.bed;
    patient.disease = disease || patient.disease;
    patient.floorno = floorno || patient.floorno;
    patient.status = status || patient.status;
  
    await patient.save();
  
    res.status(200).json(patient);
  });
  

// Delete a patient
export const deletePatient = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get patient ID from request parameters
  
    // Find the patient by ID
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
  
    // Find the associated bed
    const bed = await Bed.findById(patient.bed);
    if (bed) {
      // Update the bed status to 'available'
      bed.status = 'available';
      await bed.save();
    }
  
    // Delete the patient
    await Patient.findByIdAndDelete(id);
  
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
  

