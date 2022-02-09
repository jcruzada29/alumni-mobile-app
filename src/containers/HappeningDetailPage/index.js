/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import { Container, Text, Button, Icon } from 'native-base';
import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import moment from 'moment';
import { Actions, ActionConst } from 'react-native-router-flux';
import HTML from 'react-native-render-html';
import ScalableImage from 'react-native-scalable-image';

import Loading from '../../components/UI/Loading';
import AlertUtility from '../../lib/AlertUtility';
import API from '../../lib/API';
import AuthenticationHelper from '../../lib/Authentication';

class HappeningDetailPage extends Component {
	state = {
		event: null,
		loadingEvent: false,
		error: false
	};

	componentDidMount() {
		// this.props.navigation.setParams({
		// 	onBack: () => Actions.happeningsPage()
		// });
		this.getEventById();
	}

	componentDidUpdate(prevProps) {
		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;
		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			this.getEventById();
		}
	}

	onNavigateToPreviewPage = (event) => {
		const { event_participant_field_values, event_registration_participants, transaction } = event;

		const tickets = [];
		// loop event_participant_field_values and get the user_type value from event_registration_participants
		event_registration_participants.map(participant => {
			const field = event_participant_field_values.filter(x => x.event_participant_id === participant.id);
			if (field) {
				tickets.push({
					form_fields: field,
					user_type_value: participant.event_user_type
				});
			}
			return participant;
		});

		Actions.registrationFormPreviewPage({
			transaction, event_registration_participants,
			event,
			tickets,
			eventId: event.id
		});
	}

	async getEventById() {
		this.setState({
			loadingEvent: true
		});
		const response = await API.events.getEventById(this.props.eventId);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingEvent: false, error: true });
			return;
		}
		const event = _.get(response, 'data.event');

		if (event.asset_id) {
			const asset = await this.getAssetById(event.asset_id);
			event.file = asset.file;
		}
		this.setState({
			event,
			loadingEvent: false
		});
	}

	async getAssetById(id) {
		const response = await API.assets.getAssetFileById(id);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			return null;
		}
		return _.get(response, 'data.asset');
	}

	onNavigateToRegistrationPage = async (event) => {
		const isLoggedIn = await AuthenticationHelper.isLoggedIn();
		if (!isLoggedIn) {
			Actions.casLoginPage();
			return;
		}
		const { type, url } = event;
		if (type === 'external') {
			// webview the external URL.
			Actions.externalEventPage({ url });
		} else {
			Actions.registrationFormPage({ event });
		}
	}

	render() {
		const { event, loadingEvent, error } = this.state;
		// console.log('event', _.get(event, 'file'));

		if (!event || error || loadingEvent) {
			return <Loading />;
		}

		const { file, description, name, event_start_date, event_end_date, show_quota_left, remaining_quota, type } = event;

		delete event.file;
		delete event.description;

		return (
			<SafeAreaView style={styles.container}>
				<ScrollView>
					<View>
						{file && <ScalableImage
							width={Dimensions.get('window').width}
							source={{ uri: file }}
						/>}

						<View style={styles.contentContainer}>
							<Text style={styles.title}>{name}</Text>
							<View style={styles.calendarTextWraper}>
								<Icon
									style={styles.calendarIcon}
									name="calendar"
									type="FontAwesome"
								/>
								<Text style={styles.calendarText}>
									{
										moment(event_start_date).format('YYYY-MM-DD') === moment(event_end_date).format('YYYY-MM-DD')
											? moment(event_start_date).format('D MMM YYYY')
											: `${moment(event_start_date).format('D MMM YYYY')} - ${moment(event_end_date).format('D MMM YYYY')}`
									}
								</Text>
							</View>
							{
								Boolean(show_quota_left) &&
								<View style={styles.remainingTextWraper}>
									<Icon
										style={styles.remainingIcon}
										name="hourglass-o"
										type="FontAwesome"
									/>
									<Text style={styles.remainingText}>
										{
											remaining_quota < 1 ? (
												'No available seat remaining.'
											) : (
												`${remaining_quota} seat${remaining_quota > 1 ? 's' : ''} remaining.`
											)
										}
									</Text>
								</View>
							}

							<View style={{marginTop: 20}}>
								<HTML
									html={description}
									// baseFontStyle={{textAlign: 'justify'}}
									onLinkPress={(evt, href) => { Linking.openURL(href); }}
								/>
							</View>
						</View>
					</View>
				</ScrollView>
				{_.isNil(_.get(event, 'event_registration_participants')) ?
					(type !== 'none') &&
					<View style={styles.btnHolder}>
						<Button
							rounded
							style={styles.btnRegister}
							block
							onPress={() => this.onNavigateToRegistrationPage(event)}
						>
							<Text style={styles.btnText}>
								Register
							</Text>
						</Button>
					</View>
					:
					<View style={styles.btnHolder}>
						<Button
							rounded
							style={styles.btnViewMyRegister}
							block
							onPress={() => { this.onNavigateToPreviewPage(event); }}
						>
							<Text style={styles.btnText}>
								View my registration
							</Text>
						</Button>
					</View>
				}
			</SafeAreaView>
		);
	}
}

// custom styles
const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		flex: 1
	},
	contentContainer: {
		marginTop: 0,
		marginLeft: 14,
		marginRight: 14,
		paddingBottom: 80
	},
	title: {
		fontSize: 22,
		fontWeight: '500',
		color: '#0B3366',
		marginTop: 16
	},
	calendarTextWraper: {
		flexDirection: 'row',
		marginTop: 20,
		alignItems: 'center'
	},
	calendarIcon: {
		fontSize: 16,
		marginRight: 8,
		// color: '#CC9900'
		color: '#996600'
	},
	calendarText: {
		fontSize: 14,
		// color: '#565656'
		color: '#003366'
	},
	remainingTextWraper: {
		flexDirection: 'row',
		marginTop: 10,
		alignItems: 'center'
	},
	remainingIcon: {
		fontSize: 16,
		marginRight: 8,
		color: '#996600'
	},
	remainingText: {
		fontSize: 14,
		marginLeft: 2,
		color: '#003366'
	},
	btnHolder: {
		position: 'relative',
		bottom: 0,
		marginLeft: 24,
		marginRight: 24,
		marginBottom: 12,
		marginTop: 8
	},
	btnRegister: {
		backgroundColor: '#059a63',
		height: 40
	},
	btnViewMyRegister: {
		backgroundColor: '#8b8f90',
		height: 40
	},
	btnText: {
		color: 'white',
		fontSize: 16,
		textAlign: 'center'
	}
});

export default withTranslation()(HappeningDetailPage);
