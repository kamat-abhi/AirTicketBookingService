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
            const flight = await axios.get(getFlightRequestURL);
            console.log(flight);
            return flight;

        } catch (error) {
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;