import React, { Component } from 'react';
import _ from 'lodash';
import { Text, SafeAreaView, StatusBar, Platform, AsyncStorage } from 'react-native';
import { Body, Button, Container, Content, Icon, Left, Right, Switch, List, ListItem } from 'native-base';
import PINCode from '@haskkor/react-native-pincode';
import { Actions, ActionConst } from 'react-native-router-flux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TouchID from 'react-native-touch-id';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';

class AppLockPage extends Component {
	constructor() {
		super();
		this.state = {
			showChoosePin: false,
			hasPin: false,
			pinStatus: null,
			biometricType: null,
			disableTouchId: true,
			unlockWithBiometrics: false
		};
	};

	async componentDidMount() {
		const { hasPin, appLockPin, checkHasPin } = this.props;
		this.checkSupportedBiometric();
		this.checkUnlockBiometricState();
		this.setState({ hasPin });

		if(appLockPin) {
			StatusBar.setBarStyle('default', true);
		}

		if(checkHasPin) {
			checkHasPin();
		}
	}

	checkSupportedBiometric = () => {
		const { appUseBiometric } = this.props;

		const optionalConfigObject = {
			unifiedErrors: true, // use unified error messages (default false)
			passcodeFallback: false,
			fallbackLabel: 'Show Passcode'
		};

		TouchID.isSupported(optionalConfigObject).then(biometricType => {
			// Success
			if (biometricType === 'FaceID') {
				// If appUseBiometric is empty
				if(_.isNil(appUseBiometric)){
					this.setState({biometricType: 'faceid', disableTouchId: true});
					return;
				}
				this.setState({biometricType: 'faceid', disableTouchId: false});
			} else {
				if(_.isNil(appUseBiometric)){
					this.setState({biometricType: 'touchid', disableTouchId: true});
					return;
				}
				this.setState({biometricType: 'touchid', disableTouchId: false});
			}

		}).catch(error => {
			// Failure
			if(error.code === 'NOT_AVAILABLE') {
				this.setState({disableTouchId: true});
			}
		});
	}

	_showChoosePinLock = (update) => {
		if(update) {
			this.setState({
				hasPin: false,
				showChoosePin: true
			});
			return;
		}

		this.setState({
			showChoosePin: true
	 	});
	};

	_clearPinLock = async () => {
		const { checkHasPin } = this.props;
		await AsyncStorage.multiRemove([AsyncStorageKeys.USER_APPLOCK_PIN, AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC]);
		this.setState({
			hasPin: false,
			showChoosePin: false,
			unlockWithBiometrics: false
		});

		if(checkHasPin) {
			checkHasPin();
		};
	}

	handleResultChoosePin = async (pin) => {
		const { checkHasPin } = this.props;

		const storagePin = AsyncStorage.getItem(AsyncStorageKeys.USER_APPLOCK_PIN);
		if(storagePin) {
			AsyncStorage.removeItem(AsyncStorageKeys.USER_APPLOCK_PIN);
		}

		await AsyncStorage.setItem(AsyncStorageKeys.USER_APPLOCK_PIN, pin);
		this.setState({ hasPin: true });

		if(checkHasPin) {
			checkHasPin();
		};
	}

	handleResultEnterPin = async (pin) => {
		const { appLockPin } = this.props;

		if(pin !== appLockPin) {
			this.setState({ pinStatus: 'failure'});
			return;
		}

		Actions.homePage({ hasPin: true, unlocked: true, type: ActionConst.REPLACE });
	}

	handleUnlockBiometricSwitch = async () => {
		const unlockWithBiometrics = await AsyncStorage.getItem(AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC);

		if(!_.isNil(unlockWithBiometrics)) {
			await AsyncStorage.removeItem(AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC);
			this.setState({unlockWithBiometrics: false});
			return;
		}

		await AsyncStorage.setItem(AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC, 'enabled');
		this.setState({unlockWithBiometrics: true});
	}

	checkUnlockBiometricState = async () => {
		const unlockWithBiometrics = await AsyncStorage.getItem(AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC);

		if(!_.isNil(unlockWithBiometrics)) {
			this.setState({unlockWithBiometrics: true});
			return;
		}

		this.setState({unlockWithBiometrics: false});
	}

	renderAppLockSettings = () => {
		const { biometricType, unlockWithBiometrics } = this.state;
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
							onPress={() => this._clearPinLock()}
							noIndent
						>
							<Body><Text style={{ color: '#2B7EC6' }}>Turn Passcode Off</Text></Body>
						</ListItem>
						<ListItem
							icon
							onPress={() => this._showChoosePinLock(true)}
							noIndent
						>
							<Body><Text style={{ color: '#2B7EC6' }}>Change Passcode</Text></Body>
						</ListItem>
						<ListItem
							itemDivider
						>
							<Body>
								<Text style={{marginBottom: 15}}>
									After you set up a passcode, you will see a lock screen on the home page. You will need to enter this passcode to unlock the app.
								</Text>
								<Text style={{marginBottom: 10}}>
									Note: If you forgot the passcode, you will need to delete and reinstall the app.
								</Text>
							</Body>
						</ListItem>
						{biometricType &&
							<ListItem>
								<Left>
									<Text>Unlock with {biometricType === 'faceid' ? 'Face ID' : Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint'} </Text>
								</Left>
								<Right>
									<Switch
										value={unlockWithBiometrics}
										onChange={() => this.handleUnlockBiometricSwitch()}
									/>
								</Right>
							</ListItem>
						}
					</List>
				</Content>
			</Container>
		);
	};

	handleLaunchTouchIDButton = () => {
		const { appLockPin } = this.props;
		const optionalConfigObject = {
			imageColor: '#e00606',
			imageErrorColor: '#ff0000',
			sensorDescription: 'Touch sensor',
			sensorErrorDescription: 'Failed',
			cancelText: 'Cancel',
			fallbackLabel: 'Show Passcode',
			unifiedErrors: false,
			passcodeFallback: false
		};

		console.log('~~~handleLaunch');

		TouchID.authenticate('To unlock your application', optionalConfigObject)
			.then(() => {
				this.handleResultEnterPin(appLockPin);
			})
			.catch(error => {
				console.log('Error:', error);
			});
	}

	render() {
		const { showChoosePin, hasPin, pinStatus, biometricType, disableTouchId } = this.state;
		const { appLockPin, appUseBiometric } = this.props;

		return (
			!hasPin ? (
				showChoosePin ? ( // If "Turn Passcode On" clicked
					<PINCode
						status="choose"
						storePin={(pin) => {
							this.handleResultChoosePin(pin);
						}}
						colorPassword="#282828"
						colorPasswordEmpty="transparent"
						passwordLength={4}
						stylePinCodeCircle={{ width: 20, height: 20, borderRadius: 50, borderStyle: 'solid', borderColor: '#282828', borderWidth: 2}}
						stylePinCodeTextTitle={{marginBottom: -50, fontWeight: '300'}}
						numbersButtonOverlayColor="#ccc"
						titleChoose="Enter a passcode"
						subtitleChoose=" "
						titleConfirm="Re-enter your new passcode"
						delayBetweenAttempts={1000}
						stylePinCodeColorTitle="#000"
						stylePinCodeDeleteButtonColorShowUnderlay = "rgb(211, 213, 218)"
						stylePinCodeButtonNumber="#282828"
						stylePinCodeButtonCircle={{height: 80, width: 80, borderRadius: 50}} // Button Circle
						stylePinCodeColumnButtons={{marginLeft: 20, marginRight: 20, marginBottom: 50}} // Button columns
						stylePinCodeRowButtons={{marginBottom: 5}} // Button rows
						stylePinCodeTextButtonCircle={{fontWeight: '300'}} // Number inside button
						stylePinCodeColumnDeleteButton={{marginTop: 20}}
						stylePinCodeDeleteButtonColorHideUnderlay="#282828"
					/>
				) :  ( // Passcode first time config
					<Container style={{ flex: 1, flexDirection: 'column'}} >
						<SafeAreaView style={{marginTop: '30%', marginBottom: '50%'}}>
							<Icon
								type="MaterialIcons"
								name="phonelink-lock"
								style={{alignSelf: 'center', fontSize: 150, marginBottom: 30}}
							/>
							<Text style={{alignSelf: 'center', fontWeight: '500', fontSize: 15}}>Passcode Lock</Text>
							<Text style={{alignSelf: 'center', textAlign: 'center', marginLeft: '5%', marginRight: '5%', marginTop: 30}}>
								After you set up a passcode, you will see a lock screen on the home page. You will need to enter this passcode to unlock the app.
							</Text>
							<List style={{ backgroundColor: 'white', marginTop: 30 }}>
								<ListItem
									icon
									onPress={() => this._showChoosePinLock()}
									noIndent
								>
									<Body><Text style={{ textAlign: 'center', color: '#2B7EC6' }}>Turn Passcode On</Text></Body>
								</ListItem>
							</List>
							<Text style={{alignSelf: 'center', textAlign: 'center', marginLeft: '5%', marginRight: '5%', marginTop: 30}}>
								Note: If you forgot the passcode, you will need to delete and reinstall the app.
							</Text>
						</SafeAreaView>
					</Container>
				)
			) : hasPin && appLockPin ? ( // From HomePage
				<PINCode
					status="enter"
					// endProcessFunction={(pin) => console.log('EndProcess', pin)}
					pinStatus={pinStatus}
					handleResultEnterPin={(pin) => this.handleResultEnterPin(pin)}
					bottomLeftComponent={() => {
						 return disableTouchId ? null :
							biometricType === 'faceid' ? (
								<TouchableOpacity onPress={() => this.handleLaunchTouchIDButton()}>
									<MaterialCommunityIcons
										name="face-recognition"
										type="MaterialCommunityIcons"
										style={{ fontSize: 30, color: '#282828' }}
									/>
								</TouchableOpacity>
							) : (
								Platform.OS === 'ios' ? (
									<TouchableOpacity onPress={() => this.handleLaunchTouchIDButton()}>
										<Icon
											type="Entypo"
											name="fingerprint"
											style={{ fontSize: 30, color: '#282828' }}
										/>
									</TouchableOpacity>
								) : (
									<TouchableOpacity style={{marginTop: -10, marginLeft: -12 }}>
										<Button
											onPress={() => this.handleLaunchTouchIDButton()}
											transparent
											style={{ width: 60 }}
										>
											<Icon
												type="Entypo"
												name="fingerprint"
												style={{ fontSize: 30, color: '#282828' }}
											/>
										</Button>
									</TouchableOpacity>
								)
							);
					}}
					maxAttempts={9999}
					colorPassword="#282828"
					colorPasswordEmpty="transparent"
					passwordLength={4}
					stylePinCodeCircle={{ width: 20, height: 20, borderRadius: 50, borderStyle: 'solid', borderColor: '#282828', borderWidth: 2}}
					numbersButtonOverlayColor="#ccc"
					delayBetweenAttempts={1000}
					titleEnter="Enter your HKUST Alumni Passcode"
					stylePinCodeColorTitle="#000"
					stylePinCodeTextTitle={{marginBottom: -50, fontWeight: '300'}}
					touchIDDisabled={!biometricType || disableTouchId && !appUseBiometric}
					storedPin={appLockPin}
					stylePinCodeDeleteButtonColorShowUnderlay = "rgb(211, 213, 218)"
					stylePinCodeButtonNumber="#282828"
					stylePinCodeButtonCircle={{height: 80, width: 80, borderRadius: 50}} // Button Circle
					stylePinCodeColumnButtons={{marginLeft: 20, marginRight: 20, marginBottom: 50}} // Button columns
					stylePinCodeRowButtons={{marginBottom: 5}} // Button rows
					stylePinCodeTextButtonCircle={{fontWeight: '300'}} // Number inside button
					stylePinCodeColumnDeleteButton={{marginTop: 20}}
					stylePinCodeDeleteButtonColorHideUnderlay="#282828"
				/>
			) : this.renderAppLockSettings() // Else render app lock settings
		);
	}
}

export default AppLockPage;
