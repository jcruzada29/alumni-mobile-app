/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import _ from 'lodash';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View, Card, CardItem } from 'native-base';
import Swiper from 'react-native-swiper';
import { Actions } from 'react-native-router-flux';

import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import Loading from '../UI/Loading';

class Hightlights extends Component {
	state = {
		highlights: [],
		loading: false
	};

	componentDidMount() {
		const { location } = this.props;
		if (location) {
			this.getHighlights(location);
		}
	}

	componentDidUpdate(prevProps, prevState){
		const { highlights } = this.state;
		const { highlights: prevHighlights } = prevState;

		if(highlights && highlights !== prevHighlights) {
			this.props.hasHighlight(highlights);
		}
	}

	async getHighlights(location) {
		this.setState({ loading: true });

		const response = await API.highlights.getHighlights({ location });
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loading: false });
			return;
		}

		const { highlights } = response.data;
		const newHighlights = [...highlights];
		if (newHighlights.length > 0) {
			await Promise.all(highlights.map(async (item, index) => {
				const asset = await this.getAssetById(item.asset_id);
				newHighlights[index].file = asset.file;
			}));
		}

		this.setState({
			highlights: newHighlights,
			loading: false
		});
	}

	async getAssetById(id) {
		const response = await API.assets.getAssetFileById(id);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			return null;
		}
		return _.get(response, 'data.asset');
	}

	render() {
		// const { location } = this.props;
		const { highlights, loading } = this.state;

		const swiperDotColor = '#FFFFFF';
		const swiperActiveDotColor = '#003366';

		if(!loading && !highlights.length) {
			return null;
		}

		return (
			<Card style={styles.card}>
				<View style={styles.cardItem}>
					{loading && <Loading />}
					{!loading && highlights.length === 0 && <Text style={styles.textNoHighlightsStyle}>No Highlights available</Text>}
					{!loading && highlights.length > 0 && (
						<Swiper
							autoplay={true}
							autoplayTimeout={5}
							paginationStyle={styles.swiperPagination}
							dotStyle={styles.swiperDotStyle}
							activeDotStyle={styles.swiperDotStyle}
							dotColor={swiperDotColor}
							activeDotColor={swiperActiveDotColor}
						>
							{highlights.map(highlight => {
								const { id, description, title, file, display_date } = highlight;

								return (
									<TouchableOpacity
										key={id}
										onPress={() => Actions.highlightDetailPage({ id, description, highlightTitle: title, file, display_date })}
									>
										<View style={styles.swiperView}>
											<Image
												source={{ uri: file }}
												style={styles.swiperImage}
											/>
										</View>
									</TouchableOpacity>
								);
							})}
						</Swiper>
					)}
				</View>
			</Card>
		);
	}
}

// custom styles
const styles = StyleSheet.create({
	card: {
		marginLeft: 14,
		marginRight: 14,
		marginTop: 13,
		borderRadius: 5,
		overflow: 'hidden'
	},
	cardItem: {
		borderRadius: 5,
		height: 150,
		display: 'flex',
		justifyContent: 'center',
		alignContent: 'center'
	},
	swiperPagination: {
		position: 'absolute',
		bottom: 2
	},
	swiperDotStyle: {
		width: 4,
		height: 4,
		borderRadius: 2
	},
	swiperView: {
		display: 'flex',
		height: '100%',
		width: '100%'
	},
	swiperImage: {
		flex: 1,
		width: null,
		height: null,
		resizeMode: 'cover'
	},
	textNoHighlightsStyle: {
		textAlign: 'center'
	}
});

export default Hightlights;
