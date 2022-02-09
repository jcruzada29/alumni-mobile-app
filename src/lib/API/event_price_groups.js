import request from './request';

export default {
	async getEventPriceGroupByEventId({ event_id }) {
		const res = await request.get(`/app/event-price-groups?event_id=${event_id}`);
		return res;
	}
};
