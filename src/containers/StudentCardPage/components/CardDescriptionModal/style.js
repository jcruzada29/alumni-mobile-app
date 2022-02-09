import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	modalStyle: {
		flex: 1,
		alignItems: 'center'
	},
	modalWrapper: {
		width: 298,
		paddingBottom: 16,
		backgroundColor: 'white',
		borderRadius: 10
	},
	contentHolder: {
		display: 'flex',
		flexDirection: 'column'
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
	titleHolder: {
		marginTop: 0,
		marginBottom: 20
	},
	titleText: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 16,
		color: '#1A1A1A'
	},
	descriptionHolder: {
		marginBottom: 20
	},
	descriptionText: {
		fontSize: 12,
		color: '#666666',
		// textAlign: 'center',
		lineHeight: 14
	},
	closeTextHolder: {
		alignContent: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	},
	closeText: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 12,
		color: '#8B8F90',
		flexShrink: 1
	}
});