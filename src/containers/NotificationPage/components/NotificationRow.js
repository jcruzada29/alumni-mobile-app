import React from 'react';
import { Text, Card, CardItem, Badge } from 'native-base';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import moment from 'moment';
import NavigationHelper from '../../../lib/Navigation';

const NotificationRow = ({ notification, getNotifications }) => {
	const { title, content, created_at, read_at } = notification;
	return(
		<TouchableOpacity
			style={Platform.OS === 'ios' ? styles.mainHolderIOS : styles.mainHolderAndroid}
			onPress={() => NavigationHelper.navigateByNotification({ notification, getNotifications }) }
		>
			<Card transparent>
				<CardItem style={{ width: '100%', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}>
					<View
						style={{
							width: '100%',
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
						<View>
							<View>
								<Text
									style={{ fontWeight: 'bold', color: '#0A3265', fontSize: 14 }}
								>
									{title}
								</Text>
								<Text
									style={{ color: 'grey', fontSize: 14, marginTop: 4 }}
								>
									{content}
								</Text>
							</View>
							<Text
								style={{ color: 'grey', fontSize: 12, marginTop: 4 }}
							>
								{moment(created_at).format('D MMM YYYY')}
							</Text>
						</View>
						{!read_at &&
							<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
								<Badge
									warning
									style={{ width: 10, height: 12 }}
								/>
							</View>
						}
					</View>
				</CardItem>
			</Card>
		</TouchableOpacity>
	);
};


// custom styles
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
	}
});

export default NotificationRow;