import request from './request';

export default {
	async getHighlights(query) {
		const res = await request.get('/app/highlights', query);
		return res;
	}
};
