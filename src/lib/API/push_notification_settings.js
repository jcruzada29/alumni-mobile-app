import request from './request';

export default {
	async getPushNotificationSettings() {
		const response = await request.get('/app/push-notification-settings');
		return response;
	},
	async updatePushNotificationSettingById(id, push_notification_setting) {
		const response = await request.patch(`/app/push-notification-settings/id?id=${id}`, { push_notification_setting });
		return response;
	}
};
