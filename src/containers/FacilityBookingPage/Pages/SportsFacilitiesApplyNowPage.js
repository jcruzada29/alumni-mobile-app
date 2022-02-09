import React from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button, Container } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from '../styles/SportsFacilitiesApplyNowPage';

const SportsFacilitiesPage = () => {

	const createTwoButtonAlert = () =>
		Alert.alert(
			'',
			'By hitting the button I agree that the University can use my personal datafor processing my application. I understand my personal data will be used and maintained under the office(s)/unit(s) concerned. The University pledges and meet internationally-recognized standards of personal data privacy protection, in complying with the requirements of the Personal Data (Pirvacy) Ordinance. DAO will not disclose any personal information to external bodies unless you have been informed or the University is required to do so by law.',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{ text: 'OK', onPress: () => Actions.sportsFacilitiesPaymentPage() }
			],
			{ cancelable: false }
		);

	return(
		<Container>
			<View style={styles.mTop10}>
				<View style={styles.titleHolder}>
					<Text style={styles.titleText}>
						Sport facilities 
					</Text>
				</View>
				<View>
					<Text style={styles.commonText}>
						You are about to apply for sport facilities services available to all degree holders of HKUST. {'\n'}
					</Text>
					<Text style={styles.commonText}>
						Upon successful application, the card with service you are entitled will be displayed on the Alumni eCard in this app. You will receive an email confirmation sent to the following email address:
					</Text>
				</View>
				<View style={styles.emailHolder}>
					<TextInput
						value="test@gmail.com"
						editable={false}
						style={styles.emailInput}
					/>
				</View>
				<View>
					<Text style={[styles.commonText, styles.commonText2]}>
						Sports Facilities Access 
					</Text>
					<Text style={[styles.commonText, styles.commonText2]}>
						User can have physical access to the sport facilities priveleges
					</Text>
					<Text style={[styles.commonText, styles.commonText2]}>
						HK$xxxx for 1 year
					</Text>
					<Text style={styles.termsAndServicesText}>
						Terms of Services
					</Text>
					<Text style={[styles.commonText, styles.commonText2]}>
						The fee for the first year of Library Borrowing is waived for HKUST Alumni Association
						Full Member (Life Member)
					</Text>
				</View>
				<View style={styles.buttonHolder}>
					<Button
						style={styles.btnSubmit}
						rounded
						block
						onPress={createTwoButtonAlert}
					>
						<Text style={styles.btnSubmitText}>
							Submit
						</Text>
					</Button>
				</View>
			</View>
		</Container>
	);
};

export default SportsFacilitiesPage;