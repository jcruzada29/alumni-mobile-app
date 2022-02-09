import request from './request';

export default {
	async getNews(query) {
		const res = await request.get('/app/news', query);
		return res;
	},
	async getNewsById(id) {
		const res = await request.get(`/app/news/id?id=${id}`);
		return res;
	}
};
