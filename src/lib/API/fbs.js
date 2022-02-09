import request from './request';

export default {
	async getFBSStatus() {
		const res = await request.get('/app/fbs/status');
		return res;
	},
	async getFacilities(query) {
		const res = await request.get('/app/fbs/facilities', query);
		return res;
	},
	async getFacilityTypes(query) {
		const res = await request.get('/app/fbs/facility-types', query);
		return res;
	},
	async getFacilityTimeslots(query) {
		const res = await request.get('/app/fbs/facility-timeslots', query);
		return res;
	},
	async getBookingInformation(query){
		const res = await request.get('/app/fbs/bookings', query);
		return res;
	},
	async makeBooking(booking){
		const res = await request.post('/app/fbs/bookings', { booking });
		return res;
	},
	async cancelBookingById(id){
		const res = await request.post(`/app/fbs/bookings/id/cancel?id=${id}`);
		return res;
	}
};
