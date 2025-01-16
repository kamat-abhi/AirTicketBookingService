const axios = require('axios');

const {BookingRepository} = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors/index');
const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');

class BookingService {
    constructor() {
        this.bookingRepository =  new BookingRepository();
    }

    
    async sendMessageToQueue() {
        const channel = await createChannel();
        const payload = {
            data: {
                mailFrom: 'abhishekkamat147@admin.com',
                mailTo: 'contact.this.developer@gmail.com',
                mailSubject: 'TICKET CONFIRRMATION',
                mailBody: 'Hey, your ticket is confirmed'
            },
            service: 'SEND_BASIC_MAIL'
        }
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        
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
            const finalBooking = await this.bookingRepository.updateBooking(booking.id, {status: "Booked"});
            this.sendMessageToQueue();
            return finalBooking;

        } catch (error) {
            if(error.name === 'RepositoryError' || error.name === 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;