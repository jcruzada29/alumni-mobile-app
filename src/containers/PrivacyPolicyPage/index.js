import React, {Component} from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking, ScrollView, AsyncStorage } from 'react-native';
import { Container, View } from 'native-base';
import RNRestart from 'react-native-restart';
import HTML from 'react-native-render-html';

import Loading from '../../components/UI/Loading';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';

class PrivacyPolicyPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			webview: null,
			html: null
		};
	}

	async getUserPrivacyPolicy() {
		this.setState({ loading: true });

		const response = await API.static.userPrivacyPolicy();
		if (response.meta.code !== 200) {
			AlertUtility.show('ERROR', response.meta.message);
			return;
		}


		this.setState({
			loading: false,
			html: response.data.html
		});
	}

	async componentDidMount() {
		await this.getUserPrivacyPolicy();
	}

	navigationChangeHandler = state => {
		const {nativeEvent} = state;
		const {webview} = this.state;
		if (nativeEvent.url !== '' && nativeEvent.url !== 'about:blank') {
			webview.stopLoading();
			Linking.openURL(nativeEvent.url);
		}
	};

	async handleAgreeButton() {
		const { id, token } = this.props;

		// delay, to show loading
		await new Promise(resolve => setTimeout(resolve, 1000));
		await AsyncStorage.setItem(AsyncStorageKeys.USER_AUTH_TOKEN, token);
		await AsyncStorage.setItem(AsyncStorageKeys.USER_ID, id);
		await AsyncStorage.setItem(AsyncStorageKeys.AGREED_PRIVACY_POLICY, 'done');

		RNRestart.Restart();
	}

	render() {
		const { loading, html } = this.state;

		if (loading) {
			return (
				<Container><Loading /></Container>
			);
		}

		return (
			<SafeAreaView style={styles.screen}>
				<ScrollView style={styles.htmlWrapper}>
					<HTML
						html={html}
						onLinkPress={(evt, href) => { Linking.openURL(href); }}
						// baseFontStyle={{textAlign: 'justify'}}
					/>
					<TouchableOpacity
						style={styles.touchAgree}
						onPress={() => this.handleAgreeButton() }
					>
						<View style={styles.tButton}>
							<Text style={styles.tButtonText}>Agree and Proceed</Text>
						</View>
					</TouchableOpacity>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	loadingScreen: {
		flex: 1
	},
	screen: {
		backgroundColor: '#FAFAFA',
		flex: 1
	},
	htmlWrapper: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 40
	},
	touchAgree: {
		alignSelf: 'center',
		shadowColor: 'rgba(0,0,0,0.15)',
		shadowOffset: {width: 0, height: 0},
		shadowRadius: 2,
		shadowOpacity: 1,
		marginBottom: 40
	},
	// disabledButton: {
	// 	position: 'absolute',
	// 	bottom: 35,
	// 	left: -245 / 2,
	// 	width: 245,
	// 	height: 40,
	// 	borderRadius: 30,
	// 	shadowColor: 'rgba(0,0,0,0.15)',
	// 	shadowOffset: {width: 0, height: 0},
	// 	shadowRadius: 2,
	// 	shadowOpacity: 1,
	// 	backgroundColor: 'white',
	// 	opacity: 0.5,
	// 	zIndex: 999
	// },
	// button: {
	// 	position: 'absolute',
	// 	bottom: 35,
	// 	left: -245 / 2,
	// 	width: 245,
	// 	height: 40,
	// 	backgroundColor: '#1E3E71',
	// 	borderRadius: 30,
	// 	shadowColor: 'rgba(0,0,0,0.15)',
	// 	shadowOffset: {width: 0, height: 0},
	// 	shadowRadius: 2,
	// 	shadowOpacity: 1,
	// 	zIndex: 99
	// },
	// buttonText: {
	// 	textAlign: 'center',
	// 	marginTop: 11,
	// 	color: 'white',
	// 	fontWeight: '500',
	// 	fontSize: 15
	// },
	// touchDisagree: {
	// 	position: 'absolute',
	// 	bottom: 20,
	// 	left: (Dimensions.get('window').width - 245) / 2,
	// 	zIndex: 1,
	// 	shadowColor: 'rgba(0,0,0,0.15)',
	// 	shadowOffset: {width: 0, height: 0},
	// 	shadowRadius: 2,
	// 	shadowOpacity: 1
	// },
	tButton: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1E3E71',
		width: 245,
		height: 40,
		borderRadius: 30
	},
	tButtonText: {
		textAlign: 'center',
		textAlignVertical: 'center',
		color: 'white',
		fontWeight: '500',
		fontSize: 15
	}
});

export default PrivacyPolicyPage;