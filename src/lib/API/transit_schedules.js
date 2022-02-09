import request from './request';

export default {
	async getTransitSchedules(query) {
		const res = await request.get('/app/transit-schedules', query);
		return res;
	}
};
