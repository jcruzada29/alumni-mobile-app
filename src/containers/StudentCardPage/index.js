import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Container } from 'native-base';
import _ from 'lodash';
import SystemSetting from 'react-native-system-setting';
import { Actions } from 'react-native-router-flux';

import Orientation from 'react-native-orientation-locker';
import AlertUtility from '../../lib/AlertUtility';
import API from '../../lib/API';
import Loading from '../../components/UI/Loading';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import AuthenticationHelper from '../../lib/Authentication';
import Body from './components/Body';
import Header from './components/Header';
import CardDescriptionModal from './components/CardDescriptionModal';

const { height: screenHeight } = Dimensions.get('window');

const RELOAD_INTERVAL = 15 * 60 * 1000; // reload every 15 mins

class StudentCardPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			activeSlide: 0,
			ecards: [],
			openDescription: false,
			screenBrightness: 0
		};
		this.reloadCardInterval = setInterval(() => this.reloadCards(), RELOAD_INTERVAL);
	}

	async getCachedEcards() {
		let cachedEcards = [];
		try {
			const cachedEcardsString = await AsyncStorage.getItem(AsyncStorageKeys.ECARD_DETAILS);
			cachedEcards = cachedEcardsString ? JSON.parse(cachedEcardsString) : [];
		} catch (e) {
			console.error(e);
		}
		return cachedEcards;
	}

	async reloadCards() {
		this.setState({
			loading: true,
			open: false,
			ecards: []
		});

		// obtain cached ecards
		const cachedEcards = await this.getCachedEcards();

		// Check if network is available
		const networkInfo = await NetInfo.fetch();
		if (!networkInfo.isConnected) {
			this.setState({
				loading: false,
				ecards: cachedEcards
			});
			return;
		}

		// Check if maintenance mode
		const getSystemStatusRes = await API.settings.getSystemStatus();
		const systemStatus = _.get(getSystemStatusRes, 'data.system_status');
		if (!systemStatus) {
			this.setState({
				loading: false,
				ecards: cachedEcards
			});
			return;
		}

		// Check if network available
		const getEcardsRes = await API.users.ecards();
		if (getEcardsRes.meta.code !== 200) {
			AlertUtility.show('ERROR', getEcardsRes.meta.message);
			this.setState({ loading: false });
			return;
		}

		// save ecards to storage
		await AsyncStorage.setItem(AsyncStorageKeys.ECARD_DETAILS, JSON.stringify(getEcardsRes.data.ecards));

		this.setState({
			loading: false,
			ecards: getEcardsRes.data.ecards
		});
	}

	async checkIfLoggedIn() {
		const isLoggedIn = await AuthenticationHelper.isLoggedIn();
		if (!isLoggedIn) {
			Actions.casLoginPage();
		}
	}

	async componentDidMount() {
		Orientation.lockToPortrait();
		const originalBrightness = await SystemSetting.getAppBrightness();
		this.setState({ screenBrightness: originalBrightness });
		await SystemSetting.setAppBrightness(1);

		this.checkIfLoggedIn();
		this.reloadCards();
	}

	async componentWillUnmount() {
		Orientation.unlockAllOrientations();
		await SystemSetting.setAppBrightness(this.state.screenBrightness);
		if (this.reloadCardInterval) {
			clearInterval(this.reloadCardInterval);
		}
	}

	setActiveSlide = (index) => {
		this.setState({ activeSlide: index });
	}

	openDescriptionModal = () => {
		const { ecards, activeSlide } = this.state;
		const selectedEcard = ecards[activeSlide];
		if (selectedEcard.card_description) {
			this.setState({ openDescription: true });
		}
	}

	closeDescriptionModal = () => {
		this.setState({ openDescription: false });
	}

	openImagePage = () => {
		const { ecards, activeSlide } = this.state;
		const selectedEcard = ecards[activeSlide];
		Actions.cardImagePage({selectedEcard});
	}

	render() {
		const { ecards, activeSlide, loading, openDescription } = this.state;
		return (
			<Container
				style={style.container}
			>
				{
					!loading && ecards.length > 0 &&
					<CardDescriptionModal
						open={openDescription}
						closeModal={this.closeDescriptionModal}
						ecard={ecards[activeSlide]}
					/>
				}

				{ loading && <Loading /> }
				{ !loading &&
					<View style={{ height: screenHeight }}>
						<View style={style.header} />
						<Header
							ecards={ecards}
							setActiveSlide={this.setActiveSlide}
							openDescriptionModal={this.openDescriptionModal}
							openImagePage={this.openImagePage}
							{...this.state}
						/>
						{(ecards.length > 0 && !loading) &&
							<Body
								ecard={ecards[activeSlide]}
							/>
						}
					</View>
				}
			</Container>
		);
	}
}

const style = StyleSheet.create({
	container: {
		backgroundColor: '#f3f4f6'
	},
	header: {
		height: 100,
		backgroundColor: '#003366',
		zIndex: -1
	}
});

export default StudentCardPage;
