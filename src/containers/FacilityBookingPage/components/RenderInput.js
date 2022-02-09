import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const RenderInput = ({name, onchange, placeholder, value, isEditable, type}) => {
	let editableInput = isEditable;
	if(type === 'date' || type === 'time'){
		editableInput = false;
	}
	return (
		<View style={styles.contentHolder}>
			<Text style={styles.nameText}>{name}</Text>
			<View style={styles.textInputHolder}>
				<TextInput
					onChangeText={(text) => onchange(text)}
					placeholder={placeholder}
					editable={editableInput}
					value={value}
					style={styles.textInputStyle}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	contentHolder: {
		flexDirection: 'column',
		marginBottom: 10
	},
	nameText: {
		color: '#242424',
		fontSize: 14,
		marginBottom: 5
	},
	textInputHolder: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	textInputStyle: {
		fontSize: 14,
		height: 40,
		color: '#242424',
		paddingLeft: 20,
		justifyContent: 'center',
		textAlignVertical: 'center',
		// textAlign: 'center',
		borderWidth: 1,
		borderColor: '#D8D8D8',
		backgroundColor: '#FFFFFF',
		borderRadius: 17,
		// height: 34,
		paddingTop: 4,
		paddingBottom: 4,
		width: '100%'
	}
});

export default RenderInput;