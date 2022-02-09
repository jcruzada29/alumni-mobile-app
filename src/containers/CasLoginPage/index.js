import React, { Component } from 'react';
import _ from 'lodash';
import { WebView } from 'react-native-webview';
import { Container } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info'; // import DeviceInfo which will help to get UniqueId
import { withTranslation } from 'react-i18next';
import { AsyncStorage, Platform, Alert, View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import RNRestart from 'react-native-restart';

import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import config from '../../config';

class CasLoginPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			source: '',
			key: 0,
			loadingExchangeToken: false
		};
	}

	componentDidMount() {
		this.getCasUrl();
	}

	componentDidUpdate(prevProps, prevState) {
		// const { ticket } = this.state;
		// const { ticket: prev_ticket } = prevState;

		// if (ticket && ticket !== prev_ticket) {
		// 	console.log({ ticket });
		// 	this.handleCasLogin();
		// }
	}

	extractCode = query => {
		return query.split('&state=')[0];
	  };

	extractQuery = url => {
		return url.split('hk.ust.alum://login/?code=')[1];
	  };

	exchangeToken = url => {
		const query = this.extractQuery(url);
		const code = this.extractCode(query);
		// post to APi here now.
	};

	navigationChangeHandler = state => {
		if (state.url.indexOf('hk.ust.alum://') === 0) {
			this.submitExchangeToken({ url: state.url });
			// console.log('state', state.url);
		  	// this.exchangeToken(state.url);
			//   webview.stopLoading();

		//   setTimeout(() => {
		// 	if (!uploadedPhoto) {
		// 	  props.navigation.replace('Privacy');
		// 	} else {
		// 	  props.navigation.popToTop();
		// 	}
		//   }, 1000);
		}
	  };

	async submitExchangeToken({ url }) {
		this.setState({ loadingExchangeToken: true });
		const push_token = await AsyncStorage.getItem(AsyncStorageKeys.PUSH_TOKEN);
		const device_id = DeviceInfo.getUniqueId();
		const device_name = DeviceInfo.getDeviceId();

		// Android locale Identifier (world/china).
		// world = android
		// china = android-cn
		const platform = Platform.OS === 'android' ? config.locale === 'world' ? 'android' : 'android-cn' : Platform.OS;
		const body = {
			url,
			push_token,
			device_id,
			device_name,
			platform
		};
		const response = await API.auth.submitLegacyCasAuth(body);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingExchangeToken: false });
			return;
		}
		// AlertUtility.show('', 'Success');
		await this.handleLoginSuccess(response);
		// Actions.homePage({ hideTabBar: true, type: ActionConst.REPLACE });
		// console.log({ response })
		// const { notifications } = response.data;
		// this.setState({
		// 	notifications,
		// 	loadingNotifications: false
		// });
	}

	errorHandler = error => {
		const { nativeEvent } = error;
		if (nativeEvent.url.includes('itsc')) {
		  return;
		}

		if (Platform.OS === 'ios') {
		  if (nativeEvent.code === -1002) {
				return;
			}
			if (nativeEvent.code === -1009) {
				Alert.alert('', nativeEvent.description);
			} else {
				Alert.alert(
					'',
					'Login service is temporarily not available.\nPlease try again later.'
				);
			}
		} else {
			if (nativeEvent.code === -10) {
				return;
			}
			if (nativeEvent.code === -2) {
				Alert.alert('', 'Network Error. Please check your network settings.');
			} else {
				Alert.alert(
					'',
					'Login service is temporarily not available.\nPlease try again later.'
				);
			}
		}
	};

	async getCasUrl() {
		const response = await API.auth.getLegacyCasUrl();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('Error', _.get(response, 'meta.message'));
			return;
		}

		const source = _.get(response, 'data.url');
		this.setState({
			source,
			loading: false
		});
	}


	async handleLoginSuccess(response) {
		const agreedPrivacyPolicy = await AsyncStorage.getItem(AsyncStorageKeys.AGREED_PRIVACY_POLICY);
		if (!agreedPrivacyPolicy || agreedPrivacyPolicy !== 'done') {
			Actions.privacyPolicyPage({
				hideTabBar: true,
				type: ActionConst.REPLACE,
				token: _.get(response, 'data.auth.token'),
				id: _.get(response, 'data.alumni.id')
			});
			return;
		}

		// reload
		await new Promise(resolve => setTimeout(resolve, 1000));
		await AsyncStorage.setItem(AsyncStorageKeys.USER_AUTH_TOKEN, _.get(response, 'data.auth.token'));
		await AsyncStorage.setItem(AsyncStorageKeys.USER_ID, _.get(response, 'data.alumni.id'));
		RNRestart.Restart();
	}

	render() {
		const { loading, source, loadingExchangeToken } = this.state;
		const jsCode =
		'const meta = document.createElement("meta"); meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"); meta.setAttribute("name", "viewport");document.head.appendChild(meta);true;';
		const errorScreen = () => (
			<View style={styles.errorScreen}>
				<Text style={styles.errScreenTitle}>Webpage not available</Text>
				<TouchableOpacity
					style={styles.errScreenBtn}
					onPress={() => this.setState({ key: this.state.key + 1 })}
				>
					<Text style={styles.errScreenText}>Retry</Text>
				</TouchableOpacity>
			</View>
		  );
		const loadingScreen = () => (
			<View style={styles.loadingScreen}>
				<ActivityIndicator />
			</View>
		);

		if (loading || !source || loadingExchangeToken) {
			return loadingScreen;
		}

		return (
			<Container>
				<WebView
					source={{ uri: `${source}` }}
					// eslint-disable-next-line no-return-assign
					// ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
					key={this.state.key}
					injectedJavaScript={jsCode}
					originWhitelist={['*']}
					onError={() => this.errorHandler}
					renderError={errorScreen}
					startInLoadingState={true}
					renderLoading={loadingScreen}
					onNavigationStateChange={ (state) => this.navigationChangeHandler(state)}
					cacheEnabled={false}
					cacheMode="LOAD_NO_CACHE"
					incognito={true}
					saveFormDataDisabled={true}
				/>
			</Container>
		);
	}
}
const styles = StyleSheet.create({
	loadingScreen: {
	  flex: 1
	},
	errorScreen: {
	  justifyContent: 'center',
	  alignItems: 'center',
	  top: 0,
	  bottom: 0,
	  left: 0,
	  right: 0,
	  position: 'absolute',
	  zIndex: 1,
	  backgroundColor: 'white'
	},
	errScreenTitle: {fontSize: 16, fontWeight: 'bold', color: '#1E3E71'},
	errScreenBtn: {
	  width: 100,
	  height: 36,
	  borderRadius: 25,
	  marginTop: 20,
	  justifyContent: 'center',
	  alignItems: 'center',
	  borderColor: '#1E3E71',
	  borderWidth: 0.5
	},
	errScreenText: {fontSize: 12, color: '#1E3E71'}
});

export default withTranslation()(CasLoginPage);
