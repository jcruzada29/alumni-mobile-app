import request from './request';

export default {
	async getOnboardingScreens(query) {
		const res = await request.get('/app/onboarding-screens', query);
		return res;
	}
};
