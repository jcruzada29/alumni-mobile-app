import React, { Component } from 'react';
import { Container, Content, Text, Item, Input, Button } from 'native-base';
import { View, StyleSheet, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from '@react-native-community/async-storage';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import Loading from '../../components/UI/Loading';
import AlertUtility from '../../lib/AlertUtility';
import API from '../../lib/API';

class LibraryBorrowingPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			submitting: false,
			showWebView: false,
			//
			email: '',
			subscription: null,
			invoiceNumber: null,
			paymentUrl: null
		};
		this.webview = React.createRef();
	}

	navigationChangeHandler = async (state) => {
		// handle require payment case
		if (state.url.includes('verify?invoiceNumber')) {
			// stop webivew
			this.webview.current.stopLoading();

			// hide webview
			this.setState({
				showWebView: false
			});

			await this.verifySubscription();
		}
	}

	async getSubscription() {
		const { subscription_id } = this.props;
		this.setState({
			loading: true,
			subscription: null
		});
		const getSubscriptionRes = await API.subscriptions.getSubscriptionById(subscription_id);
		if (getSubscriptionRes.meta.code !== 200) {
			AlertUtility.show('ERROR', getSubscriptionRes.meta.message);
			this.setState({ loading: false });
			return;
		}

		const getUserRes = await API.users.getMe();
		if (getUserRes.meta.code !== 200) {
			AlertUtility.show('ERROR', getSubscriptionRes.meta.message);
			this.setState({ loading: false });
			return;
		}

		delete getSubscriptionRes.data.subscription.photo;

		this.setState({
			loading: false,
			subscription: getSubscriptionRes.data.subscription,
			email: getUserRes.data.user.preferred_email
		});
	}

	async componentDidMount() {
		await this.getSubscription();
	}

	async createNewCharge() {
		this.setState({
			submitting: true,
			showWebView: false,
			invoiceNumber: null,
			paymentUrl: null
		});

		// Update Email
		const updateEmailRes = await API.users.updatePreferredEmail({ user: { preferred_email: this.state.email } });
		if (updateEmailRes.meta.code !== 200) {
			AlertUtility.show('ERROR', updateEmailRes.meta.message);
			this.setState({ submitting: false });
			return;
		}

		// Creat New charge
		const { subscription_id } = this.props;
		const newChargeRes = await API.subscriptions.newSubscription({
			subscription_id,
			payment_method: 'visa_master' // TODO: allow selection of payment method
		});
		if (newChargeRes.meta.code !== 200) {
			AlertUtility.show('ERROR', newChargeRes.meta.message);
			this.setState({ submitting: false });
			return;
		}

		const { invoice_number, redirect_url } = newChargeRes.data;

		if (redirect_url === '') {
			AlertUtility.show('Success', 'Your application is successful');
			this.setState({
				submitting: false,
				invoiceNumber: null,
				paymentUrl: null
			});

			this.navigateToPreviousPage();
			return;
		}

		this.setState({
			showWebView: true,
			invoiceNumber: invoice_number,
			paymentUrl: redirect_url
		});
	}

	async verifySubscription() {
		// Creat New charge
		const { invoiceNumber } = this.state;
		const res = await API.subscriptions.verifySubscription({ invoice_number: invoiceNumber });
		if (res.meta.code !== 200) {
			AlertUtility.show('ERROR', res.meta.message);
			this.setState({
				submitting: false,
				invoiceNumber: null,
				paymentUrl: null
			});
			return;
		}
		AlertUtility.show('Success', 'Your application is successful');
		this.setState({
			submitting: false,
			invoiceNumber: null,
			paymentUrl: null
		});

		this.navigateToPreviousPage();
	}

	navigateToPreviousPage() {
		setTimeout(() => Actions.pop(), 100);
	}

	render = () => {
		const { loading, submitting, showWebView, email, subscription, paymentUrl } = this.state;
		if (loading) {
			return (
				<Container>
					<Loading />
				</Container>
			);
		}
		if (!subscription) {
			return (
				<Container>
					<Text style={{textAlign: 'center', marginTop: 20 }}>Subscription not found</Text>
				</Container>
			);
		}

		if (showWebView && paymentUrl) {
			return (
				<Container>
					<WebView
						ref={this.webview}
						onLoad={this.hideLoading}
						source={{ uri: paymentUrl }}
						onNavigationStateChange={this.navigationChangeHandler}
					/>
				</Container>
			);
		}

		return (
			<Container>
				<Content style={styles.content}>
					<Text style={styles.title}>{ subscription.name }</Text>
					<Text style={styles.details}>{ subscription.application_service_description }</Text>
					<View style={styles.inputContainer}>
						<Item
							rounded
							style={styles.inputItem}
						>
							<Input
								placeholderTextColor="#bfc6ea"
								style={styles.inputText}
								autoCapitalize="none"
								rounded
								value={email}
								placeholder="Email Address"
								onChangeText={(val) => this.setState({ email: val })}
							/>
						</Item>
					</View>
					<Text style={styles.details}>{ subscription.application_fee_description }</Text>
					<View style={{flexDirection: 'row'}}>
						<Text
							style={[styles.details, { color: '#1C7FFB', flexShrink: 1 }]}
							onPress={() => Linking.openURL(subscription.term_condition_url)}
						>
							Terms of Services
						</Text>
					</View>

					<Text style={styles.details}>{ subscription.application_discount_description }</Text>
					<View style={{ marginTop: 10, marginBottom: 10 }}>
						<Button
							disabled={submitting}
							success={!submitting}
							style={{ height: 38 }}
							full
							rounded
							onPress={() =>
								Alert.alert(
									'',
									subscription.application_confirmation_description,
									[
										{
											text: 'Cancel',
											style: 'cancel'
										},
										{
											text: 'Submit',
											onPress: () => this.createNewCharge()
										}
									],
									{ cancelable: true }
								)
							}
						>
							{
								submitting
									? <Loading
										color="white"
										style={{ textAlign: 'center'}}
									/>
									: <Text style={{ fontWeight: 'bold', fontSize: 12, lineHeight: 14, letterSpacing: 0, justifyContent: 'center', color: '#FFFFFF' }}>SUBMIT</Text>
							}
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		paddingLeft: 13,
		paddingRight: 13,
		paddingTop: 23
	},
	title: {
		fontWeight: '700',
		fontSize: 15,
		lineHeight: 18,
		color: '#0F3A74',
		marginBottom: 10
	},
	details: {
		marginTop: 10,
		marginBottom: 10,
		fontWeight: '300',
		fontSize: 12,
		color: '#606060',
		lineHeight: 14,
		letterSpacing: 0
	},
	inputLabel: {
		fontWeight: 'bold',
		marginLeft: 20
	},
	inputText: {
		fontSize: 12,
		lineHeight: 14,
		letterSpacing: 0,
		fontWeight: '300',
		color: '#242424'
	},
	inputContainer: {
		alignSelf: 'center',
		width: '94%',
		marginTop: 10,
		marginBottom: 10
	},
	inputItem: {
		backgroundColor: 'white',
		height: 34
	},
	inputItemDisabled: {
		backgroundColor: '#eeeeee'
	}
});

export default LibraryBorrowingPage;
