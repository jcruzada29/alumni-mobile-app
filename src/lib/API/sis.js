import request from './request';

export default {
	async getCountries() {
		const response = await request.get('/app/sis/countries');
		return response;
	}
};
