/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import { Text, View } from 'native-base';
import { TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';

const IconButton = ({ label, onPress }) => {
	let source;
	switch (label) {
		case 'Activity Room':
			source = require('../../../images/facility/ACTIVITY_ROOM.png');
			break;
		case 'Artificial-turf Soccer Pitch':
			source = require('../../../images/facility/ARTIFICIAL_TURF_SOCCER_PITCH.png');
			break;
		case 'Badminton':
			source = require('../../../images/facility/BADMINTON.png');
			break;
		case 'Basketball':
			source = require('../../../images/facility/BASKETBALL.png');
			break;
		case 'BBQ':
			source = require('../../../images/facility/BBQ.png');
			break;
		case 'Soccer Pitch':
			source = require('../../../images/facility/SOCCER_PITCH.png');
			break;
		case 'Common Room':
			source = require('../../../images/facility/COMMON_ROOM.png');
			break;
		case 'Conference Room':
			source = require('../../../images/facility/CONFERENCE_ROOM.png');
			break;
		case 'Lobby Area':
			source = require('../../../images/facility/LOBBY_AREA.png');
			break;
		case 'Court':
			source = require('../../../images/facility/COURT.png');
			break;
		case 'Creativity Room':
			source = require('../../../images/facility/CREATIVITY_ROOM.png');
			break;
		case 'Games Room':
			source = require('../../../images/facility/GAMES_ROOM.png');
			break;
		case 'Lawn Area':
			source = require('../../../images/facility/LAWN_AREA.png');
			break;
		case 'Meeting Room':
			source = require('../../../images/facility/MEETING_ROOM.png');
			break;
		case 'Mini-soccer Pitch':
			source = require('../../../images/facility/MINI_SOCCER_PITCH.png');
			break;
		case 'Multi-Function Room':
			source = require('../../../images/facility/MULTI_FUNCTION_ROOM.png');
			break;
		case 'Multi-purpose Room':
			source = require('../../../images/facility/MULTI_PURPOSE_ROOM.png');
			break;
		case 'Music Room':
			source = require('../../../images/facility/MUSIC_ROOM.png');
			break;
		case 'Piano':
			source = require('../../../images/facility/PIANO.png');
			break;
		case 'S H Ho Sports Hall':
			source = require('../../../images/facility/SPORTS_HALL.png');
			break;
		case 'Squash':
			source = require('../../../images/facility/SQUASH.png');
			break;
		case 'Tennis':
			source = require('../../../images/facility/TENNIS.png');
			break;
		case 'Table Tennis':
			source = require('../../../images/facility/TABLE_TENNIS.png');
			break;
		case 'TST Arena':
			source = require('../../../images/facility/TST_ARENA.png');
			break;
		case 'Golf':
			source = require('../../../images/facility/GOLF.png');
			break;
		case 'Volleyball':
			source = require('../../../images/facility/VOLLEYBALL.png');
			break;
		case 'Workshop':
			source = require('../../../images/facility/WORKSHOP.png');
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
					numberOfLines={1}
				>{label}</Text>
			</TouchableOpacity>
		</View>
	);
};

// custom styles
const styles = StyleSheet.create({
	// button: {
	// 	display: 'flex',
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// 	height: Platform.OS === 'ios' ? 65 : 60,
	// 	width: 60,
	// 	borderRadius: 5,
	// 	backgroundColor: '#FFF'
	// },
	// image: {
	// 	width: 26,
	// 	height: Platform.OS === 'ios' ? 39 : 25,
	// 	resizeMode: 'center',
	// 	margin: 5
	// },
	// label: {
	// 	fontSize: 8,
	// 	color: '#4A4A4A',
	// 	textAlign: 'center'
	// }
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
		color: '#333333'
	}
});

export default IconButton;
