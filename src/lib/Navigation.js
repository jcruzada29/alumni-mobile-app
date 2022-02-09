import { Actions } from 'react-native-router-flux';
import API from './API';



// navigation helper for redirect in service types, such as in notification when clicked.
const NavigationHelper = {
	// { event_id, coupon_id, parking_id, highlight_id, news_id, push_notification_id, popup_id }
	async navigateByNotification({ notification, getNotifications }) {
		this.markAsRead({ notification, getNotifications });
		const { type, data } = notification;

		// no need to handle onclick
		if (!data) {
			return;
		}

		if (type === 'event' && data.event_id) {
			Actions.happeningDetailPage({ eventId: data.event_id });
			return;
		}

		if (type === 'coupon' && data.coupon_id) {
			Actions.savingsPage({activeTab: 2});
			return;
		}

		if (type === 'parking' && data.parking_id) {
			Actions.parkingPage();
			return;
		}

		if (type === 'news' && data.news_id) {
			Actions.newsDetailPage({ newsId: data.news_id });
			return;
		}

		if (type === 'highlight' && data.highlight_id) {
			// Update highlight navigation before enabling
			// Actions.highlightDetailPage({ highlightId: data.highlight_id });
			
		}

	},

	async markAsRead({ notification, getNotifications }) {
		if(!notification.read_at) {
			const res = await API.notifications.markNotificationAdReadById(notification._id);
			getNotifications();
			console.log(res);
		}
	}

};

export default NavigationHelper;