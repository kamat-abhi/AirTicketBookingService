const axios = require('axios');

const {BookingRepository} = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors/index')

class BookingService {
    constructor() {
        this.bookingRepository =  new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            const priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError("Something went wrong in booking service", 'Insufficient seats');
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.createBooking(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            console.log(booking);
            return booking;

        } catch (error) {
            if(error.name === 'RepositoryError' || error.name === 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;