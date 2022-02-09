import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	modalStyle: {
		flex: 1,
		alignItems: 'center'
	},
	modalWrapper: {
		width: 298,
		height: 350,
		backgroundColor: 'white',
		borderRadius: 10
	},
	contentHolder: {
		display: 'flex',
		flexDirection: 'column'
	},
	modalContent: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center'
	},
	closeIconHolder: {
		flexDirection: 'row-reverse',
		paddingTop: 8,
		paddingLeft: 8
	},
	iconStyle: {
		fontSize: 14,
		color: '#999999'
	},
	imgHolder: {
		alignItems: 'center',
		paddingTop: 15
	},
	imgStyle: {
		height: 131,
		width: 162,
		resizeMode: 'contain'
	},
	titleHolder: {
		marginTop: 20,
		marginBottom: 8
	},
	titleText: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 20,
		color: '#1A1A1A'
	},
	descriptionHolder: {
		marginTop: 12,
		marginBottom: 20,
		marginLeft: 8,
		marginRight: 8
	},
	descriptionText: {
		fontSize: 14,
		color: '#666666',
		textAlign: 'center',
		lineHeight: 14
	},
	buttonHolder: {
		marginLeft: 20,
		marginRight: 20
	},
	applyNowText: {
		fontSize: 12,
		color: '#FFFFFF',
		textAlign: 'center'
	},
	mTop10: {
		marginTop: 10
	},
	maybeLaterText: {
		fontSize: 12,
		color: '#8B8F90',
		textAlign: 'center'
	},
	privilegeName: {
		fontWeight: 'bold',
		color: '#003366',
		marginTop: 20
	},
	privilegeDescription: {
		marginTop: 20,
		fontWeight: '400',
		color: 'grey',
		fontSize: 15,
		width: '80%',
		textAlign: 'center'
	},
	privilegeValidity: {
		marginTop: 20,
		fontWeight: '400',
		color: 'grey',
		fontSize: 15,
		width: '90%',
		textAlign: 'center'
	},
	privilegeQR: {
		alignSelf: 'center',
		width: 250,
		height: 250
	},
	closeBtn: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 10,
		paddingBottom: 0
	},
	buttonStyle: {
		height: 31,
		backgroundColor: '#059A63'
	}
});