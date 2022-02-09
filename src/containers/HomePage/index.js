/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import _, { toLower } from 'lodash';
import moment from 'moment';
import { AppState, ScrollView, StyleSheet, RefreshControl, StatusBar, BackHandler, Platform, AsyncStorage } from 'react-native';
import { Text, View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { Actions, ActionConst } from 'react-native-router-flux';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Notifications } from 'react-native-notifications';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import Loading from '../../components/UI/Loading';
import FabECard from '../../components/FabECard';
import Highlights from '../../components/Highlights';
import AuthenticationHelper from '../../lib/Authentication';
import NavigationIcons from './components/NavigationIcons';
import News from './components/News';
import PopupModal from './components/PopupModal';

class HomePage extends Component {
	state = {
		news: [],
		popups: [],
		loadingNews: false,
		systemStatus: true,
		isLoggedIn: false,
		refreshing: false,
		// modalShow: false
		showModal: false,
		activeModalIndex: 0,
		appLockPin: null,
		appUseBiometric: false,
		highlights: [],
		appIdle: AppState.currentState
		// initialLoad: true
	};

	componentDidMount() {
		this.getSystemStatus();
		this.checkIfHasPin();
		this.checkIfLoggedIn();
		this.getHomeScreenIcons();
		this.getPopups();
		this.getNews();
		this.getSubscriptions();

		if(Platform.OS === 'android'){
			BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}

		// Clear Notification: none to alive
		if(Platform.OS === 'ios') {
			PushNotificationIOS.setApplicationIconBadgeNumber(0);
			StatusBar.setBarStyle('light-content', true);
		}

		AppState.addEventListener('change', this.handleAppIdle);
	}

	checkNotificationRedirect = async () => {
		const notif = await AsyncStorage.getItem(AsyncStorageKeys.PUSH_NOTIFICATION_ID);
		const notifObj = JSON.parse(notif);
		console.log('Notif: ', notifObj);
		if(notifObj && notifObj.news_id) {
			if(Actions.currentScene !== 'newsDetailPage') {
				Actions.newsDetailPage({ newsId: notifObj.news_id });
			}
		}
		if(notifObj && notifObj.event_id) {
			if(Actions.currentScene !== 'happeningDetailPage') {
				Actions.happeningDetailPage({ eventId: notifObj.event_id });
			}
		}
		if(notifObj && notifObj.coupon_id) {
			if(Actions.currentScene !== 'savingsPage') {
				Actions.notificationsPage();
			}
		}
		if(notifObj && notifObj.parking_id) {
			if(Actions.currentScene !== 'parkingPage') {
				Actions.parkingPage();
			}
		}
		await AsyncStorage.removeItem(AsyncStorageKeys.PUSH_NOTIFICATION_ID);
	}

	handleBackButton = () => {
		// Do nothing android
		if(Actions.currentScene !== 'homePage' && Platform.OS === 'android'){
			return BackHandler.removeEventListener('hardwareBackPress');
		}

		if(Actions.currentScene === 'homePage' && Platform.OS === 'android'){
			return BackHandler.exitApp();
		}

		return true;
	};

	handleAppIdle = (nextAppState) => {
		if (
			this.state.appIdle.match(/background/) &&
			nextAppState === 'active'
		) {
			this.checkIfHasPin(true);
			// Clear Notification: background to foreground
			if(Platform.OS === 'ios') {
				PushNotificationIOS.setApplicationIconBadgeNumber(0);
			}
		}

		this.setState({appIdle: nextAppState});
	};

	checkIfHasPin = async (idle) => {
		const { systemStatus } = this.state;
		const { unlocked } = this.props;

		const isLoggedIn = await AuthenticationHelper.isLoggedIn();

		// If not loggedin or maintenance mode, break;
		if (!isLoggedIn || !systemStatus) {
			return;
		}

		// If unlocked and not re-oppened from background, break;
		if(unlocked && !idle) {
			return;
		}

		const appLockPin = await AsyncStorage.getItem(AsyncStorageKeys.USER_APPLOCK_PIN);
		const appUseBiometric = await AsyncStorage.getItem(AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC);
		this.setState({ appLockPin, appUseBiometric });
	}

	checkIfLoggedIn = async () => {
		const is_loggedin = await AuthenticationHelper.isLoggedIn();

		if (is_loggedin) {
			this.setState({isLoggedIn: true});
		} else {
			this.setState({isLoggedIn: false});
		}
	};

	componentDidUpdate(prevProps, prevState) {
		const { systemStatus: prevSystemStatus } = prevState;
		const { systemStatus } = this.state;

		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;

		const { appLockPin: prevAppLockPin } = prevState;
		const { appLockPin, appUseBiometric } = this.state;

		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			this.getSystemStatus();
			this.getSubscriptions();
		}

		if (systemStatus !== prevSystemStatus && !systemStatus) {
			Actions.maintenancePage({ hideTabBar: true, type: ActionConst.REPLACE });
		}

		if (appLockPin && appLockPin !== prevAppLockPin) {
			Actions.appLockPage({
				hasPin: true,
				appLockPin,
				appUseBiometric,
				hideNavBar: true,
				hideTabBar: true,
				type: ActionConst.RESET
			});
		}
	}

	componentWillUnmount() {
		this.setState({ systemStatus: true });
	}

	async getSystemStatus() {
		const response = await API.settings.getSystemStatus();
		const systemStatus = _.get(response, 'data.system_status');
		this.setState({ systemStatus });
	}

	async getSubscriptions() {
		const isLoggedIn = await AuthenticationHelper.isLoggedIn();
		if (!isLoggedIn) {
			return;
		}

		const subscriptionTypes = ['library', 'sports', 'alumni_association'];
		const tempSubscriptions = [];

		await Promise.all(subscriptionTypes.map(async types => {
			const response = await API.subscriptions.getSubscriptions({ type: types });
			tempSubscriptions.push(...response.data.subscriptions);
		}));

		// Return only active subscriptions
		const subscriptions = tempSubscriptions.length > 0 && tempSubscriptions.filter(subscription => subscription.subscription_status_name === 'Active');

		let cachedSubscriptions = [];
		const savedSubscriptions = await AsyncStorage.getItem(AsyncStorageKeys.USER_SUBSCRIPTIONS);
		cachedSubscriptions = savedSubscriptions ? JSON.parse(savedSubscriptions) : [];

		if(!cachedSubscriptions.length) {
			await AsyncStorage.setItem(AsyncStorageKeys.USER_SUBSCRIPTIONS, JSON.stringify(subscriptions));
		}

		if (Platform.OS === 'android') {
			// Last process of homePage, redirect the specific notification to avoid returning homePage.
			this.checkNotificationRedirect();
			return;
		}
		// scheduling notification only works on iOS
		// remove previous notificaiton
		try {
			const originalNotificationIdsString = await AsyncStorage.getItem(AsyncStorageKeys.LOCAL_NOTIFICATION_IDS);
			const originalNotificationIds = originalNotificationIdsString ? JSON.parse(originalNotificationIdsString) : [];
			for (let i = 0; i < originalNotificationIds.length; i++) {
				Notifications.cancelLocalNotification(originalNotificationIds[i]);
			}

			const notificationIds = [];
			for(let i = 0; i < subscriptions.length; i++) {
				const subscription = subscriptions[i];
				if (!subscription.subscription_expiry_date || moment(subscription.subscription_expiry_date).format('YYYY') === '3000') {
					continue;
				}
				const notifyDate = moment(subscription.subscription_expiry_date).subtract(2, 'week').add(10, 'h'); // Notify 10AM
				const subscriptionName = ['SAO01', 'SAO02'].indexOf(subscription.id) === -1
					? toLower(subscription.name)
					: `access right to ${toLower(subscription.name)}`;
				// debug
				// const notifyDate = moment().add(5, 's'); // Notify 10AM
				const localNotificationId = Notifications.postLocalNotification({
					fireDate: notifyDate.toISOString(),
					title: 'Renew Service',
					body: `Your ${subscriptionName} will expire on ${moment(subscription.subscription_expiry_date).format('D MMM YYYY')}. Please go to home page to renew`,
					category: subscription.id,
					userInfo: { }
				});
				notificationIds.push(localNotificationId);
			}
			await AsyncStorage.setItem(AsyncStorageKeys.LOCAL_NOTIFICATION_IDS, JSON.stringify(notificationIds));
		} catch (e) {
			// error cancelling
			console.error(e);
		}
	}

	async getPopups() {
		const isLoggedIn = await AuthenticationHelper.isLoggedIn();
		if (!isLoggedIn) {
			return;
		}
		const response = await API.popups.getPopups();
		const { popups } = response.data;
		const newPopups = [...popups];
		if (newPopups.length > 0) {
			await Promise.all(popups.map(async (item, index) => {
				const asset = await this.getAssetById(item.asset_id);
				newPopups[index].file = asset.file;
				newPopups[index].show = true;
			}));

			this.setState({
				popups: newPopups,
				showModal: true
			});
		}
	}

	async getNews() {
	 	this.setState({ loadingNews: true });

		const response = await API.news.getNews();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingNews: false });
			return;
		}

		const { news } = response.data;
		const newNews = [...news];
		if (newNews.length > 0) {
			await Promise.all(news.map(async (item, index) => {
				const asset = await this.getAssetById(item.asset_id);
				newNews[index].file = asset.file;
			}));
		}

	 	this.setState({
	 		news: newNews,
	 		loadingNews: false
	 	});
	}

	async getAssetById(id) {
	 	const response = await API.assets.getAssetFileById(id);
	 	if (_.get(response, 'meta.code') !== 200) {
	 		AlertUtility.show('ERROR', _.get(response, 'meta.message'));
	 		return null;
	 	}
	 	return _.get(response, 'data.asset');
	}

	getHomeScreenIcons = async () => {
		this.setState({loadingIcons: true});
		const response = await API.settings.getHomeScreenIcons();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			return null;
		}
		const newIcons = _.get(response, 'data.icons').filter(icon => {
			if(icon.type === 'parking' && !this.state.isLoggedIn){
				return false;
			};
			return icon.enabled === true;
		});
		this.setState({ icons: newIcons, loadingIcons: false });
	}

	_onRefresh = () => {
		this.setState({refreshing: true});
		this.getNews();
		this.getHomeScreenIcons();
		this.setState({ key: Math.random() });
		this.checkIfLoggedIn();
		this.getPopups();
		this.setState({refreshing: false});
	}

	async closeModal(id) {
		const {popups, activeModalIndex} = this.state;
		const newPopups = [...popups];

		// Step 1: find id in copied array
		const index = _.findIndex(newPopups, {id});

		// Step 2: remove that index and update popups state
		newPopups.splice(index, 1);
		this.setState({ popups: newPopups });

		// Step 3: check active modal index and subtruct to get active modal position
		const maxIndex = popups.length - 1;
		const currentIndex = activeModalIndex; // 0
		const isLastModal = currentIndex === maxIndex;
		const newIndex = isLastModal ? -1: currentIndex +1;

		if (newIndex >= 0) {
			this.setState({
				activeModalIndex: newIndex
			});
		} else {
			this.setState({
				showModal: false
			});
		}


		const response = await API.popups.logPopupWhenClosed(id);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			return false;
		}

		return true;
	}

	hasHighlight = (highlights) => {
		this.setState({
			highlights
		});
	}

	render() {
		const {
			news,
			popups,
			loadingNews,
			icons,
			loadingIcons,
			refreshing,
			showModal,
			activeModalIndex,
			isLoggedIn,
			highlights
			// modalShow
		} = this.state;

		return (
			<>
				<ScrollView
					onRefresh={this._onRefresh}
					refreshControl={
						<RefreshControl
							tintColor="#FFFFFF"
							colors={['#FFFFFF']}
							refreshing={refreshing}
							onRefresh={this._onRefresh}
						/>
					}
				>
					{highlights && highlights.length > 0 &&
						<View
							style={{
								height: 1069,
								width: '100%',
								backgroundColor: '#0B3366',
								position: 'absolute',
								top: -1000,
								zIndex: -1
							}}
						/>
					}
					<Highlights
						location="home"
						key={this.state.key}
						hasHighlight={this.hasHighlight}
					/>

					{/* <Text style={styles.majorFeatureSectionTitle}>Connect with HKUST</Text> */}
					<View style={{flex: 1, flexDirection: 'row'}}>
						{/* Navigation Icons */}
						{
							!loadingIcons && <NavigationIcons
								isLoggedin={isLoggedIn}
								icons={icons}
							/>
						}
					</View>

					{/* News */}
					<View style={styles.newsContainer}>
						{loadingNews && <Loading />}
						{!loadingNews && <Text style={styles.newsSectionTitle}>News</Text>}
						{!loadingNews && news.length === 0 && <Text>No news available</Text>}
						{!loadingNews && news.length > 0 && _.chunk(news, 2).map(chunk => (
							<View style={{flexDirection: 'row'}}>
								{
									chunk.length === 2 && chunk.map(o =>
										<News
											key={o.id}
											{...o}
										/>
									)
								}
								{
									chunk.length === 1 &&
									<News
										key={chunk[0].id}
										{...chunk[0]}
									/>
								}
								{
									chunk.length === 1 &&
									<View style={styles.emptyNewsCell} />
								}
							</View>
						))}
					</View>
				</ScrollView>

				{/* Popup Modal */}
				{popups.length > 0 &&
						popups.map((popup, index) => activeModalIndex >= index &&  (
							<PopupModal
								key={index}
								isOpen={showModal}
								onClose={(id) => this.closeModal(id)}
								popup={popup}
							/>
						))
				}
				{/* </Container>
				</ScrollView> */}
				<FabECard marginBottom={0} />
			</>
		);
	}
}

// custom styles
const styles = StyleSheet.create({
	majorFeatureSectionTitle: {
		margin: 14,
		fontWeight: 'bold',
		fontSize: 16,
		color: '#003366'
	},
	newsContainer: {
		marginTop: 20,
		marginBottom: 40,
		marginLeft: 12,
		marginRight: 12
	},
	newsSectionTitle: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#003366',
		marginBottom: 20
	},
	emptyNewsCell: {
		flex: 1,
		borderRadius: 4,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 10
	}
});

export default withTranslation()(HomePage);