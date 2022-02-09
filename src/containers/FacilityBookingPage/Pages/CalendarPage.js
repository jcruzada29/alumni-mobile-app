import React from 'react';
import { View, Text, ScrollView, Alert, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Icon } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import moment from 'moment';
import _ from 'lodash';
import CalendarStrip from 'react-native-calendar-strip';
import TimeslotsList from '../components/TimeslotsList';
import RenderInput from '../components/RenderInput';
import API from '../../../lib/API';
import Loading from '../../../components/UI/Loading';
import AlertUtility from '../../../lib/AlertUtility';

class CalendarPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			selectedDate: moment(),
			showForm: false,
			uniqueTimeslots: [],
			facilities: [],
			selectedFacilityIds: [],
			// selectedItems: [],
			saving: false,
			isFetchTimeslots: false
		};
	}

	async componentDidMount() {
		this.fetchTimeslots();
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.selectedDate !== this.state.selectedDate) {
			const { booking } = this.props;
			if(!booking) {
				this.fetchTimeslots();
				// eslint-disable-next-line react/no-did-update-set-state
				this.setState({showForm: false});
			}
		}
		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;
		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			Actions.refresh({ title: this.props.pageTitle });
		}
	}

	fetchTimeslots = async () => {
		this.setState({ isFetchTimeslots: true });

		const { facilityType } = this.props;
		const { selectedDate } = this.state;

		const response = await API.fbs.getFacilities({
			facility_type_id: facilityType.id
		});
		const { facilities } = response.data;
		const allTimeslots = [];

		for (let i = 0; i < facilities.length; i++) {
			// fetch timeslots for each facilities
			const res = await API.fbs.getFacilityTimeslots({
				facility_id: facilities[i].id,
				start_date: moment(selectedDate).format('YYYY-MM-DD'),
				end_date: moment(selectedDate).format('YYYY-MM-DD')
			});
			if (res.meta.code !== 200) {
				AlertUtility.show('ERROR', res.meta.message);
				return;
			}
			if (res.data.facility_timeslots.length === 0) {
				continue;
			}
			facilities[i].timeslots = res.data.facility_timeslots;
			for (let j = 0; j < facilities[i].timeslots.length; j++) {
				allTimeslots.push(facilities[i].timeslots[j]);
			}
		}

		this.setState({
			facilities,
			selectedFacilityIds: facilities.map(f => f.id),
			uniqueTimeslots: _.uniqBy(allTimeslots, o => o.start_time).map(uniqueTimeslot => ({
				date: uniqueTimeslot.date,
				start_time: uniqueTimeslot.start_time,
				end_time: uniqueTimeslot.end_time,
				facility_timeslots: _.flatten(facilities.map(f => {
					return _.filter(f.timeslots, timeslot => uniqueTimeslot.start_time === timeslot.start_time);
				}))
			})),
			isFetchTimeslots: false
		 });
	}

	handleOnDateSelect = day => {
		const { booking } = this.props;
		if(!booking){
			this.setState({ selectedDate: day });
		}
	};

	handlePressBack = () => {
		this.setState({showForm: false});
		Actions.refresh({ title: this.props.pageTitle });
		if(this.props.booking){
			Actions.pop();
		}
	};

	handlePressCancel = async () => {
		if (this.state.saving) {
			return;
		}
		const { booking } = this.props;
		this.setState({ saving: true });
		const response = await API.fbs.cancelBookingById(booking.id);
		if(_.get(response, 'meta.code') !== 200){
			this.setState({ saving: false });
			Alert.alert(_.get(response, 'meta.message', ''));
			return;
		}
		Alert.alert('Successfully canceled!');
		this.setState({
			showForm: false,
			saving: false
		});
		Actions.pop();
	};

	handlePressReserve = async () => {
		if (this.state.saving) {
			return;
		}
		const { hasSubscription } = this.props;
		const { selectedFacilityTimeslot } = this.state;

		// Ignore if no subscription
		if(!hasSubscription){
			return;
		}

		this.setState({ saving: true });

		// create booking
		const response = await API.fbs.makeBooking({
			'facility_id': selectedFacilityTimeslot.facility_id,
			'date': selectedFacilityTimeslot.date,
			'start_time': selectedFacilityTimeslot.start_time,
			'end_time': selectedFacilityTimeslot.end_time
		});
		if(_.get(response, 'meta.code') !== 200){
			this.setState({ saving: false });
			Alert.alert(_.get(response, 'meta.message', ''));
			return;
		}
		Alert.alert('Successfully reserved!');
		this.setState({
			showForm: false,
			saving: false
		});
		Actions.pop();
	};

	renderButton = type => {
		const { saving } = this.state;
		let bg;
		let func;
		let title;
		if(type === 'cancel'){
			bg = '#EC2135';
			func = this.handlePressCancel;
			title = 'Cancel Booking';
		} else if (type === 'reserve'){
			bg = '#059A63';
			func = this.handlePressReserve;
			title = 'Reserve Timeslot';
		} else {
			bg = '#2B6394';
			func = this.handlePressBack;
			title = 'Back';
		}

		return (
			<Button
				style={[{backgroundColor: bg}, styles.btnStyle]}
				onPress={func}
			>
				{
					!saving &&
					<View style={styles.btnTextHolder}>
						<Text style={styles.btnTextStyle}>
							{title}
						</Text>
					</View>
				}
				{
					saving &&
					<ActivityIndicator
						animating={true}
						color="#FFFFFF"
					/>
				}
			</Button>
		);
	};

	renderForm = () => {
		const { booking } = this.props;
		if (booking) {
			return (
				<View style={styles.formHolder}>
					<RenderInput
						name="Facility"
						// onchange={(text) => this.setState({facilityName: text})}
						placeholder="facility"
						value={booking.facility_name}
						isEditable={false}
					/>
					<RenderInput
						name="Date"
						// onchange={setfacilityName}
						placeholder="date"
						value={moment(booking.date).format('DD-MMMM-YYYY (dddd)')}
						isEditable={false}
						type="date"
					/>
					<RenderInput
						name="Location"
						// onchange={(text) => this.setState({location: text})}
						placeholder="location"
						value={booking.location}
						isEditable={false}
					/>
					<RenderInput
						name="Time"
						// onchange={setSelectedTime}
						placeholder="time"
						value={`${booking.start_time} - ${booking.end_time}`}
						isEditable={false}
						type="time"
					/>
					<View style={styles.buttonsHolder}>
						{/* <View style={styles.btnBackHolder}>
							{this.renderButton('back')}
						</View> */}
						<View style={styles.button}>
							{this.renderButton('cancel')}
						</View>
					</View>
				</View>
			);
		}
		const { selectedFacilityTimeslot, selectedFacility } = this.state;
		return (
			<View style={styles.formHolder}>
				<RenderInput
					name="Facility"
					// onchange={(text) => this.setState({facilityName: text})}
					placeholder="facility"
					value={selectedFacility.name}
					isEditable={false}
				/>
				<RenderInput
					name="Date"
					// onchange={setfacilityName}
					placeholder="date"
					value={moment(selectedFacilityTimeslot.date).format('DD-MMMM-YYYY (dddd)')}
					isEditable={false}
					type="date"
				/>
				<RenderInput
					name="Location"
					// onchange={(text) => this.setState({location: text})}
					placeholder="location"
					value={selectedFacility.location}
					isEditable={false}
				/>
				<RenderInput
					name="Time"
					// onchange={setSelectedTime}
					placeholder="time"
					value={`${selectedFacilityTimeslot.start_time} - ${selectedFacilityTimeslot.end_time}`}
					isEditable={false}
					type="time"
				/>
				<View style={styles.buttonsHolder}>
					{/* <View style={styles.btnBackHolder}>
						{this.renderButton('back')}
					</View> */}
					<View style={styles.button}>
						{this.renderButton('reserve')}
					</View>
				</View>
			</View>
		);
	};

	handleFilter = (filter) => {
		const {facilities} = this.state;
		const filteredFacilities = [...facilities];
		if(filter && filter.length > 0) {
			const newFilterFacilities = [];
			filter.map(idx => newFilterFacilities.push(_.find(facilities, (f) => f.id === idx)));
			this.setState({selectedFacilityIds: newFilterFacilities});
		} else {
			this.setState({selectedFacilityIds: filteredFacilities});
		}
	}

	// onSelectedItemsChange = (selectedItems) => {
	// 	this.setState({ selectedItems });
	// };

	render() {
		const { booking } = this.props;
		const { selectedDate, isFetchTimeslots, showForm, facilities, selectedFacilityIds, uniqueTimeslots } = this.state;
		return(
			<View style={styles.contentHolder}>
				<View style={styles.f1}>
					<CalendarStrip
						scrollable
						style={styles.calendarStyle}
						calendarColor="#0B3366"
						calendarHeaderStyle={styles.calendarHeaderStyle}
						dateNumberStyle={styles.dateNumberStyle}
						dateNameStyle={styles.dateNameStyle}
						iconContainer={styles.iconContainer}
						leftSelector={[
							<View
								key="left-1"
								style={styles.calendarArrowHolder}
							>
								<Icon
									type="AntDesign"
									name="left"
									color="white"
									style={styles.arrowSize}
								/>
							</View>
						]}
						rightSelector={[
							<View
								key="right-1"
								style={styles.calendarArrowHolder}
							>
								<Icon
									type="AntDesign"
									name="right"
									color="white"
									style={styles.arrowSize}
								/>
							</View>
						]}
						highlightDateNameStyle={styles.highlightStyle}
						highlightDateNumberStyle={styles.highlightStyle}
						selectedDate={selectedDate}
						onDateSelected={this.handleOnDateSelect}
					/>
				</View>
				<View style={styles.mainContentHolder}>
					<View style={styles.mainContentHeaderHolder}>
						{/* {
							!booking &&
							<SectionedMultiSelect
								styles={{
									button: {
										backgroundColor: '#003366'
									},
									container: {
										flex: 0,
										alignSelf: 'center',
										justifyContent: 'center',
										top: '30%',
										bottom: '30%',
										width: '90%',
										minHeight: 250,
										maxHeight: 250
									},
									scrollView: {
										flex: 1,
										width: '100%',
										paddingRight: 0,
										paddingLeft: 0
									},
									itemText: {
										paddingLeft: 10
									},
									separator: {
										width: '95%',
										alignSelf: 'center'
									},
									selectToggle: {
										alignSelf: 'flex-end',
										marginRight: 16,
										marginBottom: 5,
										flexDirection: 'row',
										justifyContent: 'center',
										borderRadius: 50,
										backgroundColor: '#ececec',
										paddingLeft: 20,
										paddingRight: 20,
										paddingTop: 5,
										paddingBottom: 5
									}
								}}
								colors={{
									text: '#555555'
								}}
								itemFontFamily="normal"
								renderSelectText={() => {
									return (
										<View style={{flexDirection: 'row'}}>
											<Text style={styles.headerFilterText}>
												All facilities
												<FontAwesomeIcon
													name="filter"
													type="FontAwesome"
													style={styles.filterIconSize}
												/>
											</Text>
										</View>
									);
								}}
								selectToggleIconComponent={<Text />}
								selectText="Filter"
								hideSearch={true}
								IconRenderer={FontAwesomeIcon}
								uniqueKey="id"
								items={facilities}
								onSelectedItemsChange={this.onSelectedItemsChange}
								selectedItems={this.state.selectedItems}
								onConfirm={() => this.handleFilter(this.state.selectedItems)}
								showChips={false}
								showRemoveAll={true}
								removeAllText="Remove all"
								confirmText="Filter selected"
								selectedIconComponent={<FontAwesomeIcon
									size={14}
									name="check"
									style={{ color: '#666666', marginRight: 10 }}
								/>}
							/>
						} */}
					</View>
					<ScrollView
						showsVerticalScrollIndicator ={false}
						showsHorizontalScrollIndicator={false}
					>
						<View style={{paddingBottom: 40}}>
							<View style={styles.formDate}>
								<Text style={styles.headerDateText}>{moment(selectedDate).format('dddd, DD MMMM')}</Text>
							</View>

							{
								!booking && isFetchTimeslots && (<Loading />)
							}
							{
							// eslint-disable-next-line no-nested-ternary
								!booking && !isFetchTimeslots && !showForm &&
									uniqueTimeslots.map(uniqueTimeslot =>
										<TimeslotsList
											uniqueTimeslot={uniqueTimeslot}
											facilities={facilities}
											selectedFacilityIds={selectedFacilityIds}
											onClickFacilityTimeslot={({ facility, facilityTimeslot }) => {
												this.setState({
													showForm: true,
													selectedFacility: facility,
													selectedFacilityTimeslot: facilityTimeslot
												});
											}}
										/>
									)
							}
							{ ((showForm && !isFetchTimeslots) || Boolean(booking)) && this.renderForm() }

						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
};

const styles =  StyleSheet.create({
	btnStyle: {
		height: 40,
		borderRadius: 35,
		justifyContent: 'center'
	},
	btnTextHolder: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	btnTextStyle: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	formDate: {
		paddingLeft: 20,
		marginBottom: 20
	},
	formHolder: {
		paddingLeft: 20,
		paddingRight: 20
	},
	buttonsHolder: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 15
	},
	// btnBackHolder: {
	// 	width: 140,
	// 	marginRight: 30
	// },
	button: {
		width: '100%'
	},
	contentHolder: {
		backgroundColor: '#003366',
		flex: 1
	},
	f1: {
		flex: 1
	},
	calendarStyle: {
		height: 80
	},
	calendarHeaderStyle: {
		color: 'white'
	},
	dateNumberStyle: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600'
	},
	dateNameStyle: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
		textTransform: 'capitalize'
	},
	iconContainer: {
		flex: 0.1,
		flexDirection: 'row'
	},
	highlightStyle: {
		color: '#FAA433',
		textTransform: 'capitalize',
		fontWeight: '600',
		fontSize: 12
	},
	calendarArrowHolder: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	arrowSize: {
		fontSize: 18,
		color: '#FFFFFF'
	},
	mainContentHolder: {
		backgroundColor: '#FFFFFF',
		flex: 7,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		paddingTop: 15
	},
	mainContentHeaderHolder: {
		flexDirection: 'row',
		marginLeft: 15
	},
	headerDateText: {
		fontSize: 14,
		color: '#2A2A2A',
		fontWeight: 'bold'
	},
	headerFilterHolder: {
		marginRight: 15,
		backgroundColor: '#ECECEC',
		borderRadius: 35,
		height: 25,
		width: 102,
		justifyContent: 'center'
	},
	headerFilterText: {
		fontSize: 12,
		color: '#2A2A2A',
		textAlign: 'center'
	},
	filterIconSize: {
		fontSize: 12,
		color: '#444'
	}
});

export default CalendarPage;