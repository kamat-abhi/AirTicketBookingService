const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../service/index');

const bookingService = new BookingService();

const create = async(req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            message: 'Booking created successfully',
            success: true,
            data: response.data,
            err: {}
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            message: 'error.message',
            success: false,
            err: error.explanation,
            data: {}
        });
    }
    
}


module.exports = {
    create
}
