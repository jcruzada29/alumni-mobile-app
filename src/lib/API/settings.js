import request from './request';

export default {
	async getHomeScreenIcons() {
		const res = await request.get('/app/settings/home-screen');
		return res;
	},
	async getSystemStatus() {
		const res = await request.get('/app/settings/system-status');
		return res;
	},
	async getSupportedVersions() {
		const res = await request.get('/app/settings/supported-versions');
		return res;
	}
};
