import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
	Container,
	Content,
	Text,
	List,
	ListItem,
	Body,
	Right,
	Icon,
	Badge,
	ActionSheet
} from 'native-base';
import { Platform, StyleSheet, RefreshControl, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { withTranslation } from 'react-i18next';


import ListItemDivider from '../../components/ListItemDivider';
import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';

const path = 'containers.OrdersListPage';

class CaterertListPage extends Component {
	constructor() {
		super();
		this.state = {
			loadingCaterers: false,
			caterers: [],
			halls: {
				CL_counts: 0,
				TC_counts: 0,
				UL_counts: 0
			},
			loadingHalls: false
		};
	}

	componentDidMount() {
		this.getCaterers();
		this.getHalls();
	}


	async getCaterers() {
		const { date, availabilityType, t } = this.props;
		this.setState({
			loadingCaterers: true
		});
		const response = await API.caterers.getCaterers({ type: availabilityType, ordered_at: date });
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show(t('general.ERROR'), _.get(response, 'meta.message'));
			this.setState({ loadingCaterers: false });
			return;
		}
		const caterers = _.get(response, 'data.restaurants');
		this.setState({
			caterers,
			loadingCaterers: false
		});
	}

	async getHalls() {
		const { date, availabilityType, t } = this.props;
		this.setState({
			loadingHalls: true
		});
		const query = { type: availabilityType, ordered_at: date };
		const response = await API.orders.getOrdersByHall(query);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show(t('general.ERROR'), _.get(response, 'meta.message'));
			this.setState({ loadingHalls: false });
			return;
		}
		const CL_counts = _.get(response, 'data.CL_counts');
		const TC_counts = _.get(response, 'data.TC_counts');
		const UL_counts = _.get(response, 'data.UL_counts');
		this.setState({
			halls: {
				CL_counts,
				TC_counts,
				UL_counts
			},
			loadingHalls: false
		});
	}


	onRefresh = () => {
		this.getCaterers();
		this.getHalls();
	}


	render = () => {
		const {
			loadingCaterers,
			caterers,
			halls,
			loadingHalls
		} = this.state;
		const { CL_counts, TC_counts, UL_counts } = halls;
		

		const { t, date } = this.props;

		// console.log(JSON.stringify(orders, null, 4));

		return (
			<Container>
				<Content
					refreshControl={<RefreshControl
						refreshing={loadingCaterers}
						onRefresh={() => this.onRefresh()}
					/>}
					style={{ backgroundColor: '#f4f4f4' }}
				>
					<List style={{ backgroundColor: 'white' }}>
						{
							!loadingCaterers && caterers.length === 0 &&
							<ListItem
								itemDivider
								style={{ display: 'flex', justifyContent: 'center' }}
							><Text>No Caterers</Text></ListItem>
						}
						<ListItemDivider text="Restaurants" />
						{
							!loadingCaterers && caterers.length > 0 &&
							caterers.map(c => {
								const count = c.orders_count;
								return (
									<ListItem
										onPress={() => Actions.ordersListPage({ restaurant_id: c._id ,date, availabilityType: this.props.availabilityType })}
										key={c._id}
									>
										<Body>
											<Text>
												{c.name}
											</Text>
										</Body>
										<Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
											{ count > 0 && <Badge
												primary
												style={{ backgroundColor: '#003366', marginRight: 10 }}
											>
												<Text
													style={styles.iconStyle}
												>
													{count}
												</Text>
											</Badge>
											}
											<Icon name="arrow-forward" />
										</Right>
									</ListItem>
								);
							})
						}
						<ListItemDivider text="Accomodation"/>
						{
							!loadingHalls &&
								<>
									{/* CL */}
									<ListItem
										onPress={() => CL_counts > 0 && Actions.ordersListPage({ hall_name: 'CL' ,date, availabilityType: this.props.availabilityType })}
									>
										<Body>
											<Text>
												CL - Conference Lodge
											</Text>
										</Body>
										<Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
											{ CL_counts > 0 && <Badge
												primary
												style={{ backgroundColor: '#003366', marginRight: 10 }}
											>
												<Text
													style={styles.iconStyle}
												>
													{CL_counts}
												</Text>
											</Badge>
											}
											<Icon name="arrow-forward" />
										</Right>
									</ListItem>
									{/* TC */}
									<ListItem
										onPress={() => TC_counts > 0 && Actions.ordersListPage({ hall_name: 'TC' ,date, availabilityType: this.props.availabilityType })}
									>
										<Body>
											<Text>
												TC - Tower C
											</Text>
										</Body>
										<Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
											{ TC_counts > 0 && <Badge
												primary
												style={{ backgroundColor: '#003366', marginRight: 10 }}
											>
												<Text
													style={styles.iconStyle}
												>
													{TC_counts}
												</Text>
											</Badge>
											}
											<Icon name="arrow-forward" />
										</Right>
									</ListItem>
									{/* UL */}
									<ListItem
										onPress={() => UL_counts > 0 && Actions.ordersListPage({ hall_name: 'UL' ,date, availabilityType: this.props.availabilityType })}
									>
										<Body>
											<Text>
												UL - University Lodge
											</Text>
										</Body>
										<Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
											{ UL_counts > 0 && <Badge
												primary
												style={{ backgroundColor: '#003366', marginRight: 10 }}
											>
												<Text
													style={styles.iconStyle}
												>
													{UL_counts}
												</Text>
											</Badge>
											}
											<Icon name="arrow-forward" />
										</Right>
									</ListItem>
								</>
						}
					</List>
					<ProgressDialog
						visible={loadingCaterers}
						message={t('general.LOADING')}
					/>
				</Content>
			</Container >
		);
	}
}
// custom styles
const stylesAndroid = StyleSheet.create({
	iconStyle: {
		fontSize: 15, color: 'white', lineHeight: 25
	}
});
const stylesIOS = StyleSheet.create({
	iconStyle: {
		fontSize: 12, color: 'white', lineHeight: 22
	}
});
const styles = Platform.OS === 'ios' ? stylesIOS : stylesAndroid;

CaterertListPage.propTypes = {
	date: PropTypes.string.isRequired,
	availabilityType: PropTypes.string.isRequired
};

export default withTranslation()(CaterertListPage);
