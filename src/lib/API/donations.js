import request from './request';

export default {
	async getDonations() {
		const response = await request.get('/app/donation-projects');
		return response;
	},
	async getDonationsById({id, lang}) {
		const response = await request.get(`/app/donation-projects/id?id=${id}&lang=${lang}`);
		return response;
	},
	async getDonationProjectHtmlById({id, lang}) {
		const response = await request.get(`/app/donation-projects/id/html?id=${id}&lang=${lang}`);
		return response;
	}
	
};
