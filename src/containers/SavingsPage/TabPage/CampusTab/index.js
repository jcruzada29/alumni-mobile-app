import React, { Component } from 'react';
import { StyleSheet ,
	View,
	Image,
	TouchableOpacity,
	ScrollView
} from 'react-native';

import {
	Card,
	CardItem,
	Container,
	Content,
	Text
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import Loading from '../../../../components/UI/Loading';
import FilterButton from '../../components/FilterButton';

class CampusTab extends Component {
	onConfirm = (selected) => {
		const keywords = [];
		selected.map((val) => keywords.push(this.props.keywords[val].name));
		this.props.handleFilter(keywords);
	}

	render() {
		const { children, data, loading, keywords } = this.props;
		const { campus_offers } = data;
		return (
			<Container>
				{loading ? (<Loading />) : (
					<Content>
						<ScrollView>
							{children}
							<FilterButton
								keywords={_.orderBy(keywords, ['name'],['asc'])}
								confirm={this.onConfirm}
							/>
							<View style={styles.scrollWrapper}>
								{campus_offers && campus_offers.length && !loading ?
									campus_offers.map((campus, index) => {
										return (
											<View
												key={index}
												style={{ width: '50%', height: 161, borderRadius: 5, paddingLeft: 8, paddingRight: 8, marginBottom: 22 }}
											>
												<TouchableOpacity onPress={() => Actions.offersDetailPage({ campusOfferDetail: campus, title: 'Campus Offers' })}>
													<Card style={{ borderRadius: 5 }}>
														<CardItem
															cardBody
															style={{ borderRadius: 5, height: 129 }}
														>
															<Image
																source={{ uri: `https://alum.ust.hk/${campus.thumbnail}` }} // Temp Image
																style={styles.image}
															/>
														</CardItem>
														<CardItem
															footer
															style={styles.footer}
														>
															<Text
																style={styles.footerText}
																numberOfLines={1}
															>{campus.title}</Text>
														</CardItem>
													</Card>
												</TouchableOpacity>
											</View>
										);
									})
									: <View style={styles.noData}>
										<Text>No Campus Offers</Text>
									</View>
								}
							</View>
						</ScrollView>
					</Content>
				)}
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	scrollWrapper: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: '100%',
		paddingTop: 0,
		paddingBottom: 10,
		paddingLeft: 5,
		paddingRight: 5
	},
	image: {
		height: 106,
		width: 106,
		flex: 1,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		resizeMode: 'contain'
	},
	footer: {
		height: 32,
		justifyContent: 'center',
		alignContent: 'center',
		borderTopWidth: 0.5,
		borderTopColor: '#cccccc',
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5
	},
	footerText: {
		paddingTop: 1,
		fontWeight: '600',
		lineHeight: 11,
		fontSize: 12,
		color: '#555555'
	},
	noData: {
		height: 500,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default CampusTab;
