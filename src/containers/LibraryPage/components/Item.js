import React, { Component } from 'react';
import moment from 'moment';
import { Text, Card, CardItem } from 'native-base';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

class Header extends Component {
	onPress = () => {
		const { subscription } = this.props;
		if (!subscription.can_subscribe) {
			return;
		}

		Actions.subscriptionPage({
			subscription_id: subscription.id
		});
	}

	render() {
		const { subscription } = this.props;
		return(
			<View style={{ width: '50%', paddingLeft: 4, paddingRight: 4 }}>
				<TouchableOpacity
					onPress={this.onPress}
				>
					<Card
						style={styles.card}
					>
						<CardItem
							cardBody
							style={styles.cardItem}
						>
							<Image
								source={{ uri: subscription.photo || '' }}
								style={styles.image}
							/>
							<View style={styles.labelWrapper}>
								<Text style={styles.label}>{
									// click to apply
									// Valid Thru 28 Dec 2020
									subscription.has_subscription
										? `Valid Thru: ${moment(subscription.subscription_expiry_date).format('D MMM YYYY')}`
										: (
											subscription.can_subscribe
												? 'Click to apply'
												: 'Not applicable'
										)
								}</Text>
							</View>
						</CardItem>
					</Card>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 5,
		...Platform.select({
			ios: {
				shadowColor: '#ccc',
				shadowOffset: { width: 0, height: 3 },
				shadowOpacity: 0.8,
				shadowRadius: 2
			},
			android: {
				elevation: 5
			}
		})
	},
	cardItem: {
		height: 129,
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderRadius: 5
	},
	image: {
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		marginTop: -10,
		width: '100%',
		height: 98
	},
	labelWrapper: {
		borderTopWidth: 0.3,
		borderColor: '#ccc',
		borderStyle: 'solid',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	label: {
		marginTop: 8,
		fontSize: 10,
		lineHeight: 12,
		letterSpacing: -0.24,
		color: '#666666'
	}
});

export default Header;