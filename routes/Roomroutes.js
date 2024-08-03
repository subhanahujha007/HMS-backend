
import express from 'express';
import {createRoom,getAllRooms,getRoomById ,updateRoom,deleteroom } from "../Controllers/Roomcontroller.js"


const router=express.Router()
// Route to create a new room
router.post('/add', createRoom);

// Route to get all rooms
router.get('/', getAllRooms);

// Route to get a single room by ID
router.get('/:id', getRoomById);

router.put('/update/:id', updateRoom);
router.delete('/:id', deleteroom);

export default router;
