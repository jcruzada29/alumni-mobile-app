import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, Linking } from 'react-native';
import HTML from 'react-native-render-html';
import ScalableImage from 'react-native-scalable-image';

class OffersDetailPage extends Component {
	render() {
		const { campusOfferDetail, alumniOfferDetail } = this.props;
		const { thumbnail, title, detail } = alumniOfferDetail || campusOfferDetail;
		return (
			<View>
				<ScrollView
					showsVerticalScrollIndicator={false}
				>
					{thumbnail &&
						<ScalableImage
							style={{ marginLeft: 60, marginTop: 30 }}
							width={Dimensions.get('window').width - 120}
							source={{ uri: `https://alum.ust.hk/${thumbnail}` }}
						/>
					}
					<View style={styles.contentContainer}>
						<Text style={styles.title}>{title}</Text>
						{detail.description &&
							<HTML
								html={ detail.description }
								baseFontStyle={{ textAlign: 'left' }}
								onLinkPress={(evt, href) => { Linking.openURL(href); }}
							/>
						}
						{detail.operatingHours && (
							<Text style={styles.openingHours}>
								{detail.operatingHours}
							</Text>
						)}
						{detail.contact && (
							<Text style={styles.contactDetails}>
								{detail.contact.replace(/(<([^>]+)>)/ig, '')}
							</Text>
						)}
					</View>
				</ScrollView>

				{/* <Image
					source={{ uri: `https://alum.ust.hk/${thumbnail}` }}
					style={{ width: screenWidth, height: screenHeight / 2 - 120, resizeMode: 'contain' }}
				/> */}
				{/* <View
					style={styles.wrapper}
				>
					<View style={styles.content}>
						<Text style={styles.title}>
							{title}
						</Text>
						<ScrollView>
							<View style={{ height: screenHeight + descriptionHeight / 2 }}>
								<Text
									style={styles.description}
									onLayout={(event) => {
										this.setState({ descriptionHeight: event.nativeEvent.layout.height });
									}}
								>
									{detail.description}
								</Text>
								{detail.operatingHours && (
									<Text style={styles.openingHours}>
										{detail.operatingHours}
									</Text>
								)}
								{detail.contact && (
									<Text style={styles.contactDetails}>
										{detail.contact}
									</Text>
								)}
							</View>
						</ScrollView>

					</View>
				</View> */}
			</View >
		);
	}
}
const styles = StyleSheet.create({
	contentContainer: {
		marginTop: 0,
		marginLeft: 14,
		marginRight: 14,
		paddingBottom: 80
	},
	title: {
		fontSize: 22,
		fontWeight: '500',
		color: '#0B3366',
		marginTop: 16,
		marginBottom: 16
	},
	openingHours: {
		marginTop: 20,
		color: '#A47800',
		textAlign: 'center',
		fontSize: 12,
		fontWeight: 'normal'
	},
	contactDetails: {
		color: '#929292',
		textAlign: 'center',
		marginTop: 10,
		fontSize: 12,
		fontWeight: 'normal'
	}
});

export default OffersDetailPage;
