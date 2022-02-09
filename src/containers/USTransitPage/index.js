/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import _ from 'lodash';
import { ScrollView, StyleSheet } from 'react-native';
import { Container, Text, View } from 'native-base';
import { withTranslation } from 'react-i18next';

import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import Loading from '../../components/UI/Loading';

const REFRESH_INTERVAL = 10 * 1000; // reload every 10 seconds

class USTransitPage extends Component {
	constructor() {
		super();
		this.state = {
			transit_schedules: [],
			loading: false
		};

		this.refreshInterval = setInterval(() => this.getTransitSchedules(), REFRESH_INTERVAL);
	}

	componentDidMount() {
		this.getTransitSchedules();
	}

	async getTransitSchedules() {
		this.setState({ loading: true });

		const response = await API.transit_schedules.getTransitSchedules();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loading: false });
			return;
		}

		const { transit_schedules } = response.data;
		this.setState({
			transit_schedules,
			loading: false
		});
	}

	componentWillUnmount() {
		// this._unsubscribe && this._unsubscribe();
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
		}
	}

	render = () => {
		const { transit_schedules, loading } = this.state;

		return (
			<Container style={{ backgroundColor: '#0B3366' }}>
				<ScrollView contentContainerStyle={{flexGrow: 1}}>
					<View style={styles.scheduleContainer}>
						<Text style={styles.title}>Schedule</Text>
						{loading && <Loading />}
						{!loading && transit_schedules.length === 0 && (
							<View style={{ display: 'flex', height: 100, justifyContent: 'center', alignItems: 'center' }}>
								<Text>No Schedule available</Text>
							</View>
						)}
						{!loading && transit_schedules.length > 0 && transit_schedules.map(schedule => {
							const { route, sequences } = schedule;

							return (
								<View
									key={route}
									style={styles.routeContainer}
								>
									<View style={styles.headerContainer}>
										<View style={{ ...styles.headerTitleContainer, flex: 0.34 }}>
											<Text style={styles.headerTitle}>Route</Text>
										</View>
										<View style={{ ...styles.headerTitleContainer, flex: 0.22 }}>
											<Text style={styles.headerTitle}>Arriving</Text>
										</View>
										<View style={{ ...styles.headerTitleContainer, flex: 0.22 }}>
											<Text style={styles.headerTitle}>Next</Text>
										</View>
										<View style={{ ...styles.headerTitleContainer, flex: 0.22 }}>
											<Text style={styles.headerTitle}>2nd Next</Text>
										</View>
									</View>
									<View style={styles.nameContainer}>
										<View style={{ ...styles.nameTitleContainer, flex: 0.34 }}>
											<Text style={styles.nameTitle}>{route}</Text>
										</View>
									</View>
									{sequences.map(sequence => {
										const { seq, to, etaInfo } = sequence;

										return (
											<View
												key={seq}
												style={styles.detailsContainer}
											>
												<View style={{ ...styles.detailsTitleContainer, flex: 0.34 }}>
													<Text style={styles.detailsTitle}>{to}</Text>
												</View>
												{etaInfo.map(info => {
													const { license, eta } = info;
													const minutes = Math.floor(+eta / 60); // eta in seconds, calculate to minutes

													return (
														<View
															key={license}
															style={{ ...styles.detailsMinutesContainer, flex: 0.22 }}
														>
															<Text style={styles.detailsMinuteNumber}>{minutes}</Text>
															<Text style={styles.detailsMinuteText}>min(s)</Text>
														</View>
													);
												})}
											</View>
										);
									})}
								</View>
							);
						})}
					</View>
				</ScrollView>
			</Container>
		);
	}
}

// custom styles
const styles = StyleSheet.create({
	scheduleContainer: {
		// marginTop: 17,
		paddingTop: 16,
		paddingLeft: 14,
		paddingRight: 14,
		height: '100%',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		backgroundColor: '#FFFFFF'
	},
	title: {
		fontSize: 18,
		marginTop: 5,
		marginBottom: 5,
		fontWeight: '500'
	},
	routeContainer: {
		marginTop: 27,
		paddingBottom: 15,
		borderBottomColor: '#D8D8D8',
		borderBottomWidth: 1
	},
	headerContainer: {
		display: 'flex',
		flexDirection: 'row'
	},
	headerTitleContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	headerTitle: {
		fontSize: 12,
		color: '#8B8F90'
	},
	nameContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 5
	},
	nameTitleContainer: {
		display: 'flex',
		alignItems: 'center',
		marginTop: 5,
		marginBottom: 5
	},
	nameTitle: {
		fontSize: 15,
		fontWeight: '500',
		color: '#059A63'
	},
	detailsContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5
	},
	detailsTitleContainer: {
		display: 'flex',
		alignItems: 'flex-start'
	},
	detailsTitle: {
		fontSize: 12,
		fontWeight: '500',
		color: '#1A1A1A'
	},
	detailsMinutesContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	detailsMinuteNumber: {
		fontSize: 15,
		fontWeight: '500',
		color: '#059A63'
	},
	detailsMinuteText: {
		fontSize: 12,
		color: '#1A1A1A',
		marginTop: 3
	}
});

export default withTranslation()(USTransitPage);
