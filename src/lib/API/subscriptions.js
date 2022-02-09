import request from './request';

export default {
	async getSubscriptions(query) {
		const response = await request.get('/app/subscriptions', query);
		return response;
	},
	async getSubscriptionById(id) {
		const response = await request.get(`/app/subscriptions/id?id=${id}`);
		return response;
	},
	async newSubscription(body) {
		const response = await request.post('/app/subscriptions/subscribe', body);
		return response;
	},
	async verifySubscription(body) {
		const response = await request.post('/app/subscriptions/verify', body);
		return response;
	},
	async getPaymentMethods() {
		const response = await request.get('/app/subscriptions/payment-methods');
		return response;
	}
};
