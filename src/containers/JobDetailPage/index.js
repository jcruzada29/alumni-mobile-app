/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import _ from 'lodash';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { Container, Text, View } from 'native-base';
import { withTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';

import { SafeAreaView } from 'react-native-safe-area-context';
import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import Loading from '../../components/UI/Loading';

class JobDetailPage extends Component {
	state = {
		job: null,
		loading: true
	};

	componentDidMount() {
		const { id } = this.props;
		if (id) {
			this.getJobById(id);
		}
	}

	async getJobById(id) {
		this.setState({ loading: true });

		const response = await API.jobs.getJobById(id);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loading: false });
			return;
		}

		const { job } = response.data;
		this.setState({
			job,
			loading: false
		});
	}

	render() {
		const { job, loading } = this.state;

		if (loading) {
			return (
				<Container><Loading /></Container>
			);
		}

		const {
			mTitle,
			mPostDate,
			mIndustry,
			mCompanyName,
			mCompanyDetail,
			mRequirement,
			mJobInfo,
			mCloseDate
		} = job;

		return (
			<SafeAreaView>
				{!loading && !job && (
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Cannot find job</Text>
					</View>
				)}
				{!loading && job && (
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.mainContainer}>
							<View style={styles.mBottom6}>
								<Text style={styles.textTitle}>
									{mTitle}
								</Text>
							</View>
							<View>
								<Text style={styles.textCompanyName}>
									{mCompanyName}
								</Text>
							</View>
							<View style={styles.line} />
							<View>
								<Text style={styles.fSize14}>
									Post Date: {mPostDate}
								</Text>
							</View>
							{
								mCloseDate &&
								<View style={styles.mTop15}>
									<Text style={styles.fSize14}>
										Close Date: {mCloseDate}
									</Text>
								</View>
							}
							<View style={styles.mTop15}>
								<Text style={styles.fSize14}>
									Category: {mIndustry}
								</Text>
							</View>
							<View style={styles.mTop15}>
								<View>
									<Text style={styles.fSize14}>Company Details</Text>
								</View>
								<HTML
									html={mCompanyDetail || '<h5>No data found</h5>'}
									onLinkPress={(evt, href) => { Linking.openURL(href); }}
								/>
							</View>
							<View style={styles.mTop15}>
								<View>
									<Text style={styles.fSize14}>
										Job Requirements:
									</Text>
								</View>
								<View style={styles.mTop15}>
									<HTML
										html={mRequirement || '<h5>No data found</h5>'}
										onLinkPress={(evt, href) => { Linking.openURL(href); }}
									/>
								</View>
							</View>
							{
								mJobInfo && mJobInfo.map(info => {
									if (info.mHighlightTitle === 'Application Method') {
										return <View style={styles.mTop15}>
											<View>
												<Text style={styles.fSize14}>
													Application Method:
												</Text>
											</View>
											<View style={styles.mTop15}>
												<HTML
													html={ info.mHighlightValue || '<h5>No data found</h5>'}
													onLinkPress={(evt, href) => { Linking.openURL(href); }}
												/>
											</View>
										</View>;
									}
								})
							}
						</View>
					</ScrollView>
				)}
			</SafeAreaView>
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
	labelSemiBold: {
		fontSize: 12,
		fontWeight: '500'
	},
	text: {
		fontSize: 10
	},
	jobContainer: {
		padding: 14
	},
	titleContainer: {
		borderTopColor: '#059A63',
		borderTopWidth: 2,
		borderBottomColor: '#059A63',
		borderBottomWidth: 2,
		paddingTop: 10,
		paddingBottom: 10,
		marginTop: 5,
		marginBottom: 15
	},
	title: {
		fontSize: 15,
		fontWeight: '500',
		color: '#059A63',
		textAlign: 'center'
	},
	sectionContainer: {
		marginBottom: 15
	},
	jobInfoContainer: {
		padding: 15,
		backgroundColor: '#E9F3EB'
	},
	webview: {
		width: '100%'
	},
	mainContainer: {
		margin: 20,
		padding: 20,
		backgroundColor: '#FFFFFF',
		borderRadius: 8,
		// shadow
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84
	},
	mBottom6: {
		marginBottom: 6
	},
	textTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#003366'
	},
	textCompanyName: {
		marginTop: 8,
		fontSize: 14,
		color: '#4A4A4A'
	},
	line: {
		borderBottomWidth: .6,
		borderBottomColor: '#cccccc',
		marginBottom: 15,
		marginTop: 15
	},
	mBottom5: {
		marginBottom: 5
	},
	fSize14: {
		fontSize: 14
	},
	mTop15: {
		marginTop: 15
	}
});

export default withTranslation()(JobDetailPage);