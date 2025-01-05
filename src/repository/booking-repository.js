const { StatusCodes} = require('http-status-codes');

const { Booking } = require('../models/index');
const { AppError, ValidationError} = require('../utils/errors/index');


class BookingRepository {
    async createBooking(data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Error creating booking',
                'there was some issue creating the booking , please try again later',
                 StatusCodes.INTERNAL_SERVER_ERROR, error);
        }
    }

    async getBookingById(id) {
        try {
            const booking = await Booking.findByPk(id);
            return booking;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Error creating booking',
                'there was some issue creating the booking , please try again later',
                 StatusCodes.INTERNAL_SERVER_ERROR, error);
        }
    }

    async updateBooking(id, data) {
        try {
            const booking = await Booking.findByPk(id);
            await booking.update(data);
            return booking;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Error creating booking',
                'there was some issue creating the booking , please try again later',
                 StatusCodes.INTERNAL_SERVER_ERROR, error);
        }
    }

    async deleteBooking(id) {
        try {
            const booking = await Booking.findByPk(id);
            
            await booking.destroy();
            return booking;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Error creating booking',
                'there was some issue creating the booking , please try again later',
                 StatusCodes.INTERNAL_SERVER_ERROR, error);
        }
    }
}

module.exports = BookingRepository;