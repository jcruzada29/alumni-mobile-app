import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Container, Tab, Tabs } from 'native-base';
import _ from 'lodash';

import AlertUtility from '../../lib/AlertUtility';
import API from '../../lib/API';

import AuthenticationHelper from '../../lib/Authentication';
import Highlights from '../../components/Highlights';
import AlumniTab from './TabPage/AlumniTab';
import CampusTab from './TabPage/CampusTab';
import CouponsTab from './TabPage/CouponsTab';


class SavingsPage extends Component {
	constructor(props) {
		super(props);
		// Declare state and fetch data when parent loads.
		this.state = {
			highlights: [],
			loadingHighlights: false,
			alumniOffers: [],
			alumniOffersFiltered: null,
			alumniOffersKeywords: null,
			loadingAlumniOffers: false,
			campusOffers: [],
			campusOffersFiltered: null,
			campusOffersKeywords: null,
			loadingCampusOffers: false,
			coupons: [],
			loadingCoupons: false,
			isLoggedIn: false
		};
	}

	async componentDidMount() {
		// Check session
		const isLoggedIn = await AuthenticationHelper.isLoggedIn();
		this.setState({ isLoggedIn });

		this.getCoupons(true);
		this.getAlumniOffers();
		this.getCampusOffers();
	}

	async getAlumniOffers() {
		this.setState({ loadingAlumniOffers: true });
		const response = await API.alumni_offers.getAlumniOffers();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('Error', _.get(response, 'meta.message'));
			this.setState({ loadingAlumniOffers: false });
			return;
		}

		const { alumni_offers } = response.data;
		if (alumni_offers && alumni_offers.length) {
			const keywords = [];
			alumni_offers.map(alumni => {
				const category = _.compact(_.uniq(alumni.keywords.split(',').map(k => k.trim())));
				if (category.length > 1) {
					category.map(c =>  keywords.push(c) );
				} else {
					keywords.push(category.toString());
				}
				return alumni;
			});

			if(keywords.length > 0) {
				const categories = [];
				_.uniq(keywords).map((key, index) => categories.push({name: key, id: index}) );
				this.setState({
					alumniOffersKeywords: categories
				});
			}
		}

		this.setState({
			alumniOffers: response.data,
			loadingAlumniOffers: false
		});
	}

	handleAlumniOffersFilter(keywords) {
		const { alumniOffers: alumniOfferState } = this.state;
		if(keywords.length > 0) {
			const alumniOffers = alumniOfferState.alumni_offers && [...alumniOfferState.alumni_offers];
			const newAlumniOffers = [];
			keywords.map(res => {
				newAlumniOffers.push(..._.filter(alumniOffers, v => v.keywords.indexOf(res) !== -1));
			});
			this.setState({
				alumniOffersFiltered: {
					alumni_offers: _.uniq(newAlumniOffers)
				}
			});
		} else {
			this.setState({
				alumniOffersFiltered: null
			});
		}
	}

	async getCampusOffers() {
		this.setState({ loadingCampusOffers: true });
		const response = await API.campus_offers.getCampusOffers();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('Error', _.get(response, 'meta.message'));
			this.setState({ loadingCampusOffers: false });
			return;
		}

		const { campus_offers } = response.data;
		if(campus_offers && campus_offers.length) {
			const keywords=[];
			campus_offers.map(campus => {
				const category = _.compact(_.uniq(campus.keywords.split(',').map(k => k.trim())));
				if (category.length > 1) {
					category.map(c =>  keywords.push(c) );
				}	else {
					keywords.push(category.toString());
				}
				return campus;
			});

			if(keywords.length > 0) {
				const categories = [];
				_.uniq(keywords).map((key, index) => categories.push({name: key, id: index}) );
				this.setState({
					campusOffersKeywords: categories
				});
			}
		}

		this.setState({
			campusOffers: response.data,
			loadingCampusOffers: false
		});
	}

	handleCampusOffersFilter(keywords) {
		const { campusOffers: campusOfferState } = this.state;
		if(keywords.length > 0) {
			const campusOffers = campusOfferState.campus_offers && [...campusOfferState.campus_offers];
			const newCampusOffers = [];
			keywords.map(res => {
				newCampusOffers.push(..._.filter(campusOffers, v => v.keywords.indexOf(res) !== -1));
			});
			this.setState({
				campusOffersFiltered: {
					campus_offers: _.uniq(newCampusOffers)
				}
			});
		} else {
			this.setState({
				campusOffersFiltered: null
			});
		}
	}

	async getCoupons(initial) {
		if(!this.state.isLoggedIn) {
			return;
		}

		if(initial) {
			this.setState({ loadingCoupons: true });
		}

		const response = await API.saving_coupons.getCoupons();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('Error', _.get(response, 'meta.message'));
			this.setState({ loadingCoupons: false });
			return;
		}

		const { coupons } = response.data;
		const newCoupons = [...coupons];
		if (newCoupons.length > 0) {
			await Promise.all(coupons.map(async (item, index) => {
				if (item.asset_id) {
					const asset = await this.getAssetById(item.asset_id);
					newCoupons[index].file = asset.file;
				}
			}));
		}

		this.setState({
			coupons: newCoupons,
			loadingCoupons: initial && false
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

	hasHighlight = (highlights) => {
		this.setState({
			highlights
		});
	}

	changeActiveTab = (tabs) => {
		const { activeTab } = this.props;
		if (activeTab && tabs && 
				tabs[2].heading === 'Coupons' && 
				tabs[2].data.length !== undefined && 
				tabs[2].data.length > 0 && 
				!tabs[2].loading && 
				!tabs[1].loading && 
				!tabs[0].loading) {
			return activeTab;
		}
	}

	render() {
		const {
			alumniOffers, alumniOffersFiltered, alumniOffersKeywords, loadingAlumniOffers,
			campusOffers, campusOffersFiltered, campusOffersKeywords, loadingCampusOffers,
			coupons, loadingCoupons, isLoggedIn
		} = this.state;

		const tabs = [
			{
				component: AlumniTab,
				loading: loadingAlumniOffers,
				heading: 'Alumni Offers',
				data: alumniOffersFiltered !== null ? alumniOffersFiltered : alumniOffers,
				isLoggedIn,
				getData: this.getAlumniOffers.bind(this),
				handleFilter: this.handleAlumniOffersFilter.bind(this),
				keywords: alumniOffersKeywords
			},
			{
				component: CampusTab,
				loading: loadingCampusOffers,
				heading: 'Campus Offers',
				data: campusOffersFiltered !== null ? campusOffersFiltered : campusOffers,
				isLoggedIn,
				getData: this.getCampusOffers.bind(this),
				handleFilter: this.handleCampusOffersFilter.bind(this),
				keywords: campusOffersKeywords
			},
			{
				component: CouponsTab,
				loading: loadingCoupons,
				heading: 'Coupons',
				data: coupons,
				isLoggedIn,
				getData: this.getCoupons.bind(this)
			}
		];

		return (
			<Container>
				<Tabs
					tabContainerStyle={styles.tabContainerStyle}
					tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
					tabBarActiveTextColor="#1A1A1A"
					tabBarInactiveTextColor="#1A1A1A"
					page={this.changeActiveTab(tabs)}
				>
					{tabs.map((tab, index) => {
						// If no coupon available hide coupon tab
						if(_.get(tab, 'heading') === 'Coupons' && 
							_.get(tab, 'data').length !== undefined && 
							_.get(tab, 'data').length <= 0) {
							return null;
						}
						return <Tab
							key={index}
							heading={tab.heading}
							textStyle={styles.tabTextStyle}
							activeTextStyle={styles.tabActiveTextStyle}
							activeTabStyle={{ backgroundColor: '#FFFFFF' }}
							tabStyle={{ backgroundColor: '#FFFFFF' }}
						>
							<tab.component
								loading={tab.loading}
								data={tab.data}
								getData={() => tab.getData()}
								isLoggedIn={isLoggedIn}
								handleFilter={tab.handleFilter && tab.handleFilter}
								keywords={tab.keywords && tab.keywords}
							>
								<Highlights
									location="coupon"
									hasHighlight={this.hasHighlight}
								/>
							</tab.component>
						</Tab>;
					})}
				</Tabs>
			</Container>
		);
	}
}

// custom styles
const stylesAndroid = StyleSheet.create({
	tabContainerStyle: {
		height: 40
	},
	tabBarUnderlineStyle: {
		backgroundColor: '#D09A3A',
		height: 2.5
	},
	tabTextStyle: {
		fontSize: 12
	},
	tabActiveTextStyle: {
		fontSize: 12
	}
});
const stylesIOS = StyleSheet.create({
	tabContainerStyle: {
		height: 40
	},
	tabBarUnderlineStyle: {
		backgroundColor: '#D09A3A',
		height: 2.5
	},
	tabTextStyle: {
		fontSize: 12
	},
	tabActiveTextStyle: {
		fontSize: 12
	}
});

const styles = Platform.OS === 'ios' ? stylesIOS : stylesAndroid;

export default SavingsPage;
