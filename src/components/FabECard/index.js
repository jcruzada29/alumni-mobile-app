import React, { Component } from 'react';
import _ from 'lodash';
import { View, Fab, Text } from 'native-base';
import { Image, StyleSheet, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';

import EcardIMG from '../../images/home/ecard.png';
import AuthenticationHelper from '../../lib/Authentication';

class FabECard extends Component {
	async handleOnPress() {
		const isLoggedIn = await AuthenticationHelper.isLoggedIn();
		if (isLoggedIn) {
			Actions.studentCardPage();
			return;
		}
		Actions.casLoginPage();
	}

	render() {
		const { marginBottom } = this.props;
		return (
			<Fab
				active={true}
				direction="up"
				style={[styles.fab, { marginBottom: _.isNil(marginBottom) ? 20 : marginBottom }]}
				position="bottomRight"
				onPress={() => this.handleOnPress()}
			>
				<View style={styles.fabContent}>
					<Image
						source={EcardIMG}
						style={styles.fabImage}
					/>
					<Text style={styles.fabText}>eCard</Text>
				</View>
			</Fab>
		);
	}
}

// custom styles
const stylesAndroid = StyleSheet.create({
	fab: {
		width: 67,
		height: 67,
		borderRadius: 67 / 2,
		borderColor: '#FFF',
		borderWidth: 3,
		backgroundColor: '#9C6F00'
	},
	fabContent: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	fabImage: {
		width: 20,
		height: 20,
		resizeMode: 'contain'
	},
	fabText: {
		fontSize: 10,
		color: '#FFF'
	}
});
const stylesIOS = StyleSheet.create({
	fab: {
		width: 67,
		height: 67,
		borderRadius: 67 / 2,
		borderColor: '#FFF',
		borderWidth: 3,
		backgroundColor: '#9C6F00'
	},
	fabContent: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	fabImage: {
		width: 20,
		height: 20,
		resizeMode: 'contain'
	},
	fabText: {
		fontSize: 10,
		color: '#FFF'
	}
});

const styles = Platform.OS === 'ios' ? stylesIOS : stylesAndroid;

export default FabECard;
