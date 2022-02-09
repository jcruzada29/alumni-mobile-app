import React from 'react';
import moment from 'moment';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

const BookingRow = props => {
	const { booking } = props;
	const duration = moment(booking.end_time, 'HH:mm').diff(moment(booking.start_time, 'HH:mm'), 'h');
	return(
		<TouchableOpacity
			onPress={() => Actions.calendarPage({ booking })}
			style={styles.touchableStyle}
		>
			<View style={styles.mainContentHolder}>
				<View style={styles.datetimeHolder}>
					<View>
						<Text style={styles.timeText}>{booking.start_time}</Text>
					</View>
					<View>
						<Text style={styles.dateText}>{moment(booking.date).format('MMM D')}</Text>
					</View>
				</View>
				<View style={styles.f1}>
					<Text style={styles.nameText}>
						{booking.facility_name}
					</Text>
				</View>
				<View>
					<Text style={styles.hoursText}>
						{
							duration > 1
								? `${duration} hrs`
								: `${duration} hr`
						}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	touchableStyle: {
		backgroundColor: '#FFFFFF',
		paddingLeft: 14,
		paddingRight: 14,
		marginBottom: 10,
		// shadow
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84
	},
	mainContentHolder: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 12,
		paddingBottom: 12
	},
	datetimeHolder: {
		alignItems: 'center'
	},
	timeText: {
		fontSize: 16,
		color: '#4A4A4A'
	},
	dateText: {
		fontSize: 12,
		color: '#4A4A4A',
		textAlign: 'center'
	},
	f1: {
		flex: 1
	},
	nameText: {
		marginLeft: 20,
		fontSize: 16,
		color: '#4A4A4A',
		fontWeight: 'bold'
	},
	hoursText: {
		fontSize: 12,
		color: '#4A4A4A'
	}
});

export default BookingRow;