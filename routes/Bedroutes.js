// routes/bedRoutes.js
import express from 'express';
import { createBed, getAllBeds, getBedById, updateBed, deleteBed } from '../Controllers/Bedcontrollers.js';
import { verifyJWT } from '../middleware/verify-jwt.js';

const router = express.Router();

// Route to create a new bed
router.post('/add', verifyJWT, createBed);

// Route to get all beds
router.get('/', verifyJWT, getAllBeds);

// Route to get a single bed by ID
router.get('/:id', verifyJWT, getBedById);

// Route to update a bed
router.put('/:id', verifyJWT, updateBed);

// Route to delete a bed
router.delete('/:id', verifyJWT, deleteBed);

export default router;
