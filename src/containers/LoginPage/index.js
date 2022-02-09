/* eslint-disable no-use-before-define */
import _ from 'lodash';
import React, { Component } from 'react';
import { Container } from 'native-base';
import { StyleSheet, AsyncStorage, Platform } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { withTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info'; // import DeviceInfo which will help to get UniqueId
import RNRestart from 'react-native-restart';

import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';

const path = 'containers.LoginPage';


class LoginPage extends Component {
	constructor() {
		super();
		this.state = {
			email: process.env.NODE_ENV === 'development' ? 'isod13+alum+20014045@ust.hk' : '',
			password: process.env.NODE_ENV === 'development' ? 'zz2d3c_2' : '',
			loading: false
		};
	}


	componentDidMount(){
		// redirect to cas log in page
		Actions.casLoginPage();
		// const { callBack } = this.props;
		// if (callBack){
		// 	this.props.navigation.setParams({
		// 		left: () => (
		// 			<View
		// 				style={{ marginLeft: 10  }}
		// 			>
		// 				<TouchableOpacity
		// 					onPress={() =>
		// 						Actions.mainPage({ hideTabBar: true, type: ActionConst.REPLACE })
		// 					}
		// 					style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
		// 				>
		// 					<Icon
		// 						name="arrow-back"
		// 						type="MaterialIcons"
		// 						style={{ color: 'white', fontSize: 18 }}
		// 					/>
		// 					<Text style={{ color: 'white', fontWeight: 'bold' }}>Back</Text>
		// 				</TouchableOpacity>
		// 			</View>
		// 		)
		// 	});
		// }
	}


	async handleSubmit() {

		const { email, password, loading } = this.state;
		if (loading || !password || !email) {
			return;
		}

		this.setState({ loading: true });
		const push_token = await AsyncStorage.getItem(AsyncStorageKeys.PUSH_TOKEN);
		const device_id = DeviceInfo.getUniqueId();
		const device_name = await DeviceInfo.getDeviceName().then(deviceName => {
			return deviceName;
		});
		const response = await API.auth.login({
			email,
			password,
			push_token,
			device_id,
			device_name,
			platform: Platform.OS
		});

		if (_.get(response, 'meta.code') !== 200) {
			this.handleLoginFailure({ meta: _.get(response, 'meta') });
			this.setState({
				loading: false,
				password: ''
			});
			return;
		}
		await this.handleLoginSuccess(response);
	}

	async handleLoginSuccess(response) {
		// delay, to show loading
		await new Promise(resolve => setTimeout(resolve, 1000));
		await AsyncStorage.setItem(AsyncStorageKeys.USER_AUTH_TOKEN, _.get(response, 'data.auth.token'));
		await AsyncStorage.setItem(AsyncStorageKeys.USER_ID, _.get(response, 'data.alumni.emplid'));

		Actions.onboardPage({ hideTabBar: true, type: ActionConst.REPLACE });

		// reload app after login to determine userMode
		RNRestart.Restart();
	}

	handleLoginFailure({ meta }) {
		if (_.get(meta, 'code') === 4011) {
			// TODO: show localized error message
			AlertUtility.show('錯誤 Error', `${_.get(meta, 'message')} (${_.get(meta, 'code')})`);
			return;
		}
		// show server error
		AlertUtility.show('錯誤 Error', `${_.get(meta, 'message')} (${_.get(meta, 'code')})`);
	}

	render(){
		const { email, password, loading, switching } = this.state;
		const { t } = this.props;

		return (
			<Container  style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
				{/* <ScrollView>
					<Content>
						<Card style={defaultStyle.p10}>
							<CardItem header>
								<View>
									<View style={defaultStyle.headerHolder}>
										<View>
											<Image
												source={LoginLogo}
											/>
										</View>
										<View style={defaultStyle.mTop30}>
											<View>
												<Form style={defaultStyle.formHolder}>
													<Item floatingLabel>
														<Label>{t(`${path}.LABEL_EMAIL`)}</Label>
														<Input
															autoCapitalize="none"
															placeholder={t(`${path}.PLACEHOLDER_EMAIL`)}
															keyboardType="email-address"
															value={email}
															onChangeText={(value) => this.setState({ email: value })}
														/>
													</Item>
													<Item
														floatingLabel
														last
													>
														<Label>{t(`${path}.LABEL_PASSWORD`)}</Label>
														<Input
															secureTextEntry
															password
															autoCapitalize="none"
															placeholder={t(`${path}.PLACEHOLDER_PASSWORD`)}
															keyboardType="default"
															value={password}
															onChangeText={(value) => this.setState({ password: value })}
														/>
													</Item>
												</Form>
											</View>
											<View style={defaultStyle.mTop25}>
												<Button
													block
													style={defaultStyle.loginBtn}
													onPress={() => this.handleSubmit()}
													disabled={loading || !email || !password}
												>
													<Text>
														{t(`${path}.BUTTON_LOGIN`)}
													</Text>
												</Button>
											</View>
											<View style={defaultStyle.mTop25}>
												<Text style={defaultStyle.forgotPass}>
													Click here if you are first time user or if you forgot your password
												</Text>
											</View>
											<View style={defaultStyle.mTop25}>
												<Button
													block
													onPress={() => Actions.casLoginPage()}
												>
													<Text>
														LOGIN WITH CAS
													</Text>
												</Button>
											</View>
										</View>
									</View>
								</View>
							</CardItem>
						</Card>
					</Content>
				</ScrollView> */}
				<ProgressDialog
					visible={loading}
					message={t(`${path}.LABEL_LOADING`)}
				/>
				<ProgressDialog
					visible={switching}
					message={t(`${path}.LABEL_SWITCHING`)}
				/>
			</Container>
		);
	}
}

// custom styles

const defaultStyle = StyleSheet.create({
	p15: {
		padding: 15
	},
	p10: {
		padding: 10
	},
	headerHolder: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center'
	},
	mTop30: {
		marginTop: 30
	},
	mBot15: {
		marginBottom: 15
	},
	lightDark: {
		color: '#444'
	},
	loginWithCasBtn: {
		backgroundColor: '#0b3366'
	},
	divider: {
		borderBottomWidth: 2,
		borderBottomColor: '#f2f2f2',
		marginTop: 18
	},
	mTop10: {
		marginTop: 10
	},
	formHolder: {
		alignSelf: 'stretch',
		margin: 0,
		padding: 0
	},
	mTop25: {
		marginTop: 25
	},
	loginBtn: {
		backgroundColor: '#d4ad21'
	},
	forgotPass: {
		color: '#444',
		textDecorationLine: 'underline'
	}
});

export default withTranslation()(LoginPage);
