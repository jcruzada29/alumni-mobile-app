import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { View } from 'react-native';
import { Text, Icon } from 'native-base';
import styles from './style';

class CardDescriptionModal extends Component {
	closeModal = () => {
		const { closeModal } = this.props;
		if (closeModal) {
			closeModal();
		}
	}

	render() {
		const { open, ecard } = this.props;
		return (
			<View>
				<Modal
					isVisible={open}
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
									onPress={this.closeModal}
								/>
							</View>
							<View style={styles.titleHolder}>
								<Text style={styles.titleText}>
									{ecard.card_name}
								</Text>
							</View>
							<View style={styles.descriptionHolder}>
								<Text style={[styles.descriptionText, {marginLeft: 15, marginRight: 15}]}>
									{ecard.card_description}
								</Text>
							</View>
							<View style={styles.closeTextHolder}>
								<Text
									style={styles.closeText}
									onPress={this.closeModal}
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

export default CardDescriptionModal;
