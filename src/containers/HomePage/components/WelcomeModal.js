import React from 'react';
import { Image, View } from 'react-native';
import { Text, Icon } from 'native-base';
import Modal from 'react-native-modal';

import mailImage from '../../../images/mail.png';

const WelcomeModal = ({ isOpen, onClose }) => {
	return (
		<View>
			<Modal isVisible={isOpen}>
				<View
					style={{
						width: '100%',
						height: '30%',
						backgroundColor: 'white',
						borderRadius: 10
					}}
				>
					<View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, paddingBottom: 0 }}>
						<Icon
							type="FontAwesome"
							name="close"
							style={{ color: 'grey', fontSize: 25 }}
							onPress={onClose}
						/>
					</View>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
						<View>
							<Image
								style={{ height: 75, width: 75, marginBottom: 15 }}
								source={mailImage}
							/>
						</View>
						<Text style={{ fontWeight: 'bold', fontSize: 25 }}>Welcome</Text>
						<Text style={{ color: 'grey', fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>Sign up now to receive the latest updates and got special offers.</Text>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default WelcomeModal;