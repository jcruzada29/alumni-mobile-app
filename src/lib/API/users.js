import request from './request';

export default {
	async getMe(query) {
		const res = await request.get('/app/users/me', query);
		return res;
	},
	async updateMe(user) {
		const res = await request.patch('/app/users/me', { user });
		return res;
	},
	async ecards() {
		const res = await request.get('/app/users/me/ecards');
		return res;
	},
	async updatePreferredEmail(body) {
		const res = await request.patch('/app/users/me/preferred-email', body);
		return res;
	},
	async uploadPhoto({ photo }) {
		const res = await request.put('/app/users/me/photo', { photo });
		return res;
	},
	async updatePushToken(body) {
		const res = await request.put('/app/users/me/push-token', body);
		return res;
	}
};
