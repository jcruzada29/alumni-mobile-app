import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import NoBookingFoundIMG from '../../../images/facility/NO_BOOKING_FOUND.png';

const NoBookingFound = () => {
	return(
		<View style={styles.mainWrapper}>
			<View>
				<Image
					source={NoBookingFoundIMG}
					style={styles.imgStyle}
				/>
			</View>
			<View>
				<Text style={styles.textStyle}>You do not have upcoming booking</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	mainWrapper: {
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 25
	},
	imgStyle: {
		height: 63,
		width: 63
	},
	textStyle: {
		fontSize: 12,
		color: '#CCCCCC'
	}
});

export default NoBookingFound;