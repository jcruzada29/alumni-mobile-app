/* eslint-disable no-unused-expressions */
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import Swiper from 'react-native-swiper';
import { Actions } from 'react-native-router-flux';
import AlertUtility from '../../../lib/AlertUtility';
import IconButton from './IconButton';

const swiperDotColor = '#BDBEC0';
const swiperActiveDotColor = '#013972';

class NavigationIcons extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			isMoreThan4FacilityType: false
		};
	}

	componentDidMount(){
		const { icons } = this.props;
		if(icons && icons.length > 4) {
			this.setIsMoreThan4FacilityType(true);
		}
	}

	setIsMoreThan4FacilityType(bool){
		this.setState({isMoreThan4FacilityType: bool});
	}

	handlePressBtnIcon = (type) => {
		const { isLoggedin } = this.props;
		switch (type) {
			case 'happenings':
				Actions.happeningsPage();
				break;
			case 'job_board':
				isLoggedin ? Actions.jobsPage() : Actions.casLoginPage();
				break;
			case 'savings':
				Actions.savingsPage();
				break;
			case 'sports':
				isLoggedin ? Actions.facilityBookingPage() : Actions.casLoginPage();
				break;
			case 'library':
				isLoggedin ? Actions.libraryPage() : Actions.casLoginPage();
				break;
			case 'ust_transit':
				Actions.USTransitPage();
				break;
			case 'give_to_ust':
				Actions.donationsPage();
				break;
			case 'parking':
				Actions.parkingPage();
				break;
			case 'transcript':
				Actions.transcriptPage();
				break;
			case 'souvenir':
				Actions.souvenirPage();
				break;
			case 'path_advisor':
				Actions.pathAdvisorPage();
				break;
			case 'help':
				Actions.helpPage();
				break;
			default:
		}
	}

	chunk = (arr, size) =>
		arr
			.reduce((acc, _, i) =>
				(i % size)
					? acc
					: [...acc, arr.slice(i, i + size)]
			, []);

	renderIcons = icons => {
		const newIcons = icons.length ? this.chunk(icons, 4) : [];
		const defaultItem = [1, 2, 3, 4];
		const firstRow = newIcons !== undefined && newIcons.length ? newIcons[0] : [];
		const secondRow = newIcons !== undefined && newIcons.length ? newIcons[1] : [];
		return(
			<>
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5}}>
					{
						firstRow && firstRow.length && defaultItem.map((n, index) => {
							const data = firstRow !== undefined && firstRow.length && firstRow[index];
							if(data){
								return(
									<IconButton
										key={index}
										label={data.name}
										onPress={() => this.handlePressBtnIcon(data.type)}
										type={data.type}
									/>
								);
							}
							return (
								<View
									key={index}
									style={{ marginBottom: 15 }}
								>
									<View
										style={{
											height: 60,
											width: 60
										}}
									>
										<View
											style={{
												width: 26,
												height: 25,
												resizeMode: 'center',
												margin: 5
											}}
										/>
									</View>
								</View>
							);
						})
					}
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}>
					{
						firstRow && firstRow.length && defaultItem.map((n, index) => {
							const data = secondRow !== undefined && secondRow.length && secondRow[index];
							if(data){
								return(
									<IconButton
										key={index}
										label={data.name}
										onPress={() => this.handlePressBtnIcon(data.type)}
										type={data.type}
									/>
								);
							}
							return (
								<View
									key={index}
									style={{ marginBottom: 15}}
								>
									<View
										style={{height: 60,
											width: 60}}
									>
										<View
											style={{width: 26,
												height: 25,
												resizeMode: 'center',
												margin: 5}}
										/>
									</View>
								</View>
							);
						})
					}
				</View>
			</>
		);
	};

	render(){
		const { isMoreThan4FacilityType } = this.state;
		const { icons } = this.props;
		const newIcons = icons !== undefined ? this.chunk(icons, 8) : [];

		return (
			<View>
				<Swiper
					loop={false}
					style={{
						height: isMoreThan4FacilityType ? 180 : 70,
						marginTop: 8
					}}
					paginationStyle={styles.swiperPagination}
					dotColor={swiperDotColor}
					dotStyle={styles.swiperDotStyle}
					activeDotStyle={{ ...styles.swiperDotStyle, ...styles.swiperActiveDotStyle }}
					activeDotColor={swiperActiveDotColor}
				>
					{
					// eslint-disable-next-line no-nested-ternary
						!newIcons.length ?
							<View />
							: newIcons.map((icon,index) =>
								<View
									key={index}
									style={styles.iconsContainer}
								>
									{this.renderIcons(icon)}
								</View>)
					}
				</Swiper>
			</View>
		);
	}
};

// custom styles
const styles = StyleSheet.create({
	swiper: {
		height: 150,
		marginTop: 17
	},
	swiperPagination: {
		position: 'absolute',
		bottom: -5
	},
	swiperDotStyle: {
		width: 38,
		height: 4,
		borderRadius: 6,
		marginLeft: (38 / 4) * -1,
		marginRight: (38 / 4) * -1,
		zIndex: 1
	},
	swiperActiveDotStyle: {
		zIndex: 2
	},
	iconsContainer: {
		// display: 'flex',
		// flexDirection: 'column',
		// marginLeft: 14,
		// marginRight: 14
	},
	iconsRowContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});

export default NavigationIcons;
