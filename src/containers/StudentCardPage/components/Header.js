import React, { Component } from 'react';
import { Card, Icon } from 'native-base';
import _ from 'lodash';
import {
	ImageBackground,
	View,
	Text,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Platform,
	Image
} from 'react-native';
import HTML from 'react-native-render-html';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import WebView from 'react-native-webview';

const { width: screenWidth } = Dimensions.get('window');


class Header extends Component {
	renderItem = ({ item }) => {
		const html = _.get(item, 'ecard_html');
		// const backgroundBase = _.get(item, 'background_base_64');
		return (
			<TouchableOpacity
				onPress={() => this.props.openImagePage()}
				activeOpacity={1}
			>
				<View
					pointerEvents="none"
					style={styles.item}
				>
					<Card
						style={styles.imageContainer}
					>
						<WebView
							source={{html}}
							scrollEnabled={false}
						/>
					</Card>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		const { loading, ecards, setActiveSlide, activeSlide, openDescriptionModal } = this.props;
		const serviceCode = _.get(ecards, `${activeSlide}.service_code`);
		if (loading) {
			return <View />;
		}
		return (
			<View style={styles.container}>
				<Carousel
					sliderWidth={screenWidth}
					sliderHeight={screenWidth - 40}
					itemWidth={screenWidth - 60}
					data={ecards}
					renderItem={this.renderItem}
					hasParallaxImages={true}
					inactiveSlideScale={1}
					inactiveSlideOpacity={1}
					onSnapToItem={(index) => setActiveSlide(index)}
				/>
				<View style={styles.paginate}>
					<Text style={styles.cardName}>
						{ecards.length > 0 && ecards[activeSlide].card_name}
					</Text>
					<Pagination
						dotsLength={ecards.length}
						activeDotIndex={activeSlide}
						dotStyle={styles.dotStyle}
						inactiveDotStyle={{
							width: 5,
							backgroundColor: '#babdbd'
						}}
						dotContainerStyle={{ width: 5, marginRight: -1}}
						inactiveDotOpacity={0.9}
						inactiveDotScale={1}
					/>
					<TouchableOpacity
						onPress={() => openDescriptionModal()}
						activeOpacity={1}
						style={{
							marginTop: 16,
							shadowColor: '#000',
							shadowOffset: {
								width: 0,
								height: 2
							},
							shadowOpacity: 0.3,
							shadowRadius: 3.84
						}}
					>
						{
							serviceCode !== 'AAS1' &&
							<Icon
								type="FontAwesome"
								name="info-circle"
								style={{ color: '#9C6F00', fontSize: 20 }}
							/>
						}
					</TouchableOpacity>
					{/* {
						ecards.length > 0 && ecards[activeSlide].card_description !== '' &&
						<TouchableOpacity
							onPress={() => openModal()}
							activeOpacity={1}
							style={{marginTop: 16, shadowColor: '#000',
								shadowOffset: {
									width: 0,
									height: 2
								},
								shadowOpacity: 0.3,
								shadowRadius: 3.84}}
						>
							<Icon
								type="FontAwesome"
								name="info-circle"
								style={{ color: '#9C6F00', fontSize: 20 }}
							/>
						</TouchableOpacity>
					} */}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: -80,
		zIndex: 2
	},
	item: {
		height: 215,
		position: 'relative'
	},
	cardName: {
		marginTop: 20,
		width: '70%',
		color: '#9C6F00',
		fontWeight: 'bold',
		fontSize: 12
	},
	imageContainer: {
		width: screenWidth - 80,
		height: (screenWidth - 80) / 1942 * 1225,
		alignSelf: 'center',
		marginBottom: Platform.select({ ios: 0, android: 1 }),
		borderRadius: 15,
		overflow: 'hidden',
		position: 'relative'
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center'
	},
	cardImage: {
		width: 95,
		height: 116,
		marginLeft: 20,
		borderRadius: 10
	},
	cardContent: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		marginBottom: 9
	},
	studentName: {
		fontSize: 15,
		fontWeight: '700',
		color: '#FFFFFF',
		marginLeft: 10,
		marginBottom: 10
	},
	studentId: {
		fontSize: 15,
		fontWeight: '700',
		color: '#FFFFFF',
		marginLeft: 10,
		marginBottom: 10
	},
	paginate: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: 25,
		marginRight: 25
	},
	dotStyle: {
		width: 10,
		height: 4,
		borderRadius: 5,
		marginHorizontal: 1,
		marginTop: -5,
		marginRight: -5,
		backgroundColor: '#9C6F00'
	}
});


export default Header;