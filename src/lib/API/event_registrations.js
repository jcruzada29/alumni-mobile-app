import request from './request';

export default {
	async updateEventRegistrationById({ id, body }) {
		const res = await request.patch(`/app/event-registrations/id?id=${id}`, body);
		return res;
	}
};
