const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../service/index');
const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');

const bookingService = new BookingService();

class BookingController{

    async sendMessageToQueue(req, res) {
        const channel = await createChannel();
        const payload = {message: "Success"};
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'successfully published the event'
        })
    }

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