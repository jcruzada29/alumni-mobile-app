/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import { Text } from 'native-base';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

const IconButton = ({ type, label, onPress }) => {
	let source;
	switch (type) {
		case 'happenings':
			source = require('../../../images/home/HAPPENINGS.png');
			break;
		case 'job_board':
			source = require('../../../images/home/JOB_BOARD.png');
			break;
		case 'savings':
			source = require('../../../images/home/SAVINGS.png');
			break;
		case 'sports':
			source = require('../../../images/home/SPORTS.png');
			break;
		case 'library':
			source = require('../../../images/home/LIBRARY.png');
			break;
		case 'ust_transit':
			source = require('../../../images/home/TRANSIT.png');
			break;
		case 'give_to_ust':
			source = require('../../../images/home/DONATION.png');
			break;
		case 'parking':
			source = require('../../../images/home/PARKING.png');
			break;
		case 'transcript':
			source = require('../../../images/home/TRANSCRIPT.png');
			break;
		case 'souvenir':
			source = require('../../../images/home/SOUVENIR.png');
			break;
		case 'path_advisor':
			source = require('../../../images/home/PATH_ADVISER.png');
			break;
		case 'help':
			source = require('../../../images/home/HELP.png');
			break;
		default:
			source = require('../../../images/facility/DEFAULT_ICON.png');
	}
	return (
		<View style={{ marginBottom: 15 }}>
			<TouchableOpacity
				{...(onPress && { onPress })}
				style={styles.button}
			>
				<Image
					{...(source && { source })}
					style={styles.image}
					resizeMode="contain"
				/>
				<Text
					style={styles.label}
					numberOfLines={2}
				>{label}</Text>
			</TouchableOpacity>
		</View>
	);
};

// custom styles
const styles = StyleSheet.create({
	button: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		// height: 64,
		// width: 64,
		height: 72,
		width: 72,
		borderRadius: 5
		// backgroundColor: '#FFF'
	},
	image: {
		// width: 36,
		// height: 36,
		width: 42,
		height: 42,
		margin: 5
	},
	label: {
		fontSize: 12,
		color: '#333333',
		textAlign: 'center'
	}
});

export default IconButton;
