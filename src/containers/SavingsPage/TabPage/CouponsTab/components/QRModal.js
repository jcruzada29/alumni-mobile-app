import React from 'react';
import Barcode from 'react-native-barcode-builder';
import QRCode from 'react-native-qrcode-svg';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Button, Text } from 'native-base';
import Modal from 'react-native-modal';

const QRModal = (props) => {
	const { couponDetails } = props;
	const { code } = couponDetails;

	return (
		<View>
			<Modal
				isVisible={props.isOpen}
				style={{
					flex: 1,
					alignItems: 'center'
				}}
			>
				<View style={styles.modalWrapper}>
					<View
						style={{
							alignItems: 'center',
							marginTop: 30
						}}
					>
						<Barcode
							value={code}
							width={1.5 * (Dimensions.get('window').width / 220)}
							height={75}
						/>
						<Text>
							{code}
						</Text>
					</View>
					<View
						style={{
							alignItems: 'center',
							marginTop: 30
						}}
					>
						<QRCode
							value={code}
							size={170 * (Dimensions.get('window').width / 375)}
						/>
					</View>
					<Button
						style={styles.btnClose}
						onPress={() => {
							props.toggleModal();
						}}
					>
						<Text style={{ fontSize: 15, fontWeight: 'bold' }}>Close</Text>
					</Button>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	modalWrapper: {
		width: 334,
		height: 462,
		backgroundColor: 'white',
		borderRadius: 10
	},
	barCode: {
		width: '95%',
		height: 65,
		borderRadius: 10,
		marginTop: 40
	},
	qrCode: {
		alignSelf: 'center',
		width: 188,
		height: 188,
		marginTop: 20
	},
	btnClose: {
		alignSelf: 'center',
		justifyContent: 'center',
		backgroundColor: '#8E8E93',
		marginTop: 35,
		width: 224,
		height: 45,
		borderRadius: 15
	}
});

export default QRModal;
