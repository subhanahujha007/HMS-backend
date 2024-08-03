import { asyncHandler } from "../utils/Asynchandler.js";
import Room from "../model/Room.model.js";
import Bed from "../model/Bed.model.js";


export const createBed = asyncHandler(async (req, res) => {
    try {
      const { bedNumber, roomNumber, status, floorNumber } = req.body; // Ensure this matches the request payload
      const admin = req.admin;
  
      // Ensure floorNumber and roomNumber are integers
      const parsedFloorNumber = parseInt(floorNumber, 10);
      const parsedRoomNumber = parseInt(roomNumber, 10);
  
      if (isNaN(parsedFloorNumber) || isNaN(parsedRoomNumber)) {
        return res.status(400).json({ message: 'Invalid floor number or room number' });
      }
  
      // Find all rooms with the given roomNumber
      const rooms = await Room.find({ roomNumber: parsedRoomNumber });
  
      console.log("Retrieved rooms:", rooms); // Log retrieved rooms for debugging
  
      if (rooms.length === 0) {
        return res.status(404).json({ message: 'No rooms with the specified room number exist' });
      }
  
      // Check if any room has the matching floorNumber
      const matchingRoom = rooms.find(room => room.floorNumber === parsedFloorNumber);
  
      if (!matchingRoom) {
        return res.status(404).json({ message: 'No room with the specified floor number exists' });
      }
      if(matchingRoom.isOperational!=='operational'){
        return res.status(404).json({message:"this room is non-oprational"})
      }
  
      // Create and save the bed
      const newBed = new Bed({
        bedNumber,
        room: matchingRoom._id,
        floorNumber: parsedFloorNumber,
        status,
        roomNumber:roomNumber,
        admin
      });
      await newBed.save();
      matchingRoom.beds.push(newBed._id);
      await matchingRoom.save();
      res.status(201).json({ message: 'Bed created successfully', bed: newBed });
    } catch (error) {
      console.error('Error creating bed:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  
  

export const getAllBeds = asyncHandler(async (req, res) => {
  try {
    const beds = await Bed.find();
    res.status(200).json({ beds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get bed by ID
export const getBedById = asyncHandler(async (req, res) => {
  try {
    const bedId = req.params.id;
    const bed = await Bed.findById(bedId);

    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    res.status(200).json({ bed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update bed
export const updateBed = asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;
      const { bedNumber, roomNumber, floorNumber, status } = req.body;
  
      const bed = await Bed.findById(id);
  
      if (!bed) {
        return res.status(404).json({ message: 'Bed not found' });
      }
  
      bed.bedNumber = bedNumber || bed.bedNumber;
      bed.roomNumber = roomNumber || bed.roomNumber;
      bed.floorNumber = floorNumber || bed.floorNumber;
      bed.status = status || bed.status;
  
      await bed.save();
  
      res.status(200).json({ message: 'Bed updated successfully', bed });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

// Delete bed
export const deleteBed = asyncHandler(async (req, res) => {
  try {
    const bedId = req.params.id;
    const bed = await Bed.findByIdAndDelete(bedId);

    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    res.status(200).json({ message: 'Bed deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});
