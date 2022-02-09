/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { Text, Button } from 'native-base';
import { StyleSheet, View, ImageBackground, Platform, AsyncStorage } from 'react-native';
import { withTranslation } from 'react-i18next';
import Swiper from 'react-native-swiper';
import { Actions, ActionConst } from 'react-native-router-flux';
import _ from 'lodash';

import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import Loading from '../../components/UI/Loading';
import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';


class OnboardPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadingOnboardScreens: false,
			onboarding_screens: []
		};
	}

	async componentDidMount() {
		this.getOnboardScreens();
	}

	async getOnboardScreens() {
		this.setState({
			loadingOnboardScreens: true
		});
		const response = await API.onboarding_screens.getOnboardingScreens();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingOnboardScreens: false });
			return;
		}
		const onboarding_screens = _.get(response, 'data.onboarding_screens');
		const copyScreens = [...onboarding_screens];
		// get assets per screen
		if (onboarding_screens.length > 0) {
			await Promise.all(onboarding_screens.map(async (item, index) => {
				const asset = await this.getAssetById(item.asset_id);
				copyScreens[index].file = asset.file;
				return copyScreens;
			}));
		}

		if (onboarding_screens.length <= 0) {
			// return redirect to main page.
			Actions.mainPage({ hideTabBar: true, type: ActionConst.REPLACE });
			return;
		}

		this.setState({
			onboarding_screens: copyScreens,
			loadingOnboardScreens: false
		});
	}

	async getAssetById(id){
		const response = await API.assets.getAssetFileById(id);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			return null;
		}
		return _.get(response, 'data.asset');
	}

	onPressGetStarted = async() => {
		await AsyncStorage.setItem(AsyncStorageKeys.DONE_ONBOARD, 'done');
		Actions.mainPage({ type: ActionConst.REPLACE });
	}

	render(){
		const { loadingOnboardScreens, onboarding_screens } = this.state;
		if (loadingOnboardScreens) {
			return(
				<Loading />
			);
		}
		if (onboarding_screens.length < 0) {
			return (
				<View style={styles.slide}>
					<Text style={styles.title}>No Onboard Screen Available</Text>
				</View>
			);
		}

		return (
			<Swiper
				style={styles.wrapper}
				showsButtons={false}
				activeDotColor="#013972"
				dotColor="#BDBEC0"
				loop={false}
			>
				{onboarding_screens.map((screen, index) => {
					const { file } = screen;
					return (
						<View
							key={screen.id}
							style={styles.slide}
						>
							<ImageBackground
								source={{ uri: file }}
								style={styles.image}
							>
								{index === onboarding_screens.length - 1 &&
								<Button
									success
									rounded
									style={styles.buttonWrapper}
									onPress={() => this.onPressGetStarted() }
								>
									<Text
										style={{ fontWeight: 'bold' }}
									>
										GET STARTED
									</Text>
								</Button>
								}
							</ImageBackground>
						</View>

					);
				})}
			</Swiper>
		);
	}
}

// custom styles
const stylesAndroid = StyleSheet.create({
	wrapper: {

	},
	image: {
		width: '100%',
		flex: 1,
		resizeMode: 'contain',
		justifyContent: 'flex-end'
	},
	slide: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	  backgroundColor: 'black'
	},
	title: {
		color: 'black',
		fontSize: 25,
		fontWeight: 'bold',
		marginBottom: 10
	},
	buttonWrapper: {
		marginBottom: 40,
		marginLeft: 10,
		marginRight: 10,
		padding: 20,
		flex: 1,
		// flexDirection: 'row',
		justifyContent: 'center'
		// backgroundColor: 'red'
	},
	button: {
		justifyContent: 'center',
		paddingLeft: 20,
		paddingRight: 20
	},
	text: {
	  color: 'black',
	  fontSize: 12,
	  fontWeight: '300',
	  marginBottom: 10
	}
});
const stylesIOS = StyleSheet.create({
	wrapper: {
	},
	image: {
		width: '100%',
		flex: 1,
		resizeMode: 'contain',
		justifyContent: 'flex-end'
	},
	slide: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	  backgroundColor: 'black'
	},
	title: {
		color: 'black',
		fontSize: 25,
		fontWeight: 'bold',
		marginBottom: 10
	},
	buttonWrapper: {
		marginBottom: 60,
		marginLeft: 10,
		marginRight: 10,
		padding: 20,
		justifyContent: 'center'
	},
	button: {
		justifyContent: 'center',
		paddingLeft: 20,
		paddingRight: 20
	},
	text: {
	  color: 'black',
	  fontSize: 12,
	  fontWeight: '300',
	  marginBottom: 10
	}
});
const styles = Platform.OS === 'ios' ? stylesIOS : stylesAndroid;


export default withTranslation()(OnboardPage);
