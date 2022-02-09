import React, { Component } from 'react';
import { Dimensions, Image, View, StyleSheet } from 'react-native';
import { Text, Icon } from 'native-base';
import Modal from 'react-native-modal';

const { height: screenHeight } = Dimensions.get('window');

class PopupModal extends Component {


	closeModal = (index) => {
		this.props.onClose(index);
	}

	render() {
		const {isOpen, onClose, popup} = this.props;

		return (
			<View>
				<Modal
					isVisible={isOpen}
					style={styles.modal}
				>
					<View
						style={styles.modalWrapper}
					>
						<View style={styles.closeIconWrapper}>
							<Icon
								type="FontAwesome"
								name="times-circle"
								style={styles.closeIcon}
								onPress={() => onClose(popup.id)}
							/>
						</View>
						<View style={styles.contentWrapper}>
							<View>
								<Image
									style={styles.image}
									source={{ uri: popup.file }}
								/>
							</View>
							<Text style={styles.title}>{popup.title}</Text>
							<Text
								style={styles.description}
							>{popup.description}</Text>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		alignItems: 'center'
	},
	modalWrapper: {
		width: 334,
		backgroundColor: 'white',
		borderRadius: 10
	},
	closeIconWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 5,
		marginTop: 5,
		marginRight: 5,
		paddingBottom: 0
	},
	closeIcon: {
		color: '#8E8E93',
		fontSize: 17
	},
	contentWrapper: {
		marginTop: 8,
		paddingBottom: 40,
		paddingLeft: 24,
		paddingRight: 24,
		alignItems: 'center'
	},
	image: {
		width: 250,
		height: 200,
		resizeMode: 'cover',
		marginBottom: 20
	},
	title: {
		fontWeight: '600',
		fontSize: 16,
		color: '#0F3A74',
		textAlign: 'center'
	},
	description: {
		marginTop: 20,
		fontWeight: 'normal',
		color: '#6A6868',
		fontSize: 14,
		letterSpacing: -0.29,
		textAlign: 'center'
	}
});

export default PopupModal;