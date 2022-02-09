import React, { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { Image, StyleSheet, View } from 'react-native';
import { Text, Icon, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import ApplyAccessImg from '../../../images/empty_state/sports_subscriptions.png';
import styles from '../styles/SubscriptionModalStyle';

class RenewSubscription extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	handleApplyNowPress = () => {
		const { subscription } = this.props;
		if (!subscription[0].can_subscribe) {
			return;
		}

		Actions.subscriptionPage({ subscription_id: subscription[0].id });
		this.props.togglModal();
	};

	handleMaybeLater = () => {
		const { subscription } = this.props;
		const expDate = moment(subscription[0].subscription_expiry_date);
		if(this.isExpire(expDate)){
			Actions.pop();
			return;
		}
		this.props.togglModal();
	};

	isExpire = expDate => {
		const expires = moment(expDate).format('YYYY-MM-DD');
		const today = moment().format('YYYY-MM-DD');
		const isSameOrAfter = moment(today).isSameOrAfter(expires);
		if(isSameOrAfter){
			return true;
		} return false;
	};

	render(){
		const { expirationDate } = this.props;

		return (
			<View>
				<Modal
					isVisible={this.props.isOpen}
					style={styles.modalStyle}
					animationOut="fadeOut"
				>
					<View style={styles.modalWrapper}>
						<View style={styles.contentHolder}>
							<View style={styles.closeIconHolder}>
								<Icon
									type="AntDesign"
									name="closecircle"
									style={styles.iconStyle}
									onPress={this.handleMaybeLater}
								/>
							</View>
							<View style={styles.imgHolder}>
								<Image
									style={styles.imgStyle}
									source={ApplyAccessImg}
								/>
							</View>
							<View style={styles.titleHolder}>
								<Text style={styles.titleText}>
									{
										this.isExpire(moment(expirationDate))
											? 'Access right expired'
											: 'Access right is about to expire'
									}
								</Text>
							</View>
							<View style={[styles.descriptionHolder, {marginBottom: 10}]}>
								<Text style={[styles.descriptionText, {marginLeft: 15, marginRight: 15}]}>
									{
										this.isExpire(moment(expirationDate))
											? 'Your access right to sports facilities has expired.'
											: `Your access right to sports facilities will expire on ${moment(expirationDate).format('D MMM YYYY')}`
									}
								</Text>
							</View>
							<View style={styles.buttonHolder}>
								<Button
									style={styles.buttonStyle}
									rounded
									block
									onPress={this.handleApplyNowPress}
								>
									<Text style={styles.applyNowText}>
										Renew Now
									</Text>
								</Button>
							</View>
							<View style={styles.mTop10}>
								<Text
									style={styles.maybeLaterText}
									onPress={this.handleMaybeLater}
								>
									Maybe later
								</Text>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
};

export default RenewSubscription;
