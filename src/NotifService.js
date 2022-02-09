import React from 'react';
import { View, Platform, AsyncStorage } from 'react-native';
import _ from 'lodash';
import  { Notifications } from 'react-native-notifications';
import { Actions, ActionConst } from 'react-native-router-flux';
import AliyunPush from 'react-native-aliyun-push';
import AsyncStorageKeys from './constants/AsyncStorageKeys';
import config from './config';

export default class NotifService extends React.Component {
	// constructor(props){
	// 	super(props);
	// 	Notifications.registerRemoteNotifications();

	// 	Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
	// 		// TODO: Send the token to my server so it could send back push notifications...
	// 		console.log("Device Token Received", event.deviceToken);
	// 	});
	// 	Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
	// 		console.error(event);
	// 	});
	// }

	async componentDidMount() {
		if (Platform.OS === 'ios') {
			this.registerDevice();
			this.registerIosNotificationEvents();
		}
		if (Platform.OS === 'android' && config.locale === 'world') {
			this.registerDevice();
			this.registerAndroidNotificationEvents();
		}
		if (Platform.OS === 'android' && config.locale === 'cn'){
			await this.registerAndroidDevice();
			AliyunPush.addListener(this.handleAliyunPushMessage);
		}
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			// 移除监听
			AliyunPush.removeListener(this.handleAliyunPushMessage);

			// 也可以用移除全部监听
			// AliyunPush.removeAllListeners()
		}
	}

	handleAliyunPushMessage = (e) => {
		console.log(`Message Received. ${JSON.stringify(e)}`);

		// e结构说明:
		// e.type: "notification":通知 或者 "message":消息
		// e.title: 推送通知/消息标题
		// e.body: 推送通知/消息具体内容
		// e.actionIdentifier: "opened":用户点击了通知, "removed"用户删除了通知, 其他非空值:用户点击了自定义action（仅限ios）
		// e.extras: 用户附加的{key:value}的对象
		const localNotification = Notifications.postLocalNotification({
			body: _.get(e, 'body', ''),
			title: _.get(e, 'title', ''),
			// sound: 'chime.aiff',
			silent: false
			// category: 'SOME_CATEGORY',
			// userInfo: { }
		});

	};

	registerAndroidDevice = async() => {
		await AliyunPush.getDeviceId()
			.then(async (deviceId)=>{
				console.log({ deviceId });
				if (deviceId) {
					await AsyncStorage.setItem(AsyncStorageKeys.PUSH_TOKEN, deviceId);
				}
			})
			.catch((error)=>{
				console.log('getDeviceId() failed, ERROR: ', error);
			});
	}

	registerDevice = () => {
		Notifications.registerRemoteNotifications();
		console.log('register event');
		Notifications.events().registerRemoteNotificationsRegistered(async event => {
			console.log('Device Token Received', event.deviceToken);
			if (event.deviceToken) {
				await AsyncStorage.setItem(AsyncStorageKeys.PUSH_TOKEN, event.deviceToken);
			}
		});
		Notifications.events().registerRemoteNotificationsRegistrationFailed(event => {
			console.log('fail to register - ', event);
		});

		Notifications.registerRemoteNotifications();
	}

	registerAndroidNotificationEvents = () => {
		Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
			console.log('Notification Received - Foreground', notification);
			// Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
			if(notification) {
				const title  = _.get(notification, ['payload', 'gcm.notification.title']);
				const body  = _.get(notification, ['payload', 'gcm.notification.body']);
				Notifications.postLocalNotification({ body, title, ...(notification.payload) }, 1);
			}
			completion({ alert: true, sound: false, badge: false });
		});

		// not working on android (background)
		Notifications.events().registerNotificationOpened((notification, completion) => {
			console.log('Notification opened by device user', notification);
			console.log(`Notification opened with an action identifier: ${notification.identifier}`);
			const { coupon_id, event_id, parking_id, news_id } = _.get(notification, 'payload');
			if (event_id && event_id !== undefined) {
				Actions.happeningDetailPage({ eventId: event_id });
			} if (coupon_id && coupon_id !== undefined) {
				Actions.notificationsPage();
			} if (parking_id && parking_id !== undefined) {
				Actions.parkingPage();
			} if (news_id && news_id !== undefined) {
				Actions.newsDetailPage({ newsId: news_id});
			}
			completion();
		});

		Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
			console.log('Notification Received - Background', notification);

			// Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
			completion({ alert: true, sound: true, badge: false });
		});

		Notifications.getInitialNotification()
			.then(async notification => {
				console.log('Initial notification was:', notification || 'N/A');
				if (notification) {
					// even app will killed will also work here for IOS and ANDROID.
					// kinda dirty fix. registerNotificationOpened() not working on Android (background)
					await new Promise(resolve => setTimeout(resolve, 3000));
					const { coupon_id, event_id, parking_id, news_id } = _.get(notification, 'payload');
					if (event_id) {
						await AsyncStorage.setItem(AsyncStorageKeys.PUSH_NOTIFICATION_ID, JSON.stringify({event_id}));
					} if (coupon_id) {
						await AsyncStorage.setItem(AsyncStorageKeys.PUSH_NOTIFICATION_ID, JSON.stringify({coupon_id}));
					} if (parking_id) {
						await AsyncStorage.setItem(AsyncStorageKeys.PUSH_NOTIFICATION_ID, JSON.stringify({parking_id}));
					} if (news_id) {
						await AsyncStorage.setItem(AsyncStorageKeys.PUSH_NOTIFICATION_ID, JSON.stringify({news_id}));
					}
				}
			})
			.catch(err => console.error('getInitialNotifiation() failed', err));
	}

	registerIosNotificationEvents = () => {
		Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
			console.log('Notification Received - Foreground', notification);
			// Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
			completion({ alert: true, sound: false, badge: false });
		});

		// not working on android (background)
		Notifications.events().registerNotificationOpened((notification, completion) => {
			console.log('Notification opened by device user', notification);
			console.log(`Notification opened with an action identifier: ${notification.identifier}`);
			// const { session_id } = _.get(notification, 'payload');
			// redirect to detail page
			// if (session_id ) {
			// Actions.chatPage({ session_id });
			// }
			completion();
		});

		Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
			console.log('Notification Received - Background', notification);

			// Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
			completion({ alert: true, sound: true, badge: false });
		});

		Notifications.getInitialNotification()
			.then(async notification => {
				console.log('Initial notification was:', notification || 'N/A');
				if (!notification) {
					return;
				}
				// even app will killed will also work here for IOS and ANDROID.
				// kinda dirty fix. registerNotificationOpened() not working on Android (background)
				await new Promise(resolve => setTimeout(resolve, 2000));
				// const { session_id } = _.get(notification, 'payload');
				// redirect to detail page
				// if (session_id) {
				// 	Actions.chatPage({
				// 		session_id
				// 	});
				// }
			})
			.catch(err => console.error('getInitialNotifiation() failed', err));
	}

	render() {
		const { children } = this.props;
		return <View style={{ flex: 1 }}>{children}</View>;
	}
}
