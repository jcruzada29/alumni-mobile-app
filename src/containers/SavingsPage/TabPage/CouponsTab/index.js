import React, { Component } from 'react';
import { StyleSheet ,
	View,
	TouchableOpacity,
	ScrollView
} from 'react-native';

import {
	Container,
	Content,
	Text
} from 'native-base';
// Empty State Screen
import LoginRequiredEmptyStatePage from '../../../LoginRequiredEmptyStatePage';
import Loading from '../../../../components/UI/Loading';
import RedeemModal from './components/RedeemModal';
import CouponsCard from './components/CouponsCard';
import QRModal from './components/QRModal';

class CouponsTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			couponDetails: {},
			modalRedeem: false,
			modalCode: false,
			idx: 0
		};
	}

	componentDidUpdate(prevProps) {
		const { data: prev_data } = prevProps;
		const { data } = this.props;
		const { idx } = this.state;

		if(data && data !== undefined && data !== prev_data) {
			this.onChange(data[idx]);
		}
	}

	onChange(data) {
		this.setState({couponDetails: data});
	}

	render() {
		const { children, data, loading, getData, isLoggedIn } = this.props;
		const { modalCode, modalRedeem, couponDetails } = this.state;

		if(!isLoggedIn) {
			return <LoginRequiredEmptyStatePage />;
		}

		return (
			<Container>
				<Content>
					<QRModal
						isOpen={modalCode}
						couponDetails={couponDetails}
						toggleModal={() => this.setState({ modalCode: false })}
					/>
					<RedeemModal
						isOpen={modalRedeem}
						couponDetails={couponDetails}
						getData={getData}
						toggleModal={() => this.setState({ modalRedeem: false })}
						toggleCodeModal={() => this.setState({ modalCode: true })}
					/>
					{loading ? (<Loading />) : (
						<ScrollView>
							{children}
							<View style={styles.scrollWrapper}>
								{
									data && data.length && !loading ?
										data.map((coupon, index) => {
											return (
												<View
													key={index}
													style={styles.touchable}
												>
													<TouchableOpacity
														onPress={() => this.setState({
															couponDetails: { ...coupon },
															modalRedeem: !modalRedeem,
															modalCode: false,
															idx: index
														})}
													>
														<CouponsCard coupon={coupon} />
													</TouchableOpacity>
												</View>
											);
										})
										: <View style={styles.noData}><Text>No coupon found</Text></View>
								}
							</View>
						</ScrollView>
					)}
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	scrollWrapper: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 5,
		paddingRight: 5
	},
	touchable: {
		width: '50%',
		height: 188,
		borderRadius: 5,
		paddingLeft: 8,
		paddingRight: 8,
		marginBottom: 30
	},
	noData: {
		height: 500,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default CouponsTab;
