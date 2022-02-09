import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, CardItem, Button } from 'native-base';
import moment from 'moment';

class PrivilegeRow extends Component {
	render() {
		const { privilege } = this.props;
		const { name, use_start_date, use_end_date } = privilege;

		return (
			<Card style={styles.card}>
				<CardItem style={styles.cardItem}>
					<View style={styles.cardWrapper}>
						<View
							style={styles.descriptionWrapper}
						>
							<View>
								<Text
									style={styles.privilegeName}
								>
									{name}
								</Text>
								<Text
									style={styles.privilegeValidity}
								>
									Validity: {`${moment(use_start_date).format('YYYY-MM-DD')} ~ ${moment(use_end_date).format('YYYY-MM-DD')}`}
								</Text>
							</View>
						</View>
						<View style={styles.detailButtonWrapper}>
							<Button
								rounded
								style={styles.detailButton}
								onPress={() => this.props.toggleModal(privilege)}
							>
								<Text uppercase={false}>Details</Text>
							</Button>
						</View>
					</View>
				</CardItem>
			</Card>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		marginTop: 8,
		marginLeft: 8,
		marginRight: 8,
		borderRadius: 5
	},
	cardItem: {
		height: 80,
		borderRadius: 5
	},
	cardWrapper: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	privilegeName: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#0A3265'
	},
	privilegeValidity: {
		marginTop: 5,
		fontWeight: 'normal',
		fontSize: 13,
		color: '#282828'
	},
	descriptionWrapper: {
		flexDirection: 'column'
	},
	detailButtonWrapper: {
		justifyContent: 'center'
	},
	detailButton: {
		alignSelf: 'flex-start',
		justifyContent: 'center',
		backgroundColor: '#059a63',
		height: 32,
		paddingTop: 0,
		paddingBottom: 0,
		// width: 80
		fontSize: 20,
	}
});

export default PrivilegeRow;
