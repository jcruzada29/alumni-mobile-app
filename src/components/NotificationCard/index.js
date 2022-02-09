import React from 'react';

import {
	Content
} from 'native-base';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

class NotificationCard extends React.Component {

	renderNotifyIcon = () => {
		return (
			<View style={style.notificationIcon} />
		);
	}

	render(){

		const { title, description, date } = this.props;

		return (
			<Content>
				<TouchableOpacity onPress={() => Alert.alert('clicked')}>
					<View style={style.mainHolder}>
						<View style={style.cardHolder}>
							<View style={style.notificationHoler}>
								<View style={style.putToRight}>
									{this.renderNotifyIcon()}
								</View>
							</View>
							<View style={style.cardContentHolder}>
								<View style={style.mb15}>
									<View>
										<Text style={style.notificationTitleText}>{title}</Text>
									</View>
									<View>
										<Text style={style.notificationDescText}>{description}</Text>
									</View>
								</View>
								<View>
									<Text style={style.notificationDate}>
										{date}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</Content>
		);
	}
}

const style = StyleSheet.create({
	notificationIcon: {
		backgroundColor: '#d79b0f',
		height: 12,
		width: 12,
		borderRadius: 12/2
	},
	mainHolder: {
		paddingTop: 20,
		paddingRight: 20,
		paddingLeft: 20
	},
	cardHolder: {
		backgroundColor: 'white',
		borderRadius: 6,
		display: 'flex',
		flexDirection: 'column'
	},
	notificationHoler: {
		display: 'flex',
		flexDirection: 'row',
		paddingTop: 7,
		paddingRight: 7
	},
	putToRight: {
		marginLeft: 'auto'
	},
	cardContentHolder: {
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 14,
		paddingRight: 14,
		paddingBottom: 15
	},
	mb15: {
		marginBottom: 15
	},
	notificationTitleText: {
		color: '#003366',
		fontWeight: 'bold',
		fontSize: 14
	},
	notificationDescText: {
		color: '#555',
		fontSize: 13,
		fontWeight: '300'
	},
	notificationDate: {
		fontStyle: 'italic',
		fontSize: 12,
		color: '#555'
	}
});

export default NotificationCard;