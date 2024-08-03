
import Room from "../model/Room.model.js";
import { asyncHandler } from "../utils/Asynchandler.js";

export const createRoom = asyncHandler(async (req, res) => {
    try {
      const { roomNumber, floorNumber, isOperational } = req.body; // Extract isOperational from the request body
      const admin = req.admin;
  
      if (!admin) {
        return res.status(401).json({ message: "Unauthorized: Admin not found" });
      }
  
      const room = new Room({
        roomNumber,
        floorNumber,
        isOperational, // Add the operational status to the room data
        admin: admin._id,
      });
  
      await room.save();
      res.status(201).json({ message: "Room created successfully", room });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  

export const getAllRooms = asyncHandler(async (req, res) => {
  try {
    const rooms = await Room.find().populate('admin', 'username email'); // Populate admin details if needed

    res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export const getRoomById = asyncHandler(async (req, res) => {
  try {
    const roomId = req.params.id;
    
    const room = await Room.findById(roomId).populate('admin', 'username email'); // Populate admin details if needed

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
})
export const updateRoom = asyncHandler(async (req, res) => {
    try {
      const roomId = req.params.id;
      const { roomNumber, floorNumber, isOperational } = req.body;
  
      const room = await Room.findById(roomId);
  console.log(room)
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      room.roomNumber = roomNumber || room.roomNumber;
      room.floorNumber = floorNumber || room.floorNumber;
      room.isOperational = isOperational !== undefined ? isOperational : room.isOperational;
  
      await room.save();
  
      res.status(200).json({ message: 'Room updated successfully', room });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  export const deleteroom = asyncHandler(async (req, res) => {
    try {
      const roomid = req.params.id;
      
      // Find and delete the bed
      const room = await Room.findByIdAndDelete(roomid);
  console.log(room)
      if (!room) {
        return res.status(404).json({ message: 'room not found' });
      }
  
      res.status(200).json({ message: 'room deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  