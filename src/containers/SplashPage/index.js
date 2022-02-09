import React, { Component } from 'react';
import { Image, Platform, Alert, Linking, BackHandler, AsyncStorage } from 'react-native';
import { Container } from 'native-base';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import { Actions, ActionConst } from 'react-native-router-flux';

import Logo from '../../images/hkust.png';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import AuthenticationHelper from '../../lib/Authentication';
import config from '../../config';

class SplashPage extends Component {
	constructor() {
		super();
		this.state = {};
	}

	async componentDidMount() {
		await this.checkAuthenticationAndRedirect();
	}

	async checkNeedUpdate() {
		const version = DeviceInfo.getVersion();
		const res = await API.settings.getSupportedVersions();
		if (res.meta.code !== 200) {
			return false;
		}

		// update and point to selected api from server
		const supportedVersion = _.find(
			res.data.supported_versions,
			v => v.version === version && v.platform === Platform.OS
		);
		if (!supportedVersion) {
			return true;
		}
		// dirty: set the api host to desired host
		config.api = supportedVersion.host;
		return false;
	}

	showUpdateDialog() {
		Alert.alert(
			'New version available',
			'Please update app to new version to continue',
			[
				{
					text: 'Update',
					onPress: () => {
						if (Platform.OS === 'ios') {
							Linking.openURL('https://apps.apple.com/hk/app/hkust-alumni/id1435768421');
						  } else {
							Linking.openURL('https://play.google.com/store/apps/details?id=hk.ust.alum&hl=en_US');
						}
					}
				},
				{
					text: 'Cancel',
					onPress: () => {
						BackHandler.exitApp();
					},
					style: 'cancel'
				}
			],
			{cancelable: false}
		);
	}

	async checkAuthenticationAndRedirect() {
		// Check new version
		const needUpdate = await this.checkNeedUpdate();
		if (needUpdate) {
			this.showUpdateDialog();
			return;
		}

		// Check system status
		const response = await API.settings.getSystemStatus();
		if (response.meta.code !== 200) {
			AlertUtility.show('ERROR', response.meta.message);
			return;
		}
		const systemStatus = _.get(response, 'data.system_status');
		if (!systemStatus) {
			Actions.maintenancePage({ hideTabBar: true, type: ActionConst.REPLACE });
			return;
		}

		// Check if need onboarding screen
		// await AsyncStorage.setItem(AsyncStorageKeys.DONE_ONBOARD, 'new');
		const doneOnBoard = await AsyncStorage.getItem(AsyncStorageKeys.DONE_ONBOARD);

		if (doneOnBoard !== 'done') {
			const getOnboardingScreenRes = await API.onboarding_screens.getOnboardingScreens();
			if (getOnboardingScreenRes.meta.code !== 200) {
				AlertUtility.show('ERROR', response.meta.message);
				return;
			}
			if (getOnboardingScreenRes.data.onboarding_screens.length > 0) {
				Actions.onboardPage({ hideTabBar: true, type: ActionConst.REPLACE });
				return;
			}
		}

		// Check if user has uploaded picture
		const isLoggedIn = await AuthenticationHelper.isLoggedIn();
		if (isLoggedIn) {
			const getMeRes = await API.users.getMe();
			if (getMeRes.meta.code !== 200) {
				AlertUtility.show('ERROR', response.meta.message);
				return;
			}

			// update push token
			try {
				const push_token = await AsyncStorage.getItem(AsyncStorageKeys.PUSH_TOKEN);
				const device_id = DeviceInfo.getUniqueId();
				const device_name = DeviceInfo.getDeviceId();

				// Android locale Identifier (world/china).
				// world = android
				// china = android-cn
				const platform = Platform.OS === 'android' ? config.locale === 'world' ? 'android' : 'android-cn' : Platform.OS;
				await API.users.updatePushToken({
					push_token,
					device_id,
					device_name,
					platform
				});
			} catch (e) {
				console.log(e);
			}

			const { user } = getMeRes.data;
			// use barcode field to check if is activated
			if (!user.barcode || user.barcode.trim() === '') {
				Actions.uploadProfileImagePage({ hideTabBar: true, type: ActionConst.REPLACE });
				return;
			}
		}

		this.checkIfHasPin();
	}

	checkIfHasPin = async () => {
		const appLockPin = await AsyncStorage.getItem(AsyncStorageKeys.USER_APPLOCK_PIN);
		const appUseBiometric = await AsyncStorage.getItem(AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC);
		if(appLockPin) {
			Actions.appLockPage({
				hasPin: true,
				appLockPin,
				appUseBiometric,
				hideNavBar: true,
				hideTabBar: true,
				type: ActionConst.REPLACE
			});
			return;
		}

		// Redirect to main page
		Actions.mainPage({ hideTabBar: true, type: ActionConst.REPLACE });
	}

	render() {
		return (
			<Container
				style={{ alignItems: 'center', justifyContent: 'center' }}
			>
				<Image
					style={{ maxWidth: '20%', resizeMode: 'contain', height: 180 }}
					source={Logo}
				/>
			</Container>
		);
	}
}

export default SplashPage;
