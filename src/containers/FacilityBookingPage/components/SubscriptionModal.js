import React, { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { Image, StyleSheet, View } from 'react-native';
import { Text, Icon, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import ApplyAccessImg from '../../../images/empty_state/sports_subscriptions.png';
import styles from '../styles/SubscriptionModalStyle';

class SubscriptionModal extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	handleMaybeLater = () => {
		this.props.togglModal();
	};

	handleCloseModal = () => {
		this.props.togglModal();
	};

	render(){
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
								>Access right is about to expire </Text>
							</View>
							<View style={styles.descriptionHolder}>
								<Text style={[styles.descriptionText, {marginLeft: 15, marginRight: 15}]}>
									Your access right to sports facilities will expire on { moment(this.props.expirationDate).format('D MMM YYYY') }
								</Text>
							</View>
							<View style={styles.mTop10}>
								<Text
									style={styles.maybeLaterText}
									onPress={this.handleMaybeLater}
								>
									Close
								</Text>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
};

export default SubscriptionModal;
