import request from './request';

export default {
	async login(body) {
		const response = await request.post('/app/auth/login', body);
		return response;
	},
	async logout() {
		const res = await request.post('/app/auth/logout');
		return res;
	},
	async getLegacyCasUrl() {
		const res = await request.get('/app/auth/legacy-cas/url'); 
		return res;
	},
	async submitLegacyCasAuth(body){
		const res = await request.post('/app/auth/legacy-cas/auth', body); 
		return res;
	}
};
