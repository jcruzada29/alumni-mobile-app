import request from './request';

export default {
	async getJobs(query) {
		const res = await request.get('/app/jobs', query);
		return res;
	},
	async getJobById(id) {
		const res = await request.get(`/app/jobs/id?id=${id}`);
		return res;
	}
};
