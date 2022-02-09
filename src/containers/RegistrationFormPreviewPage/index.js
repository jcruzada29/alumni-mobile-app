/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
	ListItem, Left, Container,
	Text, List, Icon, Button,
	Content, Picker, Label
} from 'native-base';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { withTranslation } from 'react-i18next';
import { Actions, ActionConst } from 'react-native-router-flux';
import _ from 'lodash';
import CheckBox from '@react-native-community/checkbox';

import AlertUtility from '../../lib/AlertUtility';
import API from '../../lib/API';
import Loading from '../../components/UI/Loading';
import LabelHelper from '../../lib/Label';
import TicketPriceHelper from '../../lib/TicketPrice';
import Alipay from '../../lib/Alipay';

class RegistrationFormPreviewPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			payment_method: 'visa_master',
			loadingSubmit: false,
			loadingEventPriceGroup: false,
			loadingPaymentMethods: false,
			payment_methods: [],
			event: null,
			loadingEvent: false,
			updateAlumniEmailMobile: false,
			totalAmount: 0,
			transaction: null
		};
	}

	componentDidMount(){
		if (_.isNil(this.props.totalAmount)) {
			this.getEventPricingGroup();
		}
		this.getPaymentMethods();
		this.getEventById();
	}

	componentDidUpdate(prevProps) {
		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;
		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			this.getEventById();
		}
	}

	async getEventById() {
		this.setState({
			loadingEvent: true
		});
		const response = await API.events.getEventById(this.props.event.id);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingEvent: false });
			return;
		}
		const event = _.get(response, 'data.event');

		this.setState({
			event,
			transaction: _.get(event, 'transaction', ''),
			loadingEvent: false
		});
	}

	changeBackAction = () => {
		this.props.navigation.setParams({
			left: () => (
				Platform.OS === 'ios' ?
					<View
						style={{ marginLeft: 5 }}
					>
						<TouchableOpacity
							onPress={() =>
								Actions.happeningDetailPage({ eventId: this.props.event.id, enterTime: new Date(), hideTabBar: true, type: ActionConst.JUMP })
							}
							style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
						>
							<Icon
								name="angle-left"
								type="Fontisto"
								style={{ color: 'white', fontSize: 21, fontWeight: '500', marginBottom: 2 }}
							/>
							<Text style={{ color: 'white', fontSize: 17, marginLeft: 2 }}>Back</Text>
						</TouchableOpacity>
					</View>
					: <Button
						iconLeft
						transparent
						onPress={() =>
							Actions.happeningDetailPage({ eventId: this.props.event.id, enterTime: new Date(), hideTabBar: true, type: ActionConst.JUMP })
						}
					>
						<Icon
							name="arrow-back"
							type="MaterialIcons"
							style={{ color: 'white', fontSize: 24, fontWeight: '500' }}
						/>
					</Button>
			)
		});
	}

	getPaymentMethods = async () => {
		this.setState({
			loadingPaymentMethods: true
		});
		const response = await API.events.getPaymentMethods();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingPaymentMethods: false });
			return;
		}

		// const prices = TicketPriceHelper.getTotalPrice({ tickets, event_price_groups, event });
		// const totalAmount = prices.length > 0 ? _.sumBy(prices, ((o) => o.price_group_price.price )) : 0;
		this.setState({
			payment_methods: response.data.payment_methods,
			loadingPaymentMethods: false
		});
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
		const { tickets } = this.props;
		let totalAmount;
		if (event_price_groups.length > 0) {
			const prices = TicketPriceHelper.getTotalPrice({ tickets, event_price_groups, event: this.props.event });
			totalAmount = prices.length > 0 ? _.sumBy(prices, ((o) => o.price_group_price.price )) : 'No Ticket Price Available';
		} else {
			totalAmount = 'No Ticket Price Available';
		}
		// const prices = TicketPriceHelper.getTotalPrice({ tickets, event_price_groups, event });
		// const totalAmount = prices.length > 0 ? _.sumBy(prices, ((o) => o.price_group_price.price )) : 0;
		this.setState({
			totalAmount,
			loadingEventPriceGroup: false
		});

		this.changeBackAction(); // Commented because it causes bug disappearing back button
	}

	onClickRegisterButton = async () => {
		const { payment_method, totalAmount: state_totalAmount, updateAlumniEmailMobile } = this.state;
		const { eventId: id, totalAmount: props_totalAmount } = this.props;
		// check price group if there is price

		if (_.isNil(props_totalAmount)) {
			// use state's totalAmount
			if (!_.isNumber(state_totalAmount)) {
				AlertUtility.show('ERROR', 'There is no ticket price available.');
				return;
			}
			if (state_totalAmount > 0 && !payment_method) {
				AlertUtility.show('ERROR', 'Please select payment method');
				return;
			}
		} else {
			// props total amount
			// eslint-disable-next-line no-lonely-if
			if (!_.isNumber(props_totalAmount)) {
				AlertUtility.show('ERROR', 'There is no ticket price available.');
				return;
			}
			if (props_totalAmount > 0 && !payment_method) {
				AlertUtility.show('ERROR', 'Please select payment method');
				return;
			}
		}

		this.setState({
			loadingSubmit: true
		});
		const response = await API.events.joinEventById({
			id,
			body: {
				event: {
					tickets: this.props.tickets,
					payment_method: payment_method || 'visa_master',
					update_email: updateAlumniEmailMobile
				}
			}
		});
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingSubmit: false });
			return;
		}

		const event = _.get(response, 'data.event');

		// update date
		this.setState({
			transaction: _.get(event, 'transaction', ''),
			loadingSubmit: false,
			event: {...event}
		});

		// should not go back to registration form page
		this.changeBackAction();

		// free event
		const transaction = _.get(event, 'transaction');
		if (!transaction) {
			AlertUtility.show('Success', 'System has recorded your submission');
			return;
		}

		// proceed to payment
		this.onClickProceedToPayment({register: true});
	}

	onClickUpdatePaymentMethod = async () => {
		const { payment_method, event: stateEvent } = this.state;
		const { event } = this.props;
		const registrationId = _.get(stateEvent, 'event_registration.id') || _.get(event, 'event_registration.id');
		if (!registrationId) {
			AlertUtility.show('ERROR', 'No registration found,');
			return;
		}
		if (!payment_method) {
			AlertUtility.show('ERROR', 'Please select payment method');
		}

		const body = {
			event_registration: {
				payment_method
			}
		};
		this.setState({
			loadingSubmit: true
		});
		const response = await API.event_registrations.updateEventRegistrationById({ id: registrationId, body });
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingSubmit: false });
			return;
		}

		await this.getEventById();

		this.setState({
			transaction: _.get(response, 'data.event_registration.transaction', ''),
			loadingSubmit: false
		});

		this.onClickProceedToPayment({updatePaymentMethod: true});
	}

	onClickProceedToPayment = async (val) => {
		const {
			event: stateEvent,
			transaction: stateTransaction
		} = this.state;
		const {
			event: propsEvent,
			transaction: propsTransaction
		} = this.props;
		const event = stateEvent || propsEvent;
		let transaction = stateTransaction || propsTransaction;

		if (!transaction) {
			AlertUtility.show('Error', 'Transaction not found. Please retry after killing the app.');
			return;
		}
		// handle with alipay
		if (['alipay_cn_app', 'alipay_hk_app'].indexOf(transaction.payment_method) !== -1) {
			await this.startAndProcessAlipay({ transaction });
			return;
		}

		// Create new transaction
		if (!_.get(val, 'register') && !_.get(val, 'updatePaymentMethod')) {
			const registrationId = _.get(stateEvent, 'event_registration.id') || _.get(event, 'event_registration.id');
			const response = await API.transactions.createNewTransaction({ id: registrationId });
			if (_.get(response, 'meta.code') !== 200) {
				AlertUtility.show('Error', _.get(response, 'meta.message'));
				return;
			}
			const { event_registration } = response.data;
			const { transaction: newTransaction } = event_registration;
			transaction = newTransaction;
		}

		Actions.paymentPage({
			event,
			url: transaction && transaction.redirect_url ? transaction.redirect_url : _.get(event, 'transaction.redirect_url')
		});
	}

	startAndProcessAlipay = async ({ transaction}) => {
		const alipayRes = await Alipay.alipay(transaction.jsup_order_str);

		// AlertUtility.show('Success', 'Update successfully.');
		// {"res": {"memo": "", "result": "", "resultStatus": "8000"}}
		// console.log({ res });
		console.log({ alipayRes });
		// 9000	订单支付成功。
		// 8000	正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态。
		// 4000	订单支付失败。
		// 5000	重复请求。
		// 6001	用户中途取消。
		// 6002	网络连接出错。
		// 6004	支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态。
		// 其它	其它支付错误。
		switch(alipayRes.resultStatus) {
			case '9000':
				AlertUtility.show('Successful Payment', 'Registration status would be updated shortly.');
				break;
			case '8000':
			case '6004':
				AlertUtility.show('Processing', 'Payment is under processing.');
				break;
			case '6002':
				AlertUtility.show('Network Error', 'Please check your internet connection and try again.');
				break;
			case '6001':
				AlertUtility.show('Payment Cancelled', 'Payment is cancelled. Please make another payment attempt.');
				break;
			case '5000':
				AlertUtility.show('Error', 'Duplicated payment attempt.');
				break;
			case '4000':
				AlertUtility.show('Failed Payment', 'This payment attempt is not successful. Please try again');
				break;
			default:
				AlertUtility.show('Error', _.get(alipayRes, 'memo'));
		}
		await this.getEventById();
	}

	getFormElement = ({ ticketIndex, is_alumni_only, formFieldIndex, isAlumni, dropdown_values, placeholder, value, user_type_value, name, type }) => {
		// const alumni_disabled = ['Family Name', 'First Name', 'Student ID'];
		// const isDisabled = isAlumni && alumni_disabled.includes(name);
		if (!isAlumni && is_alumni_only && _.get(user_type_value, 'name') !== 'Alumni') {
			return null;
		}

		if (type === 'text'  || type === 'dropdown') {
			return(
				<ListItem
					noBorder
					style={{ marginTop: -8, marginBottom: -8 }}
				>
					<Left>
						<Text style={styles.inputLabel}>
							{name}:
							{/* {is_required && this.renderRequiredIcon()} */}
						</Text>
					</Left>
					<View style={styles.inputContainer}>
						<Label style={styles.inputItem}>
							{value}
						</Label>
					</View>
				</ListItem>
			);
		}
		return null;
	}

	renderTicketInformationForm = () => {
		const { tickets } = this.props;
		const inputs = [];
		for (let a = 0; a < tickets.length; a++){
			const { user_type_value } = tickets[a];
			// identifier if the ticket is alumni or first ticket index
			const isAlumni = user_type_value.name === 'Alumni';

			const sortedFormFields = _.sortBy(tickets[a].form_fields, f => {
				const alumni_default_fields = ['Family Name', 'First Name', 'Student ID', 'Email', 'Mobile No.'];
				const isDefaultField = _.indexOf(alumni_default_fields, f.name) !== -1;
				if (isDefaultField) {
					return _.indexOf(alumni_default_fields, f.name);
				}
				return f.sort * 100;
			});

			inputs.push(<React.Fragment key={a}>
				{a !== 0 && <ListItem  style={{ marginTop: -20 }} />}
				<ListItem noBorder>
					<Text
						style={{...styles.inputLabel, color: '#9C6F00', marginBottom: -12, fontWeight: 'bold' }}
					>
						Registration Details
					</Text>
				</ListItem>
				<ListItem
					noBorder
					style={{ marginBottom: -8 }}
				>
					<Left>
						<Text style={styles.inputLabel}>
							Type
						</Text>
					</Left>
					<View style={styles.inputContainer}>
						<View
							style={styles.inputItem}
						>
							<Label style={styles.inputItem}>
								{isAlumni ? 'Alumni' : user_type_value.name}
							</Label>
						</View>
					</View>
				</ListItem>
				{sortedFormFields.map((field, index) => {
					const { value } = field;
					return (
						<React.Fragment key={field.id}>
							{this.getFormElement({ ...field, isAlumni, value, user_type_value, ticketIndex: a, formFieldIndex: index})}
						</React.Fragment>
					);
				})}
			</React.Fragment>
			);
		}
		return [...inputs];
	}

	render(){
		const { tickets, event } = this.props;
		const { payment_method, loadingSubmit, transaction: stateTransaction,
			loadingEventPriceGroup, loadingPaymentMethods, loadingEvent,
			payment_methods, updateAlumniEmailMobile, event: stateEvent } = this.state;
		const { event_registration_participants, transaction } = this.props;
		const registrationStatus = _.get(stateEvent, 'event_registration.status') || _.get(event, 'event_registration.status');
		const transactionPaymentMethod = _.get(stateTransaction, 'payment_method') || _.get(transaction, 'payment_method');
		const totalAmount = _.isNil(this.props.totalAmount) ? this.state.totalAmount : this.props.totalAmount;
		const submitDisabled = !_.isNumber(totalAmount) || (totalAmount > 0 && Boolean(!payment_method));
		return(
			<Container>
				{loadingSubmit || loadingEventPriceGroup || loadingPaymentMethods || loadingEvent
					? <Loading />
					:
					<Content>
						<ScrollView
							 stickyHeaderIndices={[1]}
							 showsVerticalScrollIndicator={false}
						>
							{registrationStatus &&
							<ListItem
								noIndent
								style={{
									// eslint-disable-next-line no-nested-ternary
									backgroundColor:
											registrationStatus === 'pending'
												? '#cccccc'
												: registrationStatus === 'confirmed'
													? '#02ab3a'
													: registrationStatus === 'waiting_list'
														? '#faa61a'
														: '#ff525a',
									justifyContent: 'center'
								}}
							>
								<Text style={{ color: 'white' }}>{LabelHelper.registrationStatus(registrationStatus)}</Text>
							</ListItem>
							}
							<View style={{ flexDirection: 'column', marginTop: 4, paddingRight: 20 }}>
								<List>
									{/* Number of tickets */}
									<ListItem>
										<Left>
											<Text style={styles.inputLabel}>
												No. of Tickets:
											</Text>
										</Left>
										<View style={styles.inputContainer}>
											<Label style={styles.inputItem}>
												{tickets.length}
											</Label>
										</View>
									</ListItem>

									{/* List of tickets */}
									{this.renderTicketInformationForm()}

									{/* Item Separator */}
									<View style={styles.listItemSeparator}/>

									{/* Payment */}
									<ListItem noBorder>
										<Left>
											<Text style={styles.inputLabel}>
												Total Amount
											</Text>
										</Left>
										<View style={styles.inputContainer}>
											<Label style={styles.inputItem}>
												{
													_.isNumber(totalAmount)
														? totalAmount > 0 ? String(`HK$${totalAmount}`) : 'Free'
														: totalAmount
												}
											</Label>
										</View>
									</ListItem>

									{/* Payment Method */}
									{
										_.isNumber(totalAmount) && totalAmount > 0 &&
										<ListItem style={styles.paymentMethodWrapper}>
											<Left>
												<Text style={styles.inputLabel}>
													Payment Method
												</Text>
											</Left>
											<View style={styles.inputContainer}>
												<View
													style={styles.paymentMethodSelect}
												>
													<Picker
														mode="dropdown"
														iosHeader="Select"
														iosIcon={
															<Icon
																type="SimpleLineIcons"
																name="arrow-right"
																style={{ fontWeight: 'bold', fontSize: 12 }}
															/>
														}
														style={{ width: undefined }}
														placeholder="Payment Method"
														placeholderStyle={{ color: '#bfc6ea', fontSize: 12 }}
														textStyle={{ fontSize: 12 }}
														placeholderIconColor="#007aff"
														selectedValue={payment_method || _.get(stateTransaction, 'payment_method') || _.get(transaction, 'payment_method')}
														enabled={registrationStatus !== 'confirmed'}
														onValueChange={(value) => this.setState({ payment_method: value })}
													>
														{payment_methods.map(paymentMethod => {
															return (
																<Picker.Item
																	key={paymentMethod.id}
																	label={paymentMethod.name}
																	value={paymentMethod.id}
																/>
															);
														})}
													</Picker>
												</View>
											</View>
										</ListItem>
									}
									{!event_registration_participants && !stateTransaction &&
										<ListItem
											noBorder
											style={styles.termsWrapper}
										>
											<View style={{flexDirection: 'column', marginTop: 16}}>
												<View style ={{flex: 1, flexDirection: 'row'}}>
													<CheckBox
														onAnimationType="fill"
														offAnimationType="fill"
														value={updateAlumniEmailMobile}
														onValueChange={(value) => this.setState({ updateAlumniEmailMobile: value }) }
													/>

													<Text
														style={{
															...styles.textColorBottom,
															marginRight: 28,
															marginLeft: 12
														}}
													>
														Update my alumni email and mobile no. with the provided contact information
													</Text>
												</View>
												<Text
													style={{
														...styles.textColorBottom,
														marginLeft: 4,
														marginRight: 24,
														marginTop: 32
													}}
												>
													I agree that the University can use my personal data for processing my application.
													I understand my personal data will be used and maintained under the office(s)/unit(s) concerned.
													The University pledges to meet internationality-recognized standards of personal data privacy protection,
													in complying with the requirements of the Personal Data (Privacy) Ordinance.
													DAO will not disclose any personal information to external bodies unless you have been informed or the University is required to do so by law.
												</Text>
											</View>
										</ListItem>
									}
								</List>
							</View>
						</ScrollView>
						<View style={{ padding: 20, marginBottom: 20 }}>
							{_.get(event, 'status') !== 'confirmed' && !event_registration_participants && !stateTransaction &&
								<Button
									full
									rounded
									style={submitDisabled ? styles.submitButtonDisabled : styles.submitButtonEnabled}
									disabled={submitDisabled}
									onPress={() => (
										Alert.alert(
											'Submit',
											'Are you sure you want to submit?',
											[
												{
													text: 'Cancel',
													style: 'cancel'
												},
												{
													text: 'Register',
													onPress: () => this.onClickRegisterButton()
												}
											],
											{ cancelable: true }
										)
									)
									}
								>
									<Text style={styles.submitButtonText}>Register</Text>
								</Button>
							}
							{registrationStatus ==='pending' && payment_method && transactionPaymentMethod && transactionPaymentMethod !== payment_method &&
								<Button
									full
									rounded
									style={submitDisabled ? styles.submitButtonDisabled : styles.submitButtonEnabled}
									disabled={submitDisabled}
									onPress={() => (
										Alert.alert(
											'Payment',
											'Are you sure you want to update payment method?',
											[
												{
													text: 'Cancel',
													style: 'cancel'
												},
												{
													text: 'Update',
													onPress: () => this.onClickUpdatePaymentMethod()
												}
											],
											{ cancelable: true }
										)
									)
									}
								>
									<Text style={styles.submitButtonText}>UPDATE PAYMENT METHOD</Text>
								</Button>
							}
							{registrationStatus ==='pending' && (!payment_method || payment_method === transactionPaymentMethod) &&
								<Button
									full
									rounded
									style={styles.submitButtonEnabled}
									// style={submitDisabled ? styles.submitButtonDisabled : styles.submitButtonEnabled}
									// disabled={submitDisabled}
									onPress={() => (
										Alert.alert(
											'',
											'Are you sure you want to proceed to payment?',
											[
												{
													text: 'Cancel',
													style: 'cancel'
												},
												{
													text: 'Proceed',
													onPress: () => this.onClickProceedToPayment()
												}
											],
											{ cancelable: true }
										)
									)
									}
								>
									<Text style={styles.submitButtonText}>PROCEED TO PAYMENT</Text>
								</Button>
							}
						</View>
					</Content>
				}
			</Container>
		);
	}
}


// custom styles
const styles = StyleSheet.create({
	listItemSeparator: {
		marginLeft: 20,
		marginTop: 10,
		marginBottom: 6,
		height: 1,
		backgroundColor: '#D6D6D6'
	},
	inputLabel: {
		fontWeight: 'normal',
		color: '#555555',
		fontSize: 14
	},
	inputContainer: {
		flex: 1.5
	},
	inputItem: {
		color: '#000000',
		fontSize: 14
	},
	textColorBottom: {
		fontSize: 12,
		color: '#777777',
		textAlign: 'justify'
	},
	paymentMethodWrapper: {
		backgroundColor: '#E0E0E0',
		paddingRight: 12,
		paddingLeft: 12,
		paddingTop: 8,
		paddingBottom: 8,
		marginTop: 4,
		borderRadius: 20
	},
	paymentMethodSelect: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderRadius: 20,
		borderColor: '#ebe9ed'
	},
	termsWrapper: {
	},
	submitButtonEnabled: {
		backgroundColor: '#059A63'
	},
	submitButtonDisabled: {
		backgroundColor: '#CDCDCD'
	},
	submitButtonText: {
		fontSize: 14,
		fontWeight: 'bold'
	}
});

export default withTranslation()(RegistrationFormPreviewPage);
