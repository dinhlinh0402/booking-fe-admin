import requestClient from "../RequestClient";

const BookingApis = {
  getBookings(params) {
    const urlParam = 'bookings';

    return requestClient.get(urlParam, { params });
  },

  updateBooking(data, bookingId) {
    const urlParam = `bookings/${bookingId}`;

    return requestClient.put(urlParam, data);
  }
};


export default BookingApis;
