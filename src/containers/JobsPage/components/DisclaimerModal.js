import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Icon } from 'native-base';
import Modal from 'react-native-modal';

class DesclaimerModal extends Component {
	render() {
		return (
			<SafeAreaView style={{flex: 1}}>
				<Modal
					isVisible={this.props.isOpen}
					style={styles.modal}
				>
					<View
						style={styles.modalWrapper}
					>
						<View style={styles.btnClose}>
							<Icon
								type="FontAwesome"
								name="times-circle"
								style={{ color: 'grey', fontSize: 20 }}
								onPress={() => this.props.toggleModal()}
							/>
						</View>
						<View style={styles.modalContent}>
							<ScrollView
								// showsVerticalScrollIndicator={false}
								style={{ paddingLeft: 16, paddingRight: 16, marginTop: 10 }}
							>
								<Text style={styles.modalText}>
									This job board is a new online platform with job postings targeting at HKUST alumni. Whether you are about to begin your career or want to switch job, you can explore your opportunities by checking out the latest postings here.
								</Text>
								<Text style={styles.modalText}>
									Disclaimer: All information posted on this job board is reserved for the purpose of personal job search of current HKUST alumni. Reproducing the information on any other platforms (online or offline) in any forms (as-is or amended) or profiting personally in monetary terms (including as hired contractor/employee on a full time/part time/freelance basis) by providing information on the job bank to third parties is prohibited. Any third parties who extract information from this job board for commercial purposes would be subjected to legal actions.
								</Text>
								<Text style={styles.modalText}>
									Note:

									All information pertinent to the job opening(s) is provided by the employer “as is”. Development and Alumni Office (DAO) assumes no responsibility that the information is accurate, adequate, current or reliable, or may be used for any purpose other than for general reference. Kindly note that publication of the job opening(s) does not necessarily imply an endorsement by DAO.
									Job information currently on display will not be available once the application has been closed. Those who are interested should archive respective job details for your future reference when they are still viewable from this site. Unless application deadline is indicated, the job postings will be on display for 30 days after they are posted.
								</Text>
							</ScrollView>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	modal: {
		alignItems: 'center'
	},
	modalWrapper: {
		flexDirection: 'column',
		width: 320,
		maxHeight: Dimensions.get('window').height / 2,
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		paddingBottom: 20
	},
	modalContent: {
		flexDirection: 'column',
		alignItems: 'center',
		paddingBottom: 20
	},
	btnClose: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 6,
		paddingBottom: 0
	},
	modalText: {
		marginBottom: 12,
		textAlign: 'justify'
	}
});

export default DesclaimerModal;
