import React from 'react';
import { Text, Card } from 'native-base';
import { View, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

const Happening = ({ id, name, file, event_start_date, event_end_date }) => {
	// status={event_registration_participants ? 'registered' : null}
	const startDate = moment(event_start_date).format('D MMM YYYY');
	const endDate = moment(event_end_date).format('D MMM YYYY');
	return (
		<TouchableOpacity
			style={Platform.OS === 'ios' ? styles.mainHolderIOS : styles.mainHolderAndroid}
			onPress={() => Actions.happeningDetailPage({ eventId: id })}
		>
			<Image
				source={{ uri: file }}
				style={styles.happeningImage}
			/>
			<View style={styles.imageBorderBottom}/>

			<View style={styles.happeningTitleContainer}>
				<Text style={styles.happeningTitle}>{name}</Text>
			</View>
			<View style={styles.separator}/>
			<Text style={styles.displayDate}>{startDate === endDate ? startDate : `${startDate} - ${endDate}`}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	mainHolderIOS: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 14,
		// shadow
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84
	},
	mainHolderAndroid: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 14,
		// shadow
		elevation: 5
	},
	happeningImage: {
		width: '100%',
		height: 120,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
		// width: 60,
		// height: 60,
		resizeMode: 'cover'
	},
	imageBorderBottom: {
		height: 1,
		backgroundColor: '#DDDDDD'
	},
	happeningTitleContainer: {
		flex: 1,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 8,
		marginBottom: 8,
		// height: 40,
		display: 'flex'
	},
	happeningTitle: {
		fontSize: 12,
		fontWeight: '500',
		color: '#003366'
	},
	separator: {
		height: 1,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: '#DDDDDD'
	},
	displayDate: {
		fontSize: 10,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 8,
		marginBottom: 8,
		color: '#666'
	}
});

// const style = StyleSheet.create({
// 	mainHolder: {
// 		flex: 1,
// 		width: '100%',
// 		backgroundColor: '#FFFFFF',
// 		borderRadius: 4,
// 		marginBottom: 10,
// 		// shadow
// 		shadowColor: '#000',
// 		shadowOffset: {
// 			width: 0,
// 			height: 2
// 		},
// 		shadowOpacity: 0.25,
// 		shadowRadius: 3.84
// 	},
// 	flexHolder: {
// 		marginLeft: 7,
// 		marginRight: 7,
// 		display: 'flex',
// 		flexDirection: 'row',
// 		flexWrap: 'wrap'
// 	},
// 	img: {
// 		height: 70,
// 		width: 70
// 	},
// 	infoHolder: {
// 		marginLeft: 10,
// 		flex: 1
// 	},
// 	infoTitle: {
// 		fontWeight: 'bold',
// 		color: '#003366',
// 		fontSize: 14
// 	},
// 	infoDate: {
// 		color: 'grey',
// 		fontSize: 12,
// 		marginTop: 6
// 	},
// 	badgeHolder: {
// 		backgroundColor: '#ffae42',
// 		borderRadius: 15,
// 		width: 73,
// 		height: 15
// 	},
// 	badgeText: {
// 		color: 'white',
// 		textAlign: 'center',
// 		fontSize: 11
// 	}
// });

export default Happening;