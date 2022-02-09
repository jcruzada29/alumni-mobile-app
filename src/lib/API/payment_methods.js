import request from './request';

export default {
	async getPaymentMethods() {
		const res = await request.get('/app/payment-methods', {});
		return res;
	}
};
