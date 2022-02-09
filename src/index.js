/* eslint-disable react/sort-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Stack, Scene, Tabs, Actions } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';
import SplashScreen from 'react-native-splash-screen';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Root, StyleProvider, Icon } from 'native-base';
import { Platform, StyleSheet, StatusBar, View, TouchableOpacity, Text } from 'react-native';
import getTheme from '../native-base-theme/components';
import theme from '../native-base-theme/variables/commonColor';
import CasLoginPage from './containers/CasLoginPage';

import Loading from './components/UI/Loading';

import SplashPage from './containers/SplashPage';
import LoginPage from './containers/LoginPage';

import HomePage from './containers/HomePage';

import OnboardPage from './containers/OnboardPage';
import HappeningsPage from './containers/HappeningsPage';
import HappeningDetailPage from './containers/HappeningDetailPage';
import NotificationPage from './containers/NotificationPage';
import MePage from './containers/MePage';
import NewsDetailPage from './containers/NewsDetailPage';
import HighlightDetailPage from './containers/HighlightDetailPage';

import RegistrationFormPage from './containers/RegistrationFormPage';
import RegistrationFormPreviewPage from './containers/RegistrationFormPreviewPage';

import USTransitPage from './containers/USTransitPage';
import JobsPage from './containers/JobsPage';
import JobDetailPage from './containers/JobDetailPage';
import LibraryPage from './containers/LibraryPage';
import SubscriptionPage from './containers/SubscriptionPage';

import DonationsPage from './containers/DonationsPage';
import DonationDetailPage from './containers/DonationDetailPage';
import StudentCardPage from './containers/StudentCardPage';
import SavingsPage from './containers/SavingsPage';
import OffersDetailPage from './containers/OffersDetailPage';

import DonateNowPage from './containers/DonateNowPage';
import ParkingPage from './containers/ParkingPage';

import FacilityBookingPage from './containers/FacilityBookingPage';
import SportsFacilitiesApplyNowPage from './containers/FacilityBookingPage/Pages/SportsFacilitiesApplyNowPage';
import SportsFacilitiesPaymentPage from './containers/FacilityBookingPage/Pages/SportFacilitiesPaymentPage';
import CalendarPage from './containers/FacilityBookingPage/Pages/CalendarPage';
// Me Page
import EditProfilePage from './containers/EditProfilePage';
import PushNotificationPage from './containers/PushNotificationPage';
import AppLockPage from './containers/AppLockPage';
import AlumniMembershipPage from './containers/AlumniMembershipPage';
import AlumniWineMembershipPage from './containers/AlumniWineMembershipPage';
import TermsPage from './containers/TermsPage';
import PrivacyPage from './containers/PrivacyPage';

// Web Views
import TranscriptPage from './containers/TranscriptPage';
import SouvenirPage from './containers/SouvenirPage';
import PathAdvisorPage from './containers/PathAdvisorPage';
import HelpPage from './containers/HelpPage';
import ExternalEventPage from './containers/ExternalEventPage';
import PaymentPage from './containers/PaymentPage';
import CardImagePage from './containers/StudentCardPage/components/CardImagePage';

// Maintenance
import MaintenancePage from './containers/MaintenancePage';

// Empty State Screen
import LoginRequiredEmptyStatePage from './containers/LoginRequiredEmptyStatePage';

import NotifService from './NotifService';

import en from './translations/en.json';
import tc from './translations/tc.json';
import i18n from './i18n';
import AuthenticationHelper from './lib/Authentication';
import UploadProfileImagePage from './containers/UploadProfileImagePage';
import PrivacyPolicyPage from './containers/PrivacyPolicyPage';

const resources = {
	en: { translation: en },
	tc: { translation: tc }
};

// const SkipIcon = () => {
// 	return (
// 		<View
// 			style={{ marginRight: 10  }}
// 		>
// 			<TouchableOpacity
// 				onPress={() => Actions.mainPage({ hideTabBar: true, type: ActionConst.REPLACE })}
// 				style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
// 			>
// 				<Text style={{ color: 'white', fontWeight: 'bold' }}>Get Started</Text>
// 			</TouchableOpacity>
// 		</View>
// 	);
// };

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: false,
			loading: true,
			self_i18n: null
		};
	}

	async componentDidMount() {
		PushNotificationIOS.addEventListener('registrationError', console.log);
		if (Platform.OS === 'android' || Platform.OS === 'ios') {
			StatusBar.setBarStyle('light-content', true);
			StatusBar.setBackgroundColor('#003366');
		}
		this.initI18n();

		// Check session
		const isLoggedIn = await AuthenticationHelper.isLoggedIn();
		this.setState({ isLoggedIn });
	}

	initI18n() {
		const self = this;
		i18n.init({ resources }, () => {
			console.log('initialized from src/index.js');
			SplashScreen.hide();
			self.setState({
				loading: false,
				self_i18n: i18n
			});
		});
	}

	onBackPress = () => {
		if (Actions.state.index === 0) {
			return false;
		}
		Actions.pop();
		return true;
	}

	render() {
		const { loading, self_i18n, isLoggedIn } = this.state;
		const { store, persistor } = this.props;
		if (loading || !self_i18n) {
			return <Loading />;
		}

		const sceneStyles = {
			navigationBarStyle: styles.navBar,
			titleStyle: styles.navBarTitle,
			backButtonTintColor: '#fff'
		};

		return (
			<Root>
				<NotifService>
					<Provider store={store}>
						<PersistGate
							loading={<Loading />}
							persistor={persistor}
						>
							<StyleProvider style={getTheme(theme)}>
								<Router
									backAndroidHandler={this.onBackPress}
									navBarButtonColor="white"
								>
									<Stack key="root">
										<Stack hideNavBar>
											<Scene
												key="splashPage"
												component={SplashPage}
											/>

											<Scene
												key="maintenancePage"
												component={MaintenancePage}
												onEnter={() => {
													Actions.refresh({
														enterTime: new Date()
													});
												}}
											/>

											{/* <Scene
												hideNavBar={false}
												key="loginPage"
												title="Login"
												component={LoginPage}
												{...sceneStyles}
											/> */}

											<Scene
												hideNavBar={false}
												key="casLoginPage"
												title="Login"
												component={CasLoginPage}
												back
												{...sceneStyles}
											/>

											<Scene
												hideNavBar={true}
												key="onboardPage"
												// renderRightButton={SkipIcon()}
												component={OnboardPage}
												renderBackButton={() => (null)}
												renderLeftButton={() => (null)}
												{...sceneStyles}
											/>

											<Scene
												hideNavBar={false}
												key="happeningsPage"
												component={HappeningsPage}
												title="Happenings"
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="happeningDetailPage"
												title="Happening Details"
												component={HappeningDetailPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="registrationFormPage"
												title="Registration Details"
												component={RegistrationFormPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="registrationFormPreviewPage"
												title="View Summary"
												component={RegistrationFormPreviewPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="USTransitPage"
												title="USTransit"
												component={USTransitPage}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
												back
											/>
											<Scene
												hideNavBar={false}
												key="libraryPage"
												title="Library"
												component={LibraryPage}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
												onEnter={() => {
													Actions.refresh({
														enterTime: new Date()
													});
												}}
												back
											/>
											<Scene
												hideNavBar={false}
												key="subscriptionPage"
												title="Subscription"
												component={SubscriptionPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="jobsPage"
												title="Job Board"
												component={JobsPage}
												back
												onEnter={() => {
													Actions.refresh({
														enterTime: new Date()
													});
												}}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
											// {...sceneStyles}
											/>
											<Scene
												hideNavBar={false}
												key="jobDetailPage"
												title="Job Description"
												component={JobDetailPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="newsDetailPage"
												title="News Details"
												component={NewsDetailPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="highlightDetailPage"
												title="Highlight Details"
												component={HighlightDetailPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="transcriptPage"
												title="Transcript"
												{...sceneStyles}
												component={TranscriptPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="souvenirPage"
												title="Souvenir"
												{...sceneStyles}
												component={SouvenirPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="pathAdvisorPage"
												title="Path Advisor"
												{...sceneStyles}
												component={PathAdvisorPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="helpPage"
												title="Help"
												{...sceneStyles}
												component={HelpPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="donationsPage"
												title="Donations"
												{...sceneStyles}
												component={DonationsPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="donationDetailPage"
												title="Project Detail"
												{...sceneStyles}
												component={DonationDetailPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="donateNowPage"
												title="Give to UST"
												{...sceneStyles}
												component={DonateNowPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="externalEventPage"
												title="Registration"
												{...sceneStyles}
												component={ExternalEventPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="paymentPage"
												title="Payment"
												{...sceneStyles}
												component={PaymentPage}
												back
											/>
											<Scene
												hideNavBar={false}
												key="parkingPage"
												title="Parking"
												{...sceneStyles}
												component={ParkingPage}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
												back
											/>

											<Scene
												hideNavBar={false}
												key="studentCardPage"
												title="Alum eCard"
												{...sceneStyles}
												component={StudentCardPage}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
												back
											/>

											<Scene
												hideNavBar={false}
												key="cardImagePage"
												title="Student Card"
												{...sceneStyles}
												component={CardImagePage}
												back
											/>

											<Scene
												hideNavBar={false}
												key="savingsPage"
												title="Savings"
												{...sceneStyles}
												component={SavingsPage}
												onRight={() => Actions.studentCardPage()}
												rightTitle="eCard"
												renderRightButton={() => (
													<View style={{ marginRight: 10 }}>
														<TouchableOpacity
															onPress={async () => {
																return await AuthenticationHelper.isLoggedIn() ? Actions.studentCardPage() : Actions.casLoginPage();
															}}
															style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
														>
															<Icon
																type="MaterialIcons"
																name="contact-mail"
																style={{ fontSize: 20, color: '#FFF', marginRight: 5 }}
															/>
															<Text style={{ color: 'white', fontWeight: 'bold' }}>eCard</Text>
														</TouchableOpacity>
													</View>
												)}
												back
											/>

											<Scene
												hideNavBar={false}
												key="offersDetailPage"
												title=""
												{...sceneStyles}
												component={OffersDetailPage}
												back
											/>

											<Scene
												hideNavBar={false}
												key="facilityBookingPage"
												title="Facilities Booking"
												{...sceneStyles}
												component={FacilityBookingPage}
												onEnter={() => {
													Actions.refresh({
														enterTime: new Date()
													});
												}}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
												back
											/>

											<Scene
												hideNavBar={false}
												key="sportsFacilitiesApplyNowPage"
												title="Sports Facilities"
												{...sceneStyles}
												component={SportsFacilitiesApplyNowPage}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
												back
											/>

											<Scene
												hideNavBar={false}
												key="sportsFacilitiesPaymentPage"
												title="Sports Facilities"
												{...sceneStyles}
												component={SportsFacilitiesPaymentPage}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
												back
											/>

											<Scene
												hideNavBar={false}
												key="calendarPage"
												title=" "
												{...sceneStyles}
												component={CalendarPage}
												onEnter={() => {
													Actions.refresh({
														enterTime: new Date()
													});
												}}
												navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
												back
											/>

											<Scene
												hideNavBar={false}
												key="editProfilePage"
												title="Edit Profile"
												component={EditProfilePage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="pushNotificationPage"
												title="Push Notification"
												component={PushNotificationPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="appLockPage"
												title="Passcode App Lock"
												component={AppLockPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="alumniMembershipPage"
												title="Alumni Membership"
												component={AlumniMembershipPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												key="alumniWineMembershipPage"
												title="Alumni Wine Membership"
												component={AlumniWineMembershipPage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												title="Terms of Service"
												key="termsPage"
												component={TermsPage}
												back
												{...sceneStyles}
											/>
											<Scene
												hideNavBar={false}
												title="Privacy Policy"
												key="privacyPage"
												component={PrivacyPage}
												back
												{...sceneStyles}
											/>
											<Scene
												hideNavBar={false}
												title="My Profile"
												key="uploadProfileImagePage"
												component={UploadProfileImagePage}
												{...sceneStyles}
												back
											/>
											<Scene
												hideNavBar={false}
												title="Privacy Policy"
												key="privacyPolicyPage"
												component={PrivacyPolicyPage}
												{...sceneStyles}
												back
											/>


											<Scene
												hideNavBar
												key="mainPage"
												gesturesEnabled={false}
											>
												<Tabs
													key="tabbar"
													swipeEnabled
													showLabel
													activeTintColor="#003366"
													inactiveTintColor="#8c8f90"
													back={false}
												>
													<Stack
														key="homePage"
														title="Home"
														icon={props => <Icon
															type="MaterialIcons"
															name="home"
															style={{ fontSize: 20, color: props.focused ? '#003366' : '#999' }}
														/>}
													>
														<Scene
															hideNavBar={false}
															key="homePage"
															title="Welcome"
															component={HomePage}
															onEnter={() => {
																Actions.refresh({
																	enterTime: new Date()
																});
															}}
															{...sceneStyles}
															navigationBarStyle={{ ...styles.navBar, borderBottomWidth: 0 }}
														/>
													</Stack>

													<Stack
														key="notificationsPage"
														title="Notifications"
														icon={props => {
															// const BadgedIcon = withBadge(5)(Icon);
															// return (
															// 	<BadgedIcon
															// 		type="MaterialIcons"
															// 		name="notifications-active"
															// 		style={{ fontSize: 20, color: props.focused ? '#003366' : '#999' }}
															// 	/>
															// );
															return (
																<Icon
																	type="MaterialIcons"
																	name="notifications-active"
																	style={{ fontSize: 20, color: props.focused ? '#003366' : '#999' }}
																/>
															);
														}}
													>
														<Scene
															hideNavBar={false}
															key="notificationPage"
															title="Notification"
															component={isLoggedIn ? NotificationPage : LoginRequiredEmptyStatePage}
															onEnter={() => {
																Actions.refresh({
																	enterTime: new Date()
																});
															}}
															{...sceneStyles}
														/>
													</Stack>
													<Stack
														key="mePage"
														title="Me"
														icon={props => <Icon
															type="FontAwesome"
															name="user"
															style={{ fontSize: 20, color: props.focused ? '#003366' : '#999' }}
														/>}
													>
														<Scene
															hideNavBar={false}
															key="mePage"
															title="Me"
															component={isLoggedIn ? MePage : LoginRequiredEmptyStatePage}
															{...sceneStyles}
														/>
													</Stack>
												</Tabs>
											</Scene>
										</Stack>
									</Stack>
								</Router>
							</StyleProvider>
						</PersistGate>
					</Provider>
				</NotifService>
			</Root>
		);
	}
}

App.propTypes = {
	store: PropTypes.shape({}).isRequired,
	persistor: PropTypes.shape({}).isRequired
};

// custom styles
const stylesAndroid = StyleSheet.create({
	navBar: {
		backgroundColor: '#003366'
	},
	navBarTitle: {
		color: '#fff'
	},
	newReportButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 30,
		height: 30,
		borderRadius: 30 / 2,
		// backgroundColor: '#fff',
		marginRight: 10
	},
	newReportButtonIcon: {
		fontSize: 24,
		color: '#fff'
	}
});
const stylesIOS = StyleSheet.create({
	navBar: {
		backgroundColor: '#003366'
	},
	navBarTitle: {
		color: '#fff'
	},
	newReportButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 30,
		height: 30,
		borderRadius: 30 / 2,
		// backgroundColor: '#fff',
		marginRight: 10
	},
	newReportButtonIcon: {
		fontSize: 24,
		color: '#fff'
	}
});
const styles = Platform.OS === 'ios' ? stylesIOS : stylesAndroid;

export default App;
