import request from './request';

export default {
	async getTransactionById(id) {
		const res = await request.get(`/app/transactions/id?id=${id}`);
		return res;
	},
	async createNewTransaction({ id }) {
		const res = await request.post(`/app/transactions/id?id=${id}`);
		return res;
	},
	async status(id) {
		const res = await request.post(`/app/transactions/id/status?id=${id}`);
		return res;
	}
};
