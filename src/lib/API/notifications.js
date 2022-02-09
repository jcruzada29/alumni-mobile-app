import request from './request';

export default {
	async getNotifications(query) {
		const res = await request.get('/app/notifications', query);
		return res;
	},
	async getNotificationById(id) {
		const res = await request.get(`/app/notifications/id?id=${id}`);
		return res;
	},
	async markNotificationAdReadById(id) {
		const res = await request.post(`/app/notifications/id/read?id=${id}`);
		return res;
	}
};
