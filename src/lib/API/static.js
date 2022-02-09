import request from './request';

export default {
	async userPrivacyPolicy() {
		const res = await request.get('/app/static/privacy');
		return res;
	}
};
