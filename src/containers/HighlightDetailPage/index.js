/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Container, Text, View } from 'native-base';
import moment from 'moment';
import { ScrollView, StyleSheet, Dimensions, Linking } from 'react-native';
import { withTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import ScalableImage from 'react-native-scalable-image';

class HighlightDetailPage extends Component {
	render() {
		const { description, highlightTitle: title, file, display_date } = this.props;

		return (
			<Container style={styles.container}>
				<ScrollView showsVerticalScrollIndicator={false}>
					{file && <ScalableImage
						width={Dimensions.get('window').width}
						source={{ uri: file }}
					/>}
					<View style={styles.contentContainer}>
						<Text style={styles.title}>{title}</Text>
						<Text style={styles.date}>{moment(display_date).format('D MMM YYYY')}</Text>
						<HTML
							html={description}
							// baseFontStyle={{textAlign: 'justify'}}
							onLinkPress={(evt, href) => { Linking.openURL(href); }}
						/>
					</View>
				</ScrollView>
			</Container>
		);
	}
}

// custom styles
const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
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
		marginTop: 16
	},
	date: {
		fontSize: 12,
		color: '#565656',
		marginTop: 4,
		marginBottom: 16
	}
});

export default withTranslation()(HighlightDetailPage);
