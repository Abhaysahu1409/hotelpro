import { Router, Request, Response } from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  toggleRoomAvailability,
  checkRoomDateConflict,
} from '../db';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/rooms - Get all rooms with optional filtering, search, and date-availability check
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search,
      type,
      minPrice,
      maxPrice,
      guests,
      amenity,
      checkIn,
      checkOut,
      sort,
    } = req.query;

    let rooms = await getAllRooms({
      search: search ? String(search) : undefined,
      type: type ? String(type) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      guests: guests ? Number(guests) : undefined,
      amenity: amenity ? String(amenity) : undefined,
    });

    // Check date availability if dates are provided
    if (checkIn && checkOut) {
      const cIn = String(checkIn);
      const cOut = String(checkOut);

      const roomsWithAvailability = await Promise.all(
        rooms.map(async (room) => {
          const hasConflict = await checkRoomDateConflict(room.id, cIn, cOut);
          return {
            ...room,
            isAvailableForDates: !hasConflict && room.isAvailable,
          };
        })
      );
      rooms = roomsWithAvailability;
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          rooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
          break;
        case 'price-desc':
          rooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
          break;
        case 'rating-desc':
          rooms.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
        default:
          rooms.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve rooms: ' + error.message,
    });
  }
});

// GET /api/rooms/:id - Get single room with optional check-in/out conflict check
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;
    const room = await getRoomById(id);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found',
      });
      return;
    }

    let isAvailableForDates = room.isAvailable;
    if (checkIn && checkOut) {
      const hasConflict = await checkRoomDateConflict(room.id, String(checkIn), String(checkOut));
      isAvailableForDates = !hasConflict && room.isAvailable;
    }

    res.json({
      success: true,
      room: {
        ...room,
        isAvailableForDates,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve room details: ' + error.message,
    });
  }
});

// POST /api/rooms - Create new room (Admin only)
router.post('/', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const {
      roomNumber,
      title,
      type,
      pricePerNight,
      capacity,
      sizeSqFt,
      view,
      floor,
      description,
      amenities,
      images,
      isFeatured,
      isAvailable,
    } = req.body;

    if (!roomNumber || !title || !type || !pricePerNight || !description) {
      res.status(400).json({
        success: false,
        message: 'Room number, title, type, price per night, and description are required.',
      });
      return;
    }

    const newRoom = await createRoom({
      roomNumber: String(roomNumber).trim(),
      title: String(title).trim(),
      type: String(type).trim(),
      pricePerNight: Number(pricePerNight),
      capacity: capacity || { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      sizeSqFt: Number(sizeSqFt) || 400,
      view: view || 'City View',
      floor: Number(floor) || 1,
      description: String(description).trim(),
      amenities: Array.isArray(amenities) && amenities.length > 0 ? amenities : ['High-speed Wi-Fi', 'Smart TV', 'Room Service'],
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      ],
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: Boolean(isFeatured),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    });

    res.status(201).json({
      success: true,
      message: `Room ${newRoom.roomNumber} created successfully!`,
      room: newRoom,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create room: ' + error.message,
    });
  }
});

// PUT /api/rooms/:id - Update room (Admin only)
router.put('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await updateRoom(id, updateData);
    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Room not found for update.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Room updated successfully!',
      room: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update room: ' + error.message,
    });
  }
});

// DELETE /api/rooms/:id - Delete room (Admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteRoom(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Room not found for deletion.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Room successfully removed from inventory.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete room: ' + error.message,
    });
  }
});

// PATCH /api/rooms/:id/toggle - Toggle availability (Admin only)
router.patch('/:id/toggle', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await toggleRoomAvailability(id);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
      return;
    }

    res.json({
      success: true,
      message: `Room status changed to ${updated.isAvailable ? 'Available' : 'Unavailable'}.`,
      room: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle room availability: ' + error.message,
    });
  }
});

export default router;
