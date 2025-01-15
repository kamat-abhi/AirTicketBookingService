const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../service/index');
const { createChannel } = require('../utils/messageQueue');

const bookingService = new BookingService();

class BookingController{
    async create(req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message: 'Booking created successfully',
                success: true,
                data: response,
                err: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                err: error.explanation,
                data: {}
            });
        }
        
    }
}

module.exports = BookingController;