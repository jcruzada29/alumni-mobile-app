import React, { Component } from 'react';
import { AppState, Image, AsyncStorage } from 'react-native';
import { Container, H2, Text, Button } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import _ from 'lodash';

import API from '../../lib/API';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import Logo from '../../images/empty_state/maintenance.png';

class MaintenancePage extends Component {
	constructor() {
		super();
		this.state = {
			ecardExists: false,
			appState: AppState.currentState
		};
	}

	componentDidMount() {
		this.getSystemStatus();
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentDidUpdate(prevProps) {
		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;
		// When screen changed.
		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			this.getSystemStatus();
		}
	}

	// When app was closed(background) and re-opened
	_handleAppStateChange = (nextAppState) => {
		if (
			this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
		) {
			this.getSystemStatus();
		}
		this.setState({appState: nextAppState});
	};

	async getSystemStatus() {
		const response = await API.settings.getSystemStatus();
		const systemStatus = _.get(response, 'data.system_status');
		if (systemStatus) {
			Actions.mainPage({ hideTabBar: true, type: ActionConst.REPLACE });
		}
		const checkEcard = await AsyncStorage.getItem(AsyncStorageKeys.ECARD_DETAILS);
		if (checkEcard) {
			this.setState({ ecardExists: true });
		}
	}

	render() {
		const { ecardExists } = this.state;
		return (
			<Container
				style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}
			>
				<Image
					style={{ width: '100%', resizeMode: 'contain', height: 290 }}
					source={Logo}
				/>
				<H2 style={{ color: '#141616', marginTop: 50, fontSize: 20, fontWeight: '600', lineHeight: 24, letterSpacing: 0 }}>Oops...</H2>

				<Text style={{ width: 351, textAlign: 'center', color: '#828282', marginTop: 20, fontSize: 12, fontWeight: 'normal', lineHeight: 14, letterSpacing: 0 }}>Our system is currently under maintenance, please come back later.</Text>

				{ecardExists &&
					<Button
						rounded
						style={{ marginTop: 50, backgroundColor: '#059A63', width: 140, height: 31, justifyContent: 'center' }}
						onPress={() => Actions.studentCardPage()}
					><Text style={{ fontSize: 12, lineHeight: 14, fontWeight: '700' }}>VISIT ECARD</Text></Button>
				}
			</Container>
		);
	};
};

export default MaintenancePage;
