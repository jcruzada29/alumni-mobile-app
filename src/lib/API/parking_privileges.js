import request from './request';

export default {
	async getParkingPrivileges() {
		const response = await request.get('/app/parking-privileges');
		return response;
	},
	async useParkingPrivilege(body) {
		const response = await request.post('/app/parking-privileges', body)
		return response;
	}
};
