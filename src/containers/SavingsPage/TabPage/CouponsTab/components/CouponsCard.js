import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {
	Body,
	Card,
	CardItem,
	Text
} from 'native-base';
import moment from 'moment';
import _ from 'lodash';

const CouponsCard = (props) => {
	const { file, merchant_name, name, publish_end_date, redeemed } = props.coupon;
	return (
		<Card style={{ borderRadius: 5 }}>
			<CardItem
				cardBody
				style={styles.header}
			>
				<Image
					source={{ uri: file || 'https://dummyimage.com/162x95/202/aaa' }} // Temp Image
					style={styles.image}
				/>
			</CardItem>
			<CardItem>
				<Body style={styles.bodyDetails}>
					<Text style={styles.merchantName}>
						{merchant_name}
					</Text>
					<Text style={styles.couponName}>
						{name}
					</Text>
					<Text style={styles.endDate}>
						Valid until {moment(publish_end_date).format('D MMM YYYY')}
					</Text>
				</Body>
			</CardItem>
			<CardItem
				footer
				style={redeemed ? styles.btnDisabled : styles.btnEnabled}
			>
				{
					redeemed ?
						(<Text style={styles.footerText}>Used</Text>) :
						(<Text style={styles.footerText}>Redeem Coupon</Text>)
				}
			</CardItem>
		</Card>
	);
};

const styles = StyleSheet.create({
	bodyDetails: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5
	},
	image: {
		height: 95,
		width: 162,
		aspectRatio: 162/95,
		flex: 1,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		resizeMode: 'cover'
	},
	merchantName: {
		fontSize: 8,
		lineHeight: 10,
		color: '#F21E25',
		fontWeight: '500'
	},
	couponName: {
		fontSize: 12,
		marginTop: 4,
		lineHeight: 14,
		color: '#1B1B1B',
		fontWeight: '500'
	},
	endDate: {
		fontSize: 8,
		marginTop: 4,
		fontWeight: 'normal',
		lineHeight: 10,
		color: '#996500'
	},
	btnDisabled: {
		height: 32,
		backgroundColor: '#BDBEC0',
		justifyContent: 'center',
		alignContent: 'center',
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5
	},
	btnEnabled: {
		height: 32,
		backgroundColor: '#7C2548',
		justifyContent: 'center',
		alignContent: 'center',
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5
	},
	footerText: {
		fontSize: 12,
		lineHeight: 14,
		fontWeight: 'normal',
		color: '#fff'
	}
});

export default CouponsCard;
