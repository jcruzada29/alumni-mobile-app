import { AsyncStorage } from 'react-native';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import request from './request';


export default {
	async getEvents(query) {
		const user_id = await this.getUserId();
		const res = await request.get('/app/events', {...query, ...(user_id && { user_id })});
		return res;
	},
	async getEventById(id) {
		const user_id = await this.getUserId();
		const res = await request.get(`/app/events/id?id=${id}&user_id=${user_id}`);
		return res;
	},
	async joinEventById({ id, body}) {
		const res = await request.post(`/app/events/join/id?id=${id}`, body);
		return res;
	},
	async getUserId(){
		const user_id = await AsyncStorage.getItem(AsyncStorageKeys.USER_ID);
		return user_id;
	},
	async getPaymentMethods() {
		const res = await request.get('/app/events/payment-methods', {});
		return res;
	}
};
