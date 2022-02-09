/* eslint-disable no-nested-ternary */
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { Container, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import _ from 'lodash';
import { ScrollView } from 'react-native-gesture-handler';
import Highlights from '../../components/Highlights';
import API from '../../lib/API';
import FabECard from '../../components/FabECard';
import Loading from '../../components/UI/Loading';
import AlertUtility from '../../lib/AlertUtility';
import ApplyForAccessModal from './components/ApplyForAccessModal';
import IconButton from './components/IconButton';
import NoBookingFound from './components/NoBookingFound';
import BookingRow from './components/BookingRow';
import SubscriptionModal from './components/SubscriptionModal';
import RenewSubscriptionModal from './components/RenewSubscriptionModal';

class FacilityBookingPage extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			togglApplyAccessModal: false,
			toggleSubscriptionModal: false,
			toggleRenewModal: false,
			facilityTypes: [],
			bookings: [],
			subscriptions: [],
			expirationDate: '',
			isFetchingBookingInfo: false,
			isFetchingFacilityTypes: false,
			isRefreshing: false,
			hasSubscription: false,
			highlights: []
		};
	}

	async componentDidMount() {
		this.getSubscriptions();
		this.getFBSStatus();
	}

	componentDidUpdate(prevProps) {
		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;
		// reload when screen is focused
		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			this.getSubscriptions();
			Actions.refresh({ title: 'Facilities Booking' });
			Actions.refresh({ right: () => <View style={{marginRight: 15}}><TouchableOpacity onPress={this.handleSubscriptionTogglModal}><Text style={{color: '#FFFFFF', fontSize: 16}}>Subscription</Text></TouchableOpacity></View> });
		}
	}

	getFBSStatus = async () => {
		const response = await API.fbs.getFBSStatus();
		if(response.data.status === 'unavailable') {
			AlertUtility.show('', response.data.message);
		}
	}

	fetchFacilityTypes = async () => {
		this.setState({isFetchingFacilityTypes: true});
		const response = await API.fbs.getFacilityTypes();

		if (response.meta.code !== 200) {
			AlertUtility.show('ERROR', response.meta.message);
			return;
		}

		const facilityTypes = _.get(response, 'data.facility_types');
		this.setState({
			facilityTypes,
			isFetchingFacilityTypes: false
		});
	};

	fetchBookingInfo = async () => {
		this.setState({isFetchingBookingInfo: true});
		const response = await API.fbs.getBookingInformation({
			start_date: moment().format('YYYY-MM-DD'),
			end_date: moment().add(1, 'day').format('YYYY-MM-DD')
		});

		if (response.meta.code !== 200) {
			AlertUtility.show('ERROR', response.meta.message);
			return;
		}

		const bookings = [];
		for (let i = 0; i < response.data.bookings.length; i++) {
			const booking = response.data.bookings[i];
			// if (moment(`${booking.date} ${booking.start_time}`.trim()).isBefore(moment())) {
			// 	continue;
			// }
			bookings.push(booking);
		}

		this.setState({
			bookings,
			isFetchingBookingInfo: false
		});
	};

	getSubscriptions = async () => {
		await this.fetchFacilityTypes();
		await this.fetchBookingInfo();

		const response = await API.subscriptions.getSubscriptions({ type: 'sports' });
		if (response.meta.code !== 200) {
			AlertUtility.show('ERROR', response.meta.message);
			return;
		}
		const { subscriptions } = response.data;

		if (subscriptions.length === 0) {
			this.setState({ togglApplyAccessModal: true });
			return;
		}

		const subscription = subscriptions[0];

		const expirationDate = subscription.subscription_expiry_date;
		const hasSubscription = subscription.has_subscription;
		const canSubscribe = subscription.can_subscribe;
		const applyType = subscription.apply_type;

		this.setState({ subscriptions, expirationDate, hasSubscription });

		if(!hasSubscription){
			this.setState({ togglApplyAccessModal: true });
			return;
		}
		if(canSubscribe && applyType === 'New'){
			this.setState({ togglApplyAccessModal: true });
			return;
		}
		if(canSubscribe && applyType === 'Renew'){
			const expDate = moment(expirationDate).format('YYYY-MM-DD');
			const isExpiring = this.showRenewModal(expDate);
			// const isExpired = this.isExpire(expDate);
			this.setState({ toggleRenewModal: isExpiring });
		}
	};

	handleApplyAccessTogglModal = () => {
		this.setState(prevState => {
			return{
				...prevState,
				togglApplyAccessModal: !prevState.togglApplyAccessModal
			};
		});
	};

	handleSubscriptionTogglModal = () => {
		this.setState(prevState => {
			return{
				...prevState,
				toggleSubscriptionModal: !prevState.toggleSubscriptionModal
			};
		});
	};

	handleRenewModal = () => {
		this.setState(prevState => {
			return{
				...prevState,
				toggleRenewModal: !prevState.toggleRenewModal
			};
		});
	};

	handlePressBtnIcon = facilityType => {
		const { hasSubscription } = this.state;
		Actions.calendarPage({
			pageTitle: facilityType.name,
			facilityType,
			hasSubscription
		});
	};

	chunk = (arr, size) =>
		arr
			.reduce((acc, _, i) =>
				(i % size)
					? acc
					: [...acc, arr.slice(i, i + size)]
			, []);

	renderFacilityTypes = icons => {
		// const newIcons = icons.length ? this.chunk(icons, 5) : [];
		// const defaultItem = [1, 2, 3, 4, 5];
		const newIcons = icons.length ? this.chunk(icons, 4) : [];
		const defaultItem = [1, 2, 3, 4];
		const firstRow = newIcons !== undefined && newIcons.length ? newIcons[0] : [];
		const secondRow = newIcons !== undefined && newIcons.length ? newIcons[1] : [];
		return(
			<>
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}>
					{
						firstRow && firstRow.length && defaultItem.map((n, index) => {
							const data = firstRow !== undefined && firstRow.length && firstRow[index];
							if(data){
								return(
									<IconButton
										label={data.name}
										onPress={() => this.handlePressBtnIcon(data)}
									/>
								);
							}
							return (
								<View style={{ marginBottom: 15}}>
									<View style={{height: 60, width: 60}}>
										<View style={{width: 26, height: 25, margin: 5}} />
									</View>
								</View>
							);
						})
					}
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}>
					{
						secondRow && secondRow.length && defaultItem.map((n, index) => {
							const data = secondRow !== undefined && secondRow.length && secondRow[index];
							if(data){
								return(
									<IconButton
										label={data.name}
										onPress={() => this.handlePressBtnIcon(data)}
									/>
								);
							}
							return (
								<View style={{ marginBottom: 15}}>
									<View style={{height: 60, width: 60}}>
										<View style={{width: 26, height: 25, margin: 5}} />
									</View>
								</View>
							);
						})
					}
				</View>
			</>
		);
	};

	getHours = (date, starTime, endTime) => {
		const sTime = moment(`${date} ${starTime}`).format('HH:mm:ss a');
		const eTime = moment(`${date} ${endTime}`).format('HH:mm:ss a');
		const st = moment(sTime, 'hh:mm:ss a');
		const et = moment(eTime, 'hh:mm:ss a');
		return `${et.diff(st, 'hours')} hr/s`;
	};

	showRenewModal = expDate => {
		const expires = moment(expDate).format('YYYY-MM-DD');
		const days = moment(expires).diff(moment(), 'days');
		if(days <= 31) {
			return true;
		}
		return false;
	};

	onRefresh = () => {
		this.setState({isRefreshing: true});
		this.getSubscriptions();
		this.setState({isRefreshing: false});
	};

	hasHighlight = (highlights) => {
		this.setState({
			highlights
		});
	}

	// isExpire = expDate => {
	// 	const expires = moment(expDate).format('YYYY-MM-DD');
	// 	const today = moment().format('YYYY-MM-DD');
	// 	const isSameOrAfter = moment(today).isSameOrAfter(expires);
	// 	if(isSameOrAfter){
	// 		return true;
	// 	} return false;
	// };

	render(){
		const {
			isRefreshing,
			facilityTypes,
			togglApplyAccessModal,
			toggleSubscriptionModal,
			toggleRenewModal,
			subscriptions,
			bookings,
			expirationDate,
			isFetchingFacilityTypes,
			isFetchingBookingInfo,
			highlights
		} = this.state;
		const chunkedFacilityTypes = this.chunk(facilityTypes, 8);
		const swiperDotColor = '#BDBEC0';
		const swiperActiveDotColor = '#013972';

		return (
			<SafeAreaView style={{flex: 1}}>
				<ScrollView
					onRefresh={this.onRefresh}
					refreshControl={
						<RefreshControl
							tintColor="#FFFFFF"
							colors={['#FFFFFF']}
							refreshing={isRefreshing}
							onRefresh={this.onRefresh}
						/>
					}
					style={{backgroundColor: '#0B3366'}}
				>
					<Container>
						<ApplyForAccessModal
							isOpen={togglApplyAccessModal}
							togglModal={this.handleApplyAccessTogglModal}
							subscriptions={subscriptions}
						/>
						<SubscriptionModal
							isOpen={toggleSubscriptionModal}
							togglModal={this.handleSubscriptionTogglModal}
							expirationDate={expirationDate}
						/>
						<RenewSubscriptionModal
							isOpen={toggleRenewModal}
							togglModal={this.handleRenewModal}
							subscription={subscriptions}
							expirationDate={expirationDate}
						/>
						{highlights && highlights.length > 0 &&
						<View style={{ height: 69, width: '100%', backgroundColor: '#0B3366', position: 'absolute', top: 0, zIndex: -1 }} />
						}
						<Highlights
							location="facility"
							hasHighlight={this.hasHighlight}
						/>
						<Content>
							<View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
								<View>
									<Swiper
										loop={false}
										style={{
											height: facilityTypes.length === 0
												? 0
												: facilityTypes.length > 4 ? 180 : 70,
											marginTop: 8
										}}
										paginationStyle={styles.swiperPagination}
										dotColor={swiperDotColor}
										dotStyle={styles.swiperDotStyle}
										activeDotStyle={{ ...styles.swiperDotStyle, ...styles.swiperActiveDotStyle }}
										activeDotColor={swiperActiveDotColor}
									>
										{
											isFetchingFacilityTypes
												? <Loading />
												: chunkedFacilityTypes.map((facilityType,index) =>
													<View
														key={index}
														style={styles.iconsContainer}
													>
														{this.renderFacilityTypes(facilityType)}
													</View>)
										}
									</Swiper>
								</View>
							</View>

							<View style={styles.bookingsContainer}>
								<Text style={styles.bookingTitle}>
									Coming Reservations
								</Text>
								{
									isFetchingBookingInfo && <Loading />
								}
								{
									!isFetchingBookingInfo && bookings.length === 0 && <NoBookingFound />
								}
								{
									!isFetchingBookingInfo && bookings.length > 0 &&
									bookings.map(booking =>
										<BookingRow booking={booking} />
									)
								}
							</View>
						</Content>
					</Container>
				</ScrollView>
				<FabECard />
			</SafeAreaView>
		);
	}
};

const styles = StyleSheet.create({
	highlightsHolder: {
		height: 100,
		backgroundColor: '#003366',
		zIndex: 99
	},
	swiperPagination: {
		position: 'absolute',
		bottom: -5
	},
	swiperDotStyle: {
		width: 38,
		height: 6,
		borderRadius: 6,
		marginLeft: (38 / 4) * -1,
		marginRight: (38 / 4) * -1,
		zIndex: 1
	},
	swiperActiveDotStyle: {
		zIndex: 2
	},
	iconsContainer: {
		// display: 'flex',
		// flexDirection: 'column'
		// marginLeft: 14,
		// marginRight: 14
		// marginLeft: 2
	},
	//
	bookingsContainer: {
		marginTop: 12,
		marginBottom: 80,
		marginLeft: 12,
		marginRight: 12
	},
	bookingTitle: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#003366',
		marginBottom: 12
	}
});

export default FacilityBookingPage;