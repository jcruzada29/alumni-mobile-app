import React from 'react';
import BCode from 'react-native-barcode-builder';
import QRCode from 'react-native-qrcode-svg';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const Barcode = (props) => {
	const { ecard } = props;
	if (!ecard) {
		return <View />;
	}
	const { code, code_type } = ecard;
	if (!code || !code.trim()) {
		return (
			<View style={style.contentWrapper}>
				<View style={{ marginBottom: 150 }} />
			</View>
		);
	}
	return (
		<>
			<View style={style.contentWrapper}>
				<View>
					<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
						<View style={{ flex: 1, justifyContent: 'center' }}>
							{
								code_type === 'qrcode' &&
								<QRCode
									value={code}
									size={250 * (Dimensions.get('window').width / 375)}
								/>
							}
							{
								code_type === 'barcode' &&
								<BCode
									value={code}
									text={code}
									width={(Dimensions.get('window').width / 200)}
									height={150}
									format="CODE39"
								/>
							}
						</View>
					</ScrollView>
				</View>
			</View>
			<View style={{backgroundColor: 'white', height: 500}} />
		</>
	);
};

const style = StyleSheet.create({
	contentWrapper: {
		alignItems: 'center',
		backgroundColor: 'white',
		height: screenHeight - 350,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20
	}
});


export default Barcode;
