import React, { Component } from 'react';
import { Text, Body, Right, ListItem, Icon } from 'native-base';
import { View, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

class MemebershipSection extends Component {
	handleOnClickRow = (subscription) => {
		// Ignore services if already has subscription
		if (subscription.has_subscription) {
			return;
		}

		// apply with web
		if (subscription.application_method === 'web' && subscription.application_extenral_url) {
			Linking.openURL(subscription.application_extenral_url);
			return;
		}

		// apply in app
		if (subscription.application_method === 'app') {
			Actions.subscriptionPage({
				subscription_id: subscription.id
			});

		}
	}

	render = () => {
		const { subscriptions } = this.props;
		if (!subscriptions || subscriptions.length === 0) {
			return null;
		}

		console.log(subscriptions);

		return (
			<View>
				<ListItem
					itemDivider
					icon
				/>
				{
					subscriptions.map(subscription => {
						return (
							<ListItem
								key={subscription.id}
								icon
								onPress={() => this.handleOnClickRow(subscription)}
							>
								<Body>
									<Text>{
										subscription.has_subscription
											? subscription.description
											: subscription.name
									}</Text>
									{
										subscription.has_subscription && moment(subscription.subscription_expiry_date).format('YYYY') !== '3000'
											? <Text note>Valid thru {moment(subscription.subscription_expiry_date).format('D MMM YYYY')}</Text>
											: null
									}
								</Body>
								{
									!subscription.has_subscription
										? (
											<Right>
												<Text>Click to apply</Text>
												<Icon
													type="Entypo"
													name="chevron-right"
												/>
											</Right>
										)
										: null
								}
							</ListItem>
						);
					})
				}
			</View>
		);
	}
}

export default MemebershipSection;
