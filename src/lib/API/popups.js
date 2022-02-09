import request from './request';

export default {
	async getPopups() {
		const response = await request.get('/app/pop-ups');
		return response;
	},
	async logPopupWhenClosed(id) {
		const response = await request.post(`/app/pop-ups/id/read?id=${id}`);
		return response;
	}
};
