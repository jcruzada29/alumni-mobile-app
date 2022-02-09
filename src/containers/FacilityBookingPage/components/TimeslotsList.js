import _ from 'lodash';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

class TimeslotsList extends React.Component {

	renderFacilityTimeslot = (facilityTimeslot) => {
		const { facilities, selectedFacilityIds } = this.props;

		// debug only
		// const facility = facilities[0];
		// return (
		// 	<TouchableOpacity
		// 		onPress={() => this.props.onClickFacilityTimeslot({ facilityTimeslot, facility })}
		// 		style={styles.availableTimeslotHolder}
		// 	>
		// 		<Text style={styles.vacantText}>{facility.name}</Text>
		// 	</TouchableOpacity>
		// );

		if (selectedFacilityIds.length > 0 && selectedFacilityIds.indexOf(facilityTimeslot.facility_id) === -1) {
			return null;
		}

		const facility = _.find(facilities, f => facilityTimeslot.facility_id === f.id);
		if (!facility) {
			return null;
		}

		if(facilityTimeslot.status !== 'Available') {
			return (
				<TouchableOpacity
					// onPress={() => this.props.onClickFacilityTimeslot({ facilityTimeslot, facility })}
					style={styles.unavailableTimeslotHolder}
				>
					<Text style={styles.vacantText}>(Unavailable) {facility.name}</Text>
				</TouchableOpacity>
			);
		}

		return (
			<TouchableOpacity
				onPress={() => this.props.onClickFacilityTimeslot({ facilityTimeslot, facility })}
				style={styles.availableTimeslotHolder}
			>
				<Text style={styles.vacantText}>{facility.name}</Text>
			</TouchableOpacity>
		);
	};

	render() {
		const { uniqueTimeslot } = this.props;
		const chunks = _.chunk(uniqueTimeslot.facility_timeslots, 2);
		return (
			<View
				key={uniqueTimeslot.start_time}
				style={styles.contentHolder}
			>
				<View style={styles.fr}>
					<View>
						<Text style={styles.timeTextStyle}>
							{uniqueTimeslot.start_time}
						</Text>
					</View>
					<View style={styles.emptyContainer} />
				</View>
				<View style={styles.timeslotsHolder}>
					{
						chunks.map(chunk => {
							return (
								<View style={styles.timeslotsChunkHolder}>
									{chunk.map(facilityTimeslot => this.renderFacilityTimeslot(facilityTimeslot))}
								</View>
							);
						})
					}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	contentHolder: {
		marginTop: 0,
		marginBottom: 0,
		marginRight: 15,
		marginLeft: 15
	},
	fr: {
		flexDirection: 'row'
	},
	timeTextStyle: {
		fontSize: 14,
		color: '#2A2A2A'
	},
	emptyContainer: {
		flex: 1,
		borderWidth: 0.5,
		borderColor: '#d9d9d9',
		marginTop: 10,
		marginBottom: 10,
		marginRight: 10,
		marginLeft: 5
	},
	headerContent: {
		flex: 1,
		marginLeft: 25,
		marginRight: 10
	},
	vacantText: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: 'bold'
	},
	timeText: {
		color: '#FFFFFF',
		fontSize: 10
	},
	// mr25: {
	// 	marginRight: 25
	// },
	// iconHolder: {
	// 	flexDirection: 'row',
	// 	backgroundColor: '#FFFFFF',
	// 	height: 35,
	// 	width: 35,
	// 	borderRadius: 3,
	// 	alignItems: 'center',
	// 	justifyContent: 'center'
	// },
	// iconStyle: {
	// 	fontSize: 20,
	// 	color: '#059A63'
	// },
	timeslotsHolder: {
		marginLeft: 42
	},
	timeslotsChunkHolder: {
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	availableTimeslotHolder: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#059A63',
		width: '46%',
		borderRadius: 5,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
		marginLeft: 8,
		marginRight: 8,
		marginBottom: 5
	},
	unavailableTimeslotHolder: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#8E8E93',
		width: '46%',
		borderRadius: 5,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
		marginLeft: 8,
		marginRight: 8,
		marginBottom: 5
	}
});

export default TimeslotsList;