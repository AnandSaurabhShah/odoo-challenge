import { bookingIdSchema, cancelBookingSchema, createBookingSchema } from "../../validators/booking/booking.validator.js";
import { cancelBooking, createBooking, listBookings } from "../../services/bookings/booking.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export async function index(req, res, next) {
  try {
    const result = await listBookings(req.query);

    return sendSuccess(res, {
      data: result.items,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function store(req, res, next) {
  try {
    const data = createBookingSchema.parse(req.body);
    const bookedById = req.user.id;
    const booking = await createBooking(data, bookedById);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Resource booked successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancel(req, res, next) {
  try {
    const { id: bookingId } = bookingIdSchema.parse(req.params);
    const data = cancelBookingSchema.parse(req.body);
    const booking = await cancelBooking(bookingId, req.user.id, req.user.role, data);

    return sendSuccess(res, {
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}
