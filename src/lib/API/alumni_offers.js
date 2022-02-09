import request from './request';

export default {
	async getAlumniOffers() {
		const response = await request.get('/app/alumni-offers');
		return response;
	}
};
