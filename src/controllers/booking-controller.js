const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../service/index');
const { BookingRepository} = require('../repository/index')

const bookingService = new BookingService();
const bookingRepository = new BookingRepository();
const create = async(req, res) => {
    try {
        const response = await bookingRepository.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            message: 'Booking created successfully',
            success: true,
            data: response,
            err: {}
        });
    } catch (error) {
        console.log("abhi",error);
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {}
        });
    }
    
}


module.exports = {
    create
}
