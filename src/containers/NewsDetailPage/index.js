import React, { Component } from 'react';
import _ from 'lodash';
import { Container, Text, View } from 'native-base';
import moment from 'moment';
import { ScrollView, StyleSheet, Dimensions, Linking } from 'react-native';
import { withTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import ScalableImage from 'react-native-scalable-image';

import API from '../../lib/API';
import Loading from '../../components/UI/Loading';
import AlertUtility from '../../lib/AlertUtility';

class NewsDetailPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			news: {},
			file: null,
			loadingFile: false,
			loadingNews: false
		};
	}

	componentDidMount = () => {
		const { newsId } = this.props;
		if(newsId) {
			this.getNewsById();
		}
	}

	getNewsById = async () => {
		this.setState({
			loadingNews: true
		});
		const response = await API.news.getNewsById(this.props.newsId);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingNews: false });
			return;
		}
		const news = _.get(response, 'data.news');
		this.getAssetById(news.asset_id);
		// const newEvent = [...event];
		// check if need to log in before user can view the event.
		this.setState({
			news,
			loadingNews: false
		});
	}

	async getAssetById(id) {
		this.setState({
			loadingFile: true
		});
		const response = await API.assets.getAssetFileById(id);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingFile: false });
		}
		this.setState({
			file: _.get(response, 'data.asset.file'),
			loadingFile: false
		});
	}


	render() {
		const { loadingNews, news, file, loadingFile} = this.state;
		const { description, title, display_date } = news;
		if (loadingNews || loadingFile) {
			return <Loading />;
		}

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
	image: {
		height: 340,
		resizeMode: 'cover'
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

export default withTranslation()(NewsDetailPage);
