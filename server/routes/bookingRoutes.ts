import { Router, Response } from 'express';
import {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getRoomById,
  checkRoomDateConflict,
} from '../db';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/bookings - Book a room (Auth required)
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guestDetails,
      guestsCount,
      paymentMethod,
    } = req.body;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!roomId || !checkInDate || !checkOutDate) {
      res.status(400).json({
        success: false,
        message: 'Room selection, check-in date, and check-out date are required.',
      });
      return;
    }

    const room = await getRoomById(roomId);
    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Selected room could not be found.',
      });
      return;
    }

    if (!room.isAvailable) {
      res.status(400).json({
        success: false,
        message: 'This room is currently out of service or maintenance.',
      });
      return;
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date format.',
      });
      return;
    }

    if (checkOut <= checkIn) {
      res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.',
      });
      return;
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    if (nights < 1) {
      res.status(400).json({
        success: false,
        message: 'A minimum stay of 1 night is required.',
      });
      return;
    }

    // Check date overlap conflict
    const hasConflict = await checkRoomDateConflict(roomId, checkInDate, checkOutDate);
    if (hasConflict) {
      res.status(409).json({
        success: false,
        message: 'This room is already reserved for the chosen dates. Please pick alternative dates or another room.',
      });
      return;
    }

    // Calculate transparent pricing in INR (₹)
    const roomRate = room.pricePerNight;
    const subtotal = roomRate * nights;
    const taxAmount = Math.round(subtotal * 0.12 * 100) / 100; // 12% GST
    const serviceFee = 750; // ₹750 standard hotel cleaning & concierge service fee
    const totalAmount = Math.round((subtotal + taxAmount + serviceFee) * 100) / 100;

    const booking = await createBooking({
      userId: req.user.id,
      roomId: room.id,
      roomDetails: {
        title: room.title,
        roomNumber: room.roomNumber,
        type: room.type,
        pricePerNight: room.pricePerNight,
        image: room.images[0] || '',
      },
      guestDetails: {
        fullName: guestDetails?.fullName || req.user.name || 'Valued Guest',
        email: guestDetails?.email || req.user.email,
        phone: guestDetails?.phone || '',
        specialRequests: guestDetails?.specialRequests || '',
      },
      checkInDate,
      checkOutDate,
      nights,
      guestsCount: guestsCount || { adults: 1, children: 0 },
      pricing: {
        roomRate,
        subtotal,
        taxAmount,
        serviceFee,
        totalAmount,
      },
      paymentMethod: paymentMethod === 'Pay at Hotel' ? 'Pay at Hotel' : 'Credit Card',
      paymentStatus: paymentMethod === 'Pay at Hotel' ? 'Pending' : 'Paid',
      status: 'Confirmed',
    });

    res.status(201).json({
      success: true,
      message: `Reservation confirmed! Reference: ${booking.bookingReference}`,
      booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to process booking: ' + error.message,
    });
  }
});

// GET /api/bookings/my - Get user's bookings
router.get('/my', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const bookings = await getBookingsByUser(req.user.id);
    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your bookings: ' + error.message,
    });
  }
});

// GET /api/bookings/:id - View single booking
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Reservation not found' });
      return;
    }

    // Check ownership or admin
    if (req.user?.role !== 'admin' && booking.userId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this reservation' });
      return;
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking: ' + error.message,
    });
  }
});

// PATCH /api/bookings/:id/cancel - Cancel reservation
router.patch('/:id/cancel', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'admin';
    const result = await cancelBooking(id, req.user?.id, isAdmin);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json({
      success: true,
      message: 'Reservation has been successfully cancelled.',
      booking: result.booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel reservation: ' + error.message,
    });
  }
});

// GET /api/bookings/admin/all - Admin: view all bookings
router.get('/admin/all', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    let bookings = await getAllBookings();

    if (status && status !== 'all') {
      bookings = bookings.filter((b) => b.status.toLowerCase() === String(status).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.bookingReference.toLowerCase().includes(q) ||
          b.guestDetails.fullName.toLowerCase().includes(q) ||
          b.guestDetails.email.toLowerCase().includes(q) ||
          b.roomDetails.title.toLowerCase().includes(q) ||
          b.roomDetails.roomNumber.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin bookings: ' + error.message,
    });
  }
});

// PATCH /api/bookings/admin/:id/status - Admin: update status
router.patch('/admin/:id/status', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Confirmed', 'Cancelled', 'Completed'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Confirmed, Cancelled, or Completed.',
      });
      return;
    }

    const updated = await updateBookingStatus(id, status);
    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Reservation not found for status update.',
      });
      return;
    }

    res.json({
      success: true,
      message: `Reservation status changed to ${status}.`,
      booking: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status: ' + error.message,
    });
  }
});

export default router;
