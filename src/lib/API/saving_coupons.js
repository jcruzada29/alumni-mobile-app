import request from './request';

export default {
	async getCoupons() {
		const response = await request.get('/app/savings/coupons');
		return response;
	},
	async getCouponById({ id }) {
		const response = await request.get(`/app/savings/coupons/id?id=${id}`);
		return response;
	},
	async redeemCouponByUser(body) {
		const response = await request.post('/app/savings/coupons/redeem', body)
		return response;
	}
};
