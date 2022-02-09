import React, { useState } from 'react';
import { Image, StyleSheet, View, SafeAreaView, Alert, Linking, ScrollView, Dimensions } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import Modal from 'react-native-modal';
import moment from 'moment';
import _ from 'lodash';
import HTML from 'react-native-render-html';
import API from '../../../../../lib/API';
import AlertUtility from '../../../../../lib/AlertUtility';

const { height } = Dimensions.get('window');
const DeviceHeight = height - 78; // safeAreaView 44 top + 34 bottom = 78

const RedeemModal = (props) => {
	const { couponDetails } = props;
	const { id, name, description, publish_end_date, redeemed, file } = couponDetails;

	const [loading, setLoading] = useState(false); // For redeem button
	const [viewQRCode, setViewQRCode] = useState(false); // For modal succession
	const [redeemedByUser, setRedeemedByUser] = useState(false); // Check if redeemed successfully
	const [modalHeight, setModalHeight] = useState(0);
	// const [descriptionHeight, setDescriptionHeight] = useState(0); // For responsiveness

	const redeemCouponByUser = async () => {
		setLoading(true);
		const redeemDetails = {
			redeem_coupon: {
				coupon_id: id,
				expiry_date: moment(publish_end_date).format('YYYY-MM-DD'),
				status: 'Used',
				used_at: moment(new Date()).format('YYYY-MM-DD')
			}
		};
		const response = await API.saving_coupons.redeemCouponByUser(redeemDetails);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('Error', _.get(response, 'meta.message'));
			setLoading(false);

		} else {
			props.getData();
			setRedeemedByUser(true);
			setLoading(false);
		}
	};

	const closeModal = () => {
		setRedeemedByUser(false);
		// setDescriptionHeight(0);
		props.toggleModal();
	};

	// Invoked when this modal was closed onModalHide
	const closeModalAndViewQR = () => {
		setRedeemedByUser(false);
		// setDescriptionHeight(0);
		setViewQRCode(false);
		props.toggleCodeModal();
	};

	const renderModalContent = () => {
		return (
			<>
				<View style={styles.btnClose}>
					<Icon
						type="FontAwesome"
						name="times-circle"
						style={{ color: 'grey', fontSize: 20 }}
						onPress={() => closeModal()}
					/>
				</View>
				<View style={styles.modalContent}>
					{
						file &&
						<Image
							style={styles.image}
							source={{ uri: file }}
						/>
					}
					<Text style={styles.title}>{name}</Text>
					{description && (
						<View style={{paddingLeft: 10, paddingRight: 10}}>
							<HTML
								html={description}
								// baseFontStyle={{textAlign: 'justify'}}
								onLinkPress={(evt, href) => { Linking.openURL(href); }}
							/>
						</View>
					)}
					{!redeemedByUser && !redeemed &&
					<Text style={styles.description}>
						This coupon is valid until { moment(publish_end_date).format('D MMM YYYY') }. Are you sure you want to redeem the coupon now?
					</Text>
					}
					<Button
						rounded
						style={ loading ? styles.btnRedeemLoading : redeemedByUser || redeemed ? styles.btnViewQR : modalHeight >= DeviceHeight ? [styles.btnRedeemEnabled, {marginBottom: 22}] : styles.btnRedeemEnabled}
						disabled={loading}
						onPress={
							() => {
								if (redeemedByUser || redeemed) {
									props.toggleModal();
									setViewQRCode(true);
								} else {
									Alert.alert(
										'Redeem Coupon',
										'Your coupon will be valid for 48 hours after redeeming. Are you sure you want to redeem your coupon now?',
										[
											{
												text: 'Cancel',
												style: 'cancel'
											},
											{
												text: 'Ok',
												onPress: () => redeemCouponByUser()
											}
										],
										{ cancelable: true }
									);

								}
							}
						}
					>
						<Text style={styles.btnText}>{redeemedByUser || redeemed ? 'View QR Code' : 'Redeem'}</Text>
					</Button>
				</View>
			</>
		);
	};

	return (
		<SafeAreaView style={{flex: 1}}>
			<Modal
				isVisible={props.isOpen}
				style={styles.modal}
				onModalHide={() => viewQRCode && closeModalAndViewQR()}
			>
				{
					modalHeight >= DeviceHeight ? (
						<ScrollView style={styles.modalWrapper}>
							{renderModalContent()}
						</ScrollView>
					):(
						<View 
							style={styles.modalWrapper} 
							onLayout={(event) => {
								// find_dimesions(event.nativeEvent.layout);
								setModalHeight(event.nativeEvent.layout.height);
							}}
						>
							{renderModalContent()}
						</View>
					)
				}
			</Modal>
		</SafeAreaView >
	);
};

const styles = StyleSheet.create({
	modal: {
		alignItems: 'center',
		paddingTop: 30
	},
	modalWrapper: {
		flexDirection: 'column',
		width: 320,
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		paddingBottom: 20
	},
	modalContent: {
		flexDirection: 'column',
		alignItems: 'center'
	},
	image: {
		height: 95,
		width: 162,
		aspectRatio: 162/95,
		borderRadius: 10,
		resizeMode: 'cover'
	},
	title: {
		color: '#5F5D5D',
		marginTop: 15,
		fontWeight: '800',
		fontSize: 14
	},
	description: {
		color: '#5F5D5D',
		marginTop: 13,
		fontWeight: 'normal',
		fontSize: 14,
		width: '80%',
		textAlign: 'center'
	},
	btnClose: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 6,
		paddingBottom: 0
	},
	btnRedeemEnabled: {
		justifyContent: 'center',
		marginTop: 22,
		backgroundColor: '#7c2549',
		width: 159,
		height: 32
	},
	btnRedeemLoading: {
		justifyContent: 'center',
		marginTop: 22,
		backgroundColor: '#bdbec0',
		width: 159,
		height: 32
	},
	btnViewQR: {
		justifyContent: 'center',
		marginTop: 19,
		backgroundColor: '#319a63',
		width: 159,
		height: 32
	},
	btnText: {
		fontSize: 14,
		fontWeight: '500',
		lineHeight: 14,
		textAlign: 'center'
	}
});

export default RedeemModal;
