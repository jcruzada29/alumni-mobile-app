import React, { Component } from 'react';
import QRCode from 'react-native-qrcode-svg';
import BCode from 'react-native-barcode-builder';
import Modal from 'react-native-modal';
import HTML from 'react-native-render-html';
import { Dimensions, StyleSheet, View, Linking } from 'react-native';
import { Text, Icon } from 'native-base';
import moment from 'moment';

class PrivilegeModal extends Component {
	render() {
		const { details, isOpen, toggleModal } = this.props;
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
								onPress={() =>  toggleModal() }
							/>
						</View>
						<View style={styles.contentWrapper}>
							<Text style={styles.privilegeName}>
								{details.name}
							</Text>
							{details.description && (
								<HTML
									style={styles.privilegeDescription}
									html={details.description}
									// baseFontStyle={{textAlign: 'justify'}}
									onLinkPress={(evt, href) => { Linking.openURL(href); }}
								/>
							)}
							<Text style={styles.privilegeValidity}>
								Validity: {`${moment(details.use_start_date).format('YYYY-MM-DD')} ~ ${moment(details.use_end_date).format('YYYY-MM-DD')}`}
							</Text>
							{
								details.code_type === 'qrcode' && details.code
									? <View style={styles.qrcodeWrapper}>
										<QRCode
											value={details.code}
											size={170 * (Dimensions.get('window').width / 375)}
										/>
									</View>
									: null
							}
							{
								details.code_type === 'barcode' && details.code
									? <View style={styles.qrcodeWrapper}>
										<BCode
											value={details.code}
											text={details.code}
											width={(Dimensions.get('window').width / 375)}
											height={100}
											format="CODE39"
										/>
									</View>
									: null
							}
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
		paddingRight: 24
	},
	privilegeName: {
		fontWeight: '600',
		fontSize: 16,
		color: '#0F3A74',
		textAlign: 'center'
	},
	privilegeDescription: {
		marginTop: 20,
		fontWeight: 'normal',
		color: '#6A6868',
		fontSize: 14,
		letterSpacing: -0.29,
		textAlign: 'center'
	},
	privilegeValidity: {
		marginTop: 20,
		fontWeight: 'normal',
		color: '#6A6868',
		fontSize: 14,
		letterSpacing: -0.29,
		textAlign: 'center'
	},
	qrcodeWrapper: {
		marginTop: 30,
		alignSelf: 'center'
	}
});

export default PrivilegeModal;
