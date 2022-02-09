import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { Item, Label, Icon } from 'native-base';
import { Picker } from '@react-native-picker/picker';

class CountryPicker extends Component {
	render = () => {
		const { label, placeholder, name, value, countries, onFieldChange } = this.props;

		return (
			<View
				style={{marginLeft: 15, marginTop: 10, borderBottomWidth: Platform.OS !== 'ios' ? .4 : null, borderBottomColor: Platform.OS !== 'ios' ? '#999' : null }}
			>
				<Text style={{fontSize: 14, color: '#444'}}>{ label }</Text>

				<Picker
					mode="dropdown"
					iosIcon={<Icon
						type="AntDesign"
						name="caretdown"
						style={{color: '#777', fontSize: 14, marginTop: 10}}
					/>}
					style={{width: undefined, borderBottomWidth: .3, borderBottomColor: '#999'}}
					placeholder={placeholder}
					placeholderStyle={{ color: '#bfc6ea' }}
					placeholderIconColor="#007aff"
					textStyle={{ fontSize: 17, marginBottom: -20, marginLeft: -12 }}
					selectedValue={value}
					onValueChange={(val) => onFieldChange({ name, value: val})}
				>
					{
						countries && countries.map(c => (
							<Picker.Item
								value={c.countryCode}
								label={c.countryName}
								key={c.countryCode}
							/>
						))
					}
				</Picker>
			</View>
		);
	}
}

// custom styles
// const styles = StyleSheet.create({
// });

export default CountryPicker;
