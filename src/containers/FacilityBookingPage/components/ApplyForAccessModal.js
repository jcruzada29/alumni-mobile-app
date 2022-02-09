import React, { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { Image, StyleSheet, View } from 'react-native';
import { Text, Icon, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ApplyAccessImg from '../../../images/empty_state/sports_subscriptions.png';
import styles from '../styles/SubscriptionModalStyle';

class ApplyForAccessModal extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	handleApplyNowPress = () => {
		const { subscriptions } = this.props;
		if (!this.getCanSubscribe()) {
			return;
		}

		Actions.subscriptionPage({ subscription_id: subscriptions[0].id });
		this.props.togglModal();
	};

	handleMaybeLater = () => {
		this.props.togglModal();
		Actions.pop();
	};

	handleCloseModal = () => {
		this.props.togglModal();
		Actions.pop();
	};

	getCanSubscribe() {
		const { subscriptions } = this.props;
		if (!subscriptions || subscriptions.length === 0 || !subscriptions[0].can_subscribe) {
			return false;
		}
		return true;
	}

	render(){
		const canSubscribe = this.getCanSubscribe();
		if (!canSubscribe) {
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
										onPress={this.handleCloseModal}
									/>
								</View>
								<View style={styles.imgHolder}>
									<Image
										style={styles.imgStyle}
										source={ApplyAccessImg}
									/>
								</View>
								<View style={styles.titleHolder}>
									<Text
										style={styles.titleText}
									>Subscription required</Text>
								</View>
								<View style={styles.descriptionHolder}>
									<Text style={styles.descriptionText}>
										Your account does not have a valid subscription. Please contact Development and Alumni Office for assistance.
									</Text>
								</View>
								<View style={styles.mTop10}>
									<Text
										style={styles.maybeLaterText}
										onPress={this.handleMaybeLater}
									>
										Back
									</Text>
								</View>
							</View>
						</View>
					</Modal>
				</View>
			);
		}

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
									onPress={this.handleCloseModal}
								/>
							</View>
							<View style={styles.imgHolder}>
								<Image
									style={styles.imgStyle}
									source={ApplyAccessImg}
								/>
							</View>
							<View style={styles.titleHolder}>
								<Text
									style={styles.titleText}
								>Apply for access</Text>
							</View>
							<View style={styles.descriptionHolder}>
								<Text style={styles.descriptionText}>
									Apply for access right to sports facilities
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
										Apply Now
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

export default ApplyForAccessModal;
