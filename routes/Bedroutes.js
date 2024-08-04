import express from 'express';
import { createBed, getAllBeds, getBedById, updateBed, deleteBed } from '../Controllers/Bedcontrollers.js';
import { verifyJWT } from '../middleware/verify-jwt.js';

const router = express.Router();


router.post('/add', verifyJWT, createBed);

router.get('/', verifyJWT, getAllBeds);


router.get('/:id', verifyJWT, getBedById);


router.put('/:id', verifyJWT, updateBed);


router.delete('/:id', verifyJWT, deleteBed);

export default router;
