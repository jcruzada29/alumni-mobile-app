import request from './request';

export default {
	async getCampusOffers() {
		const response = await request.get('/app/campus-offers');
		return response;
	}
};
