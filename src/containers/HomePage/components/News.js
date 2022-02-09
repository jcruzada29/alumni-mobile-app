import React from 'react';
import moment from 'moment';
import { Text, View } from 'native-base';
import { TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';

const News = ({ id, title, file, display_date, description }) => {
	return (
		<TouchableOpacity
			style={Platform.OS === 'ios' ? styles.mainHolderIOS : styles.mainHolderAndroid}
			onPress={() => Actions.newsDetailPage({ newsId: id })}
		>
			<Image
				source={{ uri: file }}
				style={styles.newsImage}
			/>
			<View style={styles.imageBorderBottom}/>

			<View style={styles.newsTitleContainer}>
				<Text style={styles.newsTitle}>{title}</Text>
			</View>
			{/* <View style={styles.separator}/>
			<Text style={styles.displayDate}>{moment(display_date).format('D MMM YYYY')}</Text> */}
		</TouchableOpacity>
	);
};

// custom styles
const styles = StyleSheet.create({
	mainHolderIOS: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		marginLeft: 5,
		marginRight: 5,
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
	mainHolderAndroid: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 14,
		// shadow
		elevation: 5
	},
	newsImage: {
		width: '100%',
		height: 120,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
		// width: 60,
		// height: 60,
		resizeMode: 'cover'
	},
	imageBorderBottom: {
		height: 1,
		backgroundColor: '#DDDDDD'
	},
	newsTitleContainer: {
		flex: 1,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 8,
		marginBottom: 8,
		// height: 40,
		display: 'flex'
	},
	newsTitle: {
		fontSize: 12,
		fontWeight: '500',
		color: '#003366'
	},
	separator: {
		height: 1,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: '#DDDDDD'
	},
	displayDate: {
		fontSize: 10,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 8,
		marginBottom: 8,
		color: '#666'
	}
});

export default News;