import React, { Component } from 'react';
import { Container, Content, Text, Body, Right, List, ListItem, Icon } from 'native-base';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { withTranslation } from 'react-i18next';
import { ProgressDialog } from 'react-native-simple-dialogs';
import RNRestart from 'react-native-restart';

import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';

import Loading from '../../components/UI/Loading';
import MemebershipSection from './components/MembershipSection';


class MePage extends Component {
	constructor() {
		super();
		this.state = {
			// first load page
			loading: false,
			loadingLogout: false,
			hasPin: false,
			// subscriptions
			subscriptions: []
		};
	}

	async componentDidMount() {
		await this.getMe();
	}

	async getMe() {
		this.setState({ loading: true });
		const getSubscriptionRes = await API.subscriptions.getSubscriptions({ type: 'alumni_association' });
		if (getSubscriptionRes.meta.code !== 200) {
			AlertUtility.show('ERROR', getSubscriptionRes.meta.message);
			this.setState({ loading: false });
			return;
		}
		console.log({ subscriptions: getSubscriptionRes.data.subscriptions });
		this.setState({
			loading: false,
			subscriptions: getSubscriptionRes.data.subscriptions
		});

		this.getPincodeStatus();
	}

	async getPincodeStatus() {
		const checkPin = await AsyncStorage.getItem(AsyncStorageKeys.USER_APPLOCK_PIN);
		if (!checkPin) {
			this.setState({ hasPin: false });
			return;
		}

		this.setState({hasPin: true});
	}

	async handleLogout() {
		this.setState({ loadingLogout: true });
		const response = await API.auth.logout();

		if (response.meta.code !== 200) {
			AlertUtility.show('ERROR', response.meta.message);
			this.setState({ loadingLogout: false });
			return;
		}

		// remove session token
		await AsyncStorage.multiRemove([AsyncStorageKeys.USER_AUTH_TOKEN, AsyncStorageKeys.USER_ID, AsyncStorageKeys.DONE_ONBOARD, AsyncStorageKeys.ECARD_DETAILS, AsyncStorageKeys.USER_APPLOCK_PIN, AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC]);
		this.setState({ loadingLogout: false });
		RNRestart.Restart();
	}

	render = () => {
		const { loading, loadingLogout, subscriptions, hasPin } = this.state;

		if (loading) {
			return (<Container><Loading /></Container>);
		}

		return (
			<Container>
				<Content>
					<List style={{ backgroundColor: 'white' }}>
						<ListItem
							itemDivider
							icon
						/>
						<ListItem
							icon
							onPress={() => Actions.editProfilePage()}
						>
							<Body>
								<Text>Edit Profile</Text>
							</Body>
							<Right>
								<Icon
									type="Entypo"
									name="chevron-right"
								/>
							</Right>
						</ListItem>
						<ListItem
							icon
							onPress={() => Actions.pushNotificationPage()}
						>
							<Body>
								<Text>Push Notification</Text>
							</Body>
							<Right>
								<Icon
									type="Entypo"
									name="chevron-right"
								/>
							</Right>
						</ListItem>
						<ListItem
							icon
							onPress={() => Actions.appLockPage({hasPin, checkHasPin: this.getPincodeStatus.bind(this)})}
						>
							<Body>
								<Text>Passcode App Lock</Text>
							</Body>
							<Right>
								{hasPin ? <Text>Click to Modify</Text> : <Text>Click to Configure</Text>}
								<Icon
									type="Entypo"
									name="chevron-right"
								/>
							</Right>
						</ListItem>
						<MemebershipSection subscriptions={subscriptions} />
						<ListItem
							itemDivider
							icon
						/>
						<ListItem
							icon
							onPress={() => Actions.termsPage()}
						>
							<Body>
								<Text>Terms of Service</Text>
							</Body>
							<Right>
								<Icon
									type="Entypo"
									name="chevron-right"
								/>
							</Right>
						</ListItem>
						<ListItem
							icon
							onPress={() => Actions.privacyPage()}
						>
							<Body><Text>Privacy Policy</Text></Body>
							<Right>
								<Icon
									type="Entypo"
									name="chevron-right"
								/>
							</Right>
						</ListItem>
						<ListItem
							itemDivider
							icon
						/>
						<ListItem
							icon
							onPress={() => this.handleLogout()}
							noIndent
						>
							<Body><Text style={{ textAlign: 'center', color: '#ed1b2f' }}>Logout</Text></Body>
						</ListItem>
					</List>
				</Content>
				<ProgressDialog
					visible={loadingLogout}
					message="Loading..."
				/>
			</Container>
		);
	}
}

export default withTranslation()(MePage);
