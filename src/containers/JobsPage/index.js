/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { ScrollView, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Container, Text, View, Icon } from 'native-base';
import { withTranslation } from 'react-i18next';
import { Actions } from 'react-native-router-flux';

import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import Loading from '../../components/UI/Loading';
import DisclaimerModal from './components/DisclaimerModal';
import FilterCategory from './components/FilterCategory';

class JobsPage extends Component {
	state = {
		total: 0,
		jobs: [],
		loading: false,
		filtered_jobs: [],
		filtered_jobs_category: [],
		filter_keywords: [],
		showDisclaimer: false
	};

	componentDidMount() {
		this.getJobs();
	}

	componentDidUpdate(prevProps) {
		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;
		// reload when screen is focused
		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			Actions.refresh({ right: () =>
				<View style={{marginRight: 15}}>
					<TouchableOpacity onPress={(this.handleDisclaimerToggleModal)}>
						<Icon
							type="FontAwesome"
							name="info-circle"
							style={{ color: '#fff', fontSize: 20 }}
						/>
					</TouchableOpacity>
				</View>
			});
		}
	}

	handleDisclaimerToggleModal = () => {
		const {showDisclaimer} = this.state;
		this.setState({showDisclaimer: !showDisclaimer});
	}

	async getJobs() {
		this.setState({ loading: true });

		const response = await API.jobs.getJobs();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loading: false });
			return;
		}

		const { total, jobs } = response.data;
		const keywords = [];

		// Job Category filter
		let job_category = [];
		jobs.map(job => {
			const category = job.mCategory && job.mCategory;
			if(category && category.length > 1) {
				category.map(c => {
					job_category.push({id: c.id, name: c.mName, key: c.key});
				});
			}
			else if(category && category.length === 1) {
				job_category.push({id: category[0].id, name: category[0].mName, key: category[0].key});
			}
		});

		// Check if job category have values
		if(job_category.length > 0){
			job_category = {
				name: 'Job Category',
				id: 0,
				children: _.sortBy([..._.uniqBy(job_category, 'id')], o => o.name)
			};
			keywords.push(job_category);
		}

		// Business Nature filter
		let business_nature = [];
		jobs.map(nature => {
			const business = nature.mIndustry && _.compact(_.uniq(nature.mIndustry.split(',').map(k => k.trim())));
			if(business.length > 1) {
				business.map(c =>  business_nature.push(c) );
			} else {
				business_nature.push(business.toString());
			}
		});

		// Check if business nature have values
		if(business_nature.length > 0){
			business_nature = {
				name: 'Business Nature',
				id: 1,
				children: _.sortBy([..._.compact(_.uniq(business_nature, true)).map((nature, index) => { return {id: index, name: nature}; })], o => o.name)
			};
			keywords.push(business_nature);
		}

		this.setState({
			total,
			jobs: [...jobs],
			filtered_jobs: [...jobs],
			filter_keywords: keywords,
			loading: false
		});
	}

	handleOnchangeInputSearch = searchValue => {
		const { jobs, filtered_jobs_category } = this.state;
		const keyword = searchValue.replace(/[^a-zA-Z0-9 ]/g, '');
		const filtered_jobs = filtered_jobs_category.length > 0 ? filtered_jobs_category : jobs;

		let filteredJobs = filtered_jobs_category.length > 0 ? [...filtered_jobs_category] : [...jobs];
		if(keyword.trim() !== '' && keyword) {
			const regex = new RegExp(keyword, 'ig');
			filteredJobs = filtered_jobs.filter(job => {
				const title = _.get(job, 'mTitle', '');
				const values = [title];
				return values.some(value => regex.test(value));
			});
		}

		this.setState({ filtered_jobs: filteredJobs });
	}

	handleFilter = data => {
		const { jobs } = this.state;
		let filteredJobs = [...jobs];

		if(data.length > 0) {
			const newFilterJob = [];
			data.map(name => {
				newFilterJob.push(
					_.compact(jobs.map( cat =>
						_.find(cat.mCategory, {mName: name}) || _.includes(cat.mIndustry, name) ?
							cat : undefined )
					));
			});

			filteredJobs = _.uniq(_.flatten(newFilterJob));
		} else {
			this.setState({ filtered_jobs_category: [] });
		}

		this.setState({ filtered_jobs: filteredJobs, filtered_jobs_category: filteredJobs });
	}

	render() {
		const { total, loading, filtered_jobs, filter_keywords, showDisclaimer } = this.state;

		if (loading) {
			return (
				<Container><Loading /></Container>
			);
		}

		return (
			<Container>
				<View style={styles.searchInputContainer}>
					<View style={styles.searchInputSubContainer}>
						<TextInput
							placeholder="Search Job"
							style={styles.searchInputInput}
							onChangeText={value => this.handleOnchangeInputSearch(value)}
						/>
						<FilterCategory
							filter_keywords={filter_keywords}
							confirm={this.handleFilter}
						/>
					</View>
				</View>
				{!loading && total === 0 || !filtered_jobs.length && (
					<View style={styles.labelContainer}>
						<Text style={styles.label}>No Jobs available</Text>
					</View>
				)}
				<ScrollView>
					<View style={styles.jobsContainer}>
						{!loading && total > 0 && filtered_jobs.length ? filtered_jobs.map(filtered_job => {
							const { o_id, mTitle, mCompany, mReferred, mCloseDate } = filtered_job;
							return (
								<View
									key={o_id}
									style={Platform.OS === 'ios' ? styles.jobMainHolderIOS : styles.jobMainHolderAndroid}
								>
									<View style={styles.jobCard}>
										<TouchableOpacity
											onPress={() => Actions.jobDetailPage({ id: o_id })}
											style={styles.mLeft15}
										>
											<View>
												<Text style={styles.titleText}>{mTitle}</Text>
											</View>
											<View>
												<Text style={styles.textCompany}>
													{mCompany}
													{mReferred && ' (Referred by HKUST alumni)'}
												</Text>
											</View>
											{
												!_.isNil(mCloseDate) &&
												<View>
													<Text style={styles.textCloseDate}>
														{`Close on (${mCloseDate})`}
													</Text>
												</View>
											}
										</TouchableOpacity>
									</View>
								</View>
							);
						}) : <View style={styles.labelContainer} />
						}
					</View>
				</ScrollView>
				<DisclaimerModal
					isOpen={showDisclaimer}
					toggleModal={() => this.handleDisclaimerToggleModal()}
				/>
			</Container>
		);
	}
}

// custom styles
const styles = StyleSheet.create({

	labelContainer: {
		display: 'flex',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	label: {
		fontSize: 12
	},
	jobContainer: {
		backgroundColor: '#FFF',
		padding: 14,
		borderBottomColor: '#E6E6E6',
		borderBottomWidth: 1
	},
	title: {
		fontSize: 13,
		fontWeight: '500',
		color: '#059A63',
		marginBottom: 15
	},
	detailsContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 5
	},
	detailsLabelContainer: {
		width: 80
	},
	detailsLabel: {
		fontSize: 10,
		color: '#565656'
	},
	detailsContentContainer: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column'
	},
	detailsContent: {
		fontSize: 10
	},
	searchInputInput: {
		backgroundColor: '#FFFFFF',
		height: 40,
		borderRadius: 8,
		lineHeight: 15,
		// borderWidth: 1,
		// borderColor: '#D8D8D8',
		width: '100%',
		fontSize: 14,
		color: '#242424',
		marginTop: 15,
		paddingLeft: 20,
		// shadow
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	searchInputContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginLeft: 12,
		marginRight: 12,
		marginBottom: 15
	},
	searchInputSubContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	jobsContainer: {
		// marginTop: 12,
		marginBottom: 80,
		marginLeft: 12,
		marginRight: 12
	},
	jobMainHolderIOS: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		// marginLeft: 5,
		// marginRight: 5,
		marginBottom: 14,
		// shadow
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84
	},
	jobMainHolderAndroid: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		// marginLeft: 5,
		// marginRight: 5,
		marginBottom: 14,
		// shadow
		elevation: 5
	},
	// jobMainHolder: {
	// 	flexDirection: 'row',
	// 	justifyContent: 'center',
	// 	marginBottom: 15,
	// 	// shadow
	// 	shadowColor: '#000',
	// 	shadowOffset: {
	// 		width: 0,
	// 		height: 2
	// 	},
	// 	shadowOpacity: 0.25,
	// 	shadowRadius: 3.84
	// },
	jobCard: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		width: '100%',
		paddingTop: 8,
		paddingBottom: 8,
		paddingRight: 4,
		paddingLeft: 4,
		borderRadius: 5,
		minHeight: 68
	},
	mLeft15: {
		marginLeft: 15
	},
	titleText: {
		fontSize: 14,
		color: '#003366',
		fontWeight: 'bold'
	},
	textCompany: {
		marginTop: 5,
		fontSize: 12,
		color: '#000000'
	},
	textCloseDate: {
		marginTop: 16,
		fontSize: 12,
		color: '#4A4A4A',
		fontStyle: 'italic'
	},
	text: {
		color: '#666666',
		shadowColor: '#00000029',
		shadowOffset: {
			height: 3,
			width: 0
		},
		shadowOpacity: 1,
		shadowRadius: 6,
		fontSize: 12,
		fontWeight: '500',
		marginRight: 5
	},
	icon: {
		color: '#666666',
		fontSize: 16,
		marginLeft: 5
	}
});

export default withTranslation()(JobsPage);
