/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
	ListItem, Left, Container, Text, List, Picker,
	Icon, Button, Content, Item, Input } from 'native-base';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import API from '../../lib/API';
import Loading from '../../components/UI/Loading';
import AlertUtility from '../../lib/AlertUtility';
import TicketPriceHelper from '../../lib/TicketPrice';

class RegistrationFormPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			noOfTicket: 1,
			payment_method: '',
			tickets: [],
			form_fields: [],
			event: null,
			user: null,
			event_price_groups: [],
			loadingUser: false,
			loadingEventPriceGroup: false,
			totalAmount: 0
		};
	}

	componentDidUpdate(prevProps, prevState) {
		const { tickets, user, loadingUser, noOfTicket } = this.state;
		const { noOfTicket: prev_noOfTicket, tickets: prev_tickets, loadingUser: prev_loadingUser } = prevState;

		// if user change the no of ticket from 0 or empty to more than 1 ticket.
		// eslint-disable-next-line radix
		if (user && tickets.length > 0 && prev_tickets.length === 0 && parseInt(prev_noOfTicket) >= 1 && parseInt(noOfTicket) >= 1) {
			this.initializeAlumniTicket();
		}
	}

	async componentDidMount(){
		const { event } = this.props;
		const { form_fields } = event;
		if (form_fields) {
			// already have registration
			// if (event_registration_participant && event_participant_field_values) {
			// 	// loop saved value and transfer to form_fields' value..
			// 	Actions.registrationFormPreviewPage({ tickets: [{ form_fields: [...event_participant_field_values] }], eventId: this.props.event.id  });
			// } else {
			this.setState({
				tickets: [ { form_fields: [...form_fields] }],
				event
			});

			this.getMe();
			this.getEventPricingGroup();

		}

	}

	// get information of logged in user to be a default value at first index.
	getMe = async () => {
		this.setState({
			loadingUser: true
		});
		const response = await API.users.getMe();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingUser: false });
			return;
		}
		const user = _.get(response, 'data.user');
		// const newEvent = [...event];
		// check if need to log in before user can view the event.
		this.setState({
			user,
			loadingUser: false
		});
		this.initializeAlumniTicket();

	}

	initializeAlumniTicket = () => {
		// onChangeFormHandle = ({ name, value, ticketIndex, formFieldIndex }) => {
		const alumni_default_fields = ['Family Name', 'First Name', 'Student ID', 'Email', 'Mobile No.'];
		const { user, event } = this.state;
		alumni_default_fields.map((field, index) => {
			let value;
			switch(field){
				case 'Family Name':
					value = user.last_name ? user.last_name.trim() : '';
					break;
				case 'First Name':
					value = user.first_name ? user.first_name.trim() : '';
					break;
				case 'Student ID':
					value = user.emplid ? user.emplid.trim() : '';
					break;
				case 'Email':
					value = user.email ? user.email.trim() : '';
					break;
				case 'Mobile No.':
					value = user.mobile_number ? user.mobile_number.trim() : '';
					break;
				default:
					value = '';
			}
			this.onChangeFormHandle({ name: field, value, ticketIndex: 0, formFieldIndex: index  });
		});
		this.initializedAlumniUserType();

	}

	initializedAlumniUserType = () => {
		const { event } = this.props;
		const user_types = _.get(event, 'user_types' || []);
		const getAlumniOptionIndex = user_types.findIndex(type => type.name === 'Alumni');
		this.onChangeFormHandle({ name: 'user_type', value: user_types[getAlumniOptionIndex], ticketIndex: 0 });
	}

	// get event pricing group by event_id
	getEventPricingGroup = async() => {
		this.setState({
			loadingEventPriceGroup: true
		});
		const response = await API.event_pricing_groups.getEventPriceGroupByEventId({ event_id: this.props.event.id });
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingEventPriceGroup: false });
			return;
		}
		const event_price_groups = _.get(response, 'data.event_price_groups');
		// const newEvent = [...event];
		// check if need to log in before user can view the event.
		this.setState({
			event_price_groups,
			loadingEventPriceGroup: false
		});
		this.calculatePriceTotal();
	}

	calculatePriceTotal = async (newTickets = null) => {
		const { event_price_groups, tickets: stateTickets } = this.state;
		const tickets = newTickets || stateTickets;
		let totalAmount;
		if (event_price_groups.length > 0) {
			const prices = TicketPriceHelper.getTotalPrice({ tickets, event_price_groups, event: this.props.event });

			totalAmount = prices.length > 0 ? _.sumBy(prices, ((o) => o.price_group_price.price )) : 'No Ticket Price Available';

		} else {
			totalAmount = 'No Ticket Price Available';
		}

		this.setState({
			totalAmount
		});
	}

	// eslint-disable-next-line consistent-return
	onSubmitForm = () => {
		const { tickets, event_price_groups, event, totalAmount } = this.state;
		const errorMessages = this.onValidateRequiredFields();
		if (tickets.length <= 0) {
			AlertUtility.show('ERROR', 'Please create 1 or more tickets.');
			return errorMessages;
		}

		if (errorMessages.length > 0) {
			AlertUtility.show('ERROR', _.uniq(errorMessages).join(','));
			return errorMessages;
		}
		// AlertUtility.show('DONE', 'ok');
		Actions.registrationFormPreviewPage({
			event_price_groups,
			tickets, eventId: this.props.event.id,
			event,
			totalAmount
		});
	}

	onValidateRequiredFields = () => {
		const { tickets } = this.state;

		const errorMessages = [];

		tickets.map(ticket => {
			// type per ticket is also required.
			if (!ticket.user_type_value) {
				errorMessages.push('Please select type of the user.');
				return errorMessages;
			}
			ticket.form_fields.map((field, index) => {
				const { settings, value, is_alumni_only } = field;
				const isAlumni = index === 0;
				const parsedSettings = JSON.parse(settings);
				if (parsedSettings) {
					const { is_required } = parsedSettings;
					if (!isAlumni && !is_alumni_only) {
						if (is_required && !value) {
							// required ..
							errorMessages.push('Please check required fields.');
							return errorMessages;
						}
					}
					if(is_alumni_only && _.get(ticket.user_type_value, 'name') === 'Alumni') {
						if (is_required && !value) {
							// required ..
							errorMessages.push('Please check required fields.');
							return errorMessages;
						}
					}
				}
				return field;
			});
			return ticket;
		});
		return errorMessages;
	}

	ticketNumberHandle = (value) => {
		// const copyTickets = [];
		// for (let a = 0; a < value; a++) {
		// 	copyTickets.push({ form_fields: [...this.props.event.form_fields] });
		// }
		// this.setState({
		// 	tickets: copyTickets,
		// 	noOfTicket: value
		// });
		// // if (copyTickets.length > 0) {
		// // 	this.initializeAlumniTicket();
		// // }
		// // this.initializeAlumniTicket();

		this.setState({ noOfTicket: value });
	}


	onChangeHandle = ({ name, value }) => {
		this.setState({
			[name]: value
		});
	}

	onChangeFormHandle = ({ name, value, ticketIndex, formFieldIndex }) => {
		const { tickets } = this.state;
		const copyTickets = [...tickets];
		if (name === 'user_type') {
			copyTickets[ticketIndex].user_type_value = value;
			this.calculatePriceTotal();
		}
		else {
			copyTickets[ticketIndex].form_fields[formFieldIndex] = { ...copyTickets[ticketIndex].form_fields[formFieldIndex], value };
		}
		this.setState({
			tickets: copyTickets
		});
	}

	getIsFieldRequired({ name, settingString}) {
		try {
			const setting = JSON.parse(settingString);
			return _.get(setting, 'is_required', false);
		} catch (e) {}
		return false;
	}

	getFormElement = ({ ticketIndex, is_alumni_only, formFieldIndex, isAlumni, dropdown_values, placeholder, value, user_type_value, name, type, settings }) => {
		const alumni_disabled = ['Family Name', 'First Name', 'Student ID'];
		const isDisabled = isAlumni && alumni_disabled.includes(name);

		if (!isAlumni && is_alumni_only && _.get(user_type_value, 'name') !== 'Alumni') {
			return null;
		}

		const isRequired = this.getIsFieldRequired({ name, settingString: settings });

		if (type === 'text') {
			return(
				<ListItem
					noBorder
					style={{ marginTop: -8, marginBottom: -8 }}
				>
					<Left>
						<Text style={styles.inputLabel}>
							{name}
							{isRequired ? <Text style={styles.inputLabelRequiredIcon}> *</Text>: null}
						</Text>
					</Left>
					<View style={styles.inputContainer}>
						<Item
							rounded
							style={isDisabled ? styles.inputItemDisabled : styles.inputItem}
						>
							<Input
								disabled={isDisabled}
								placeholderTextColor="#CCCCCC"
								value={value}
								placeholder={placeholder}
								onChangeText={(val) => this.onChangeFormHandle({ value: val, name, ticketIndex, formFieldIndex })}
								style={styles.inputText}
							/>
							{!isDisabled && <Icon
								type="Octicons"
								name="pencil"
								style={styles.inputIcon}
							/>}
						</Item>
					</View>
				</ListItem>
			);
		}

		if (type === 'dropdown') {
			const pickerOptions = [];
			if (Platform.OS === 'android') {
				pickerOptions.push(
					<Picker.Item
						value=""
						label=""
						key="default"
					/>
				);
			}
			JSON.parse(dropdown_values).map((option, idx) => {
				pickerOptions.push(<Picker.Item
					key={idx}
					label={option}
					value={option}
				/>);
				return option;
			});

			return (
				<ListItem
					noBorder
					style={{ marginTop: -8, marginBottom: -8 }}
				>
					<Left>
						<Text style={styles.inputLabel}>
							{name}
							{isRequired ? <Text style={styles.inputLabelRequiredIcon}> *</Text>: null}
						</Text>
					</Left>
					<View style={styles.inputContainer}>
						<Item
							rounded
							style={styles.inputItem}
						>
							<Picker
								mode="dropdown"
								textStyle={styles.inputPicker}
								placeholder={placeholder}
								placeholderStyle={{ color: '#CCCCCC' }}
								placeholderIconColor="#CCCCCC"
								selectedValue={value}
								onValueChange={(val) => this.onChangeFormHandle({ name, value: val, ticketIndex, formFieldIndex })}
							>
								{pickerOptions.map(picker => picker)}
							</Picker>
							<Icon
								type="Octicons"
								name="pencil"
								style={styles.inputIcon}
							/>
						</Item>
					</View>
				</ListItem>
			);
		}

		// unhandled case
		return null;
	}


	renderTicketInformationForm = () => {
		const { tickets, event  } = this.state;
		const user_types_state = _.get(event, 'user_types' || []);
		const user_types = [...user_types_state];
		const inputs = [];
		for (let a = 0; a < tickets.length; a++){
			const { user_type_value } = tickets[a];
			const pickerOptions = [];
			// identifier if the ticket is alumni or first ticket index
			const isAlumni = a === 0 ;

			if (Platform.OS === 'android') {
				pickerOptions.push(
					<Picker.Item
						value=""
						label=""
						key="default"
					/>
				);
			}

			// const getAlumniOptionIndex = user_types.findIndex(type => type.name === 'Alumni');

			// if (getAlumniOptionIndex !== -1 && !isAlumni) {
			// 	user_types.splice(getAlumniOptionIndex, 1);
			// }
			
			user_types.map((option, idx) => {
				pickerOptions.push(
					<Picker.Item
						key={idx}
						label={option.name}
						value={option}
					/>
				);
				return option;
			});

			// const user_type_alumni_value = user_types.find( type => type.name === 'Alumni');

			inputs.push(<React.Fragment key={a}>
				{a !== 0 && <ListItem  style={{ marginTop: -20 }} />}
				<ListItem
					noBorder
					style={{ marginBottom: -8 }}
				>
					<Left>
						<Text style={styles.inputLabel}>
							Type
							<Text style={styles.inputLabelRequiredIcon}> *</Text>
						</Text>
					</Left>
					<View style={styles.inputContainer}>
						<Item
							rounded
							style={isAlumni ? styles.inputItemDisabled : styles.inputItem}
						>
							<Picker
								mode="dropdown"
								textStyle={styles.inputPicker}
								placeholder="Type"
								placeholderStyle={{ color: '#CCCCCC' }}
								placeholderIconColor="#CCCCCC"
								enabled={!isAlumni}
								selectedValue={isAlumni ? 'Alumni' : user_type_value}
								onValueChange={(val) => this.onChangeFormHandle({ name: 'user_type', value: val, ticketIndex: a })}
							>
								{isAlumni ?
									<Picker.Item
										key={1}
										label="Alumni"
										value="Alumni"
									/> : pickerOptions.map(picker => picker)}
							</Picker>
							{
								isAlumni
									? null
									: <Icon
										type="Octicons"
										name="pencil"
										style={styles.inputIcon}
									/>
							}
						</Item>
					</View>
				</ListItem>
				{tickets[a].form_fields.map((field, index) => {
					const { value } = field;
					return (
						<React.Fragment key={index}>
							{this.getFormElement({ ...field, isAlumni, value, user_type_value, ticketIndex: a, formFieldIndex: index})}
						</React.Fragment>
					);
				})}
			</React.Fragment>
			);
		}
		return [...inputs];
	}

	onBlur = () => {
		const { noOfTicket, tickets } = this.state;
		const copyTickets = [];
		for (let a = 0; a < noOfTicket; a++) {
			if (tickets[a]) {
				copyTickets.push(tickets[a]);
			} else {
				copyTickets.push({ form_fields: [...this.props.event.form_fields] });
			}
		}
		this.setState({
			tickets: copyTickets
			// noOfTicket: value
		});
		this.calculatePriceTotal(copyTickets);
	}

	render(){
		const { noOfTicket, user, loadingUser, loadingEventPriceGroup, totalAmount } = this.state;
		if (loadingUser || loadingEventPriceGroup || !user ) {
			return <Loading />;
		}

		return(
			<Container>
				<Content>
					<ScrollView>
						<View style={{ flexDirection: 'column', marginTop: 4 }}>
							<List>
								<ListItem>
									<Left>
										<Text style={styles.inputLabel}>
											No. of Tickets
										</Text>
									</Left>
									<View style={styles.inputContainer}>
										<Item
											rounded
											style={styles.inputItem}
										>
											<Input
												rounded
												value={noOfTicket.toString()}
												// onChangeText={(value) => this.ticketNumberHandle(value)}
												onChangeText={(value) => this.ticketNumberHandle(value)}
												onBlur={() => this.onBlur()}
												keyboardType="numeric"
												returnKeyType="done"
												style={styles.inputText}
											/>
											<Icon
												name="pencil"
												type="Octicons"
												style={styles.inputIcon}
											/>
										</Item>
									</View>
								</ListItem>
								{this.renderTicketInformationForm()}
								<ListItem />
								<ListItem noBorder>
									<Left>
										<Text style={styles.inputLabel}>
											Total Amount
										</Text>
									</Left>
									<View style={styles.inputContainer}>
										<Item
											rounded
											style={styles.inputItemDisabled}
										>
											<Input
												rounded
												disabled
												keyboardType="numeric"
												value={
													_.isNumber(totalAmount)
														? totalAmount > 0 ? String(`HK$${totalAmount}`) : 'Free'
														: totalAmount
												}
												style={{ textAlign: 'center', fontSize: 12 }}
											/>
										</Item>
									</View>
								</ListItem>
							</List>
						</View>
					</ScrollView>
					<View style={{ padding: 20, marginBottom: 20 }}>
						<Button
							success
							full
							rounded
							style={styles.submitButton}
							onPress={() => this.onSubmitForm()}
						>
							<Text style={styles.submitButtonText}>PREVIEW</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}


// custom styles
const styles = StyleSheet.create({
	inputLabel: {
		fontWeight: 'normal',
		color: '#555555',
		fontSize: 14
	},
	inputContainer: {
		width: 218
	},
	inputLabelRequiredIcon: {
		color: '#ED1B2F'
	},
	inputItem: {
		backgroundColor: '#FFFFFF',
		height: 45,
		borderRadius: 12,
		borderColor: '#D8D8D8',
		justifyContent: 'space-between'
	},
	inputItemDisabled: {
		paddingLeft: 2,
		backgroundColor: '#EEEEEE',
		height: 45,
		borderRadius: 12,
		borderColor: '#D8D8D8'
	},
	inputText: {
		color: '#333333',
		fontSize: 14,
		marginRight: 24
	},
	inputPicker: {
		color: '#333333',
		fontSize: 14,
		paddingLeft: 8,
		width: '100%'
	},
	inputIcon: {
		position: 'absolute',
		right: 0,
		color: '#666666',
		fontSize: 14
	},
	submitButton: {
		backgroundColor: '#059A63'
	},
	submitButtonText: {
		fontSize: 14,
		fontWeight: 'bold'
	}
});

export default withTranslation()(RegistrationFormPage);