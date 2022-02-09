import request from './request';

export default {
	async getAssetFileById(id) {
		const res = await request.get(`/app/assets/id?asset_id=${id}`);
		return res;
	}
};
