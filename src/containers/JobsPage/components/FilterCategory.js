import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

class FilterCategory extends Component {
	constructor() {
		super();
		this.state = {
			selectedItems: []
		};
	}

	onSelectedItemsChange = (selectedItems) => {
		this.setState({ selectedItems });
	};

	render() {
		const { filter_keywords, confirm } = this.props;

		return (
			<SectionedMultiSelect
				styles={
					{
						button: {
							backgroundColor: '#003366'
						},
						container: {
							flex: 0,
							alignSelf: 'center',
							justifyContent: 'center',
							top: '20%',
							bottom: '20%',
							width: '90%',
							minHeight: 500,
							maxHeight: 500
						},
						scrollView: {
							flex: 1,
							width: '100%',
							paddingRight: 0,
							paddingLeft: 0
						},
						itemText: {
							paddingLeft: 10
						},
						separator: {
							width: '95%',
							alignSelf: 'center'
						},
						selectToggle: {
							position: 'absolute',
							alignSelf: 'flex-end',
							flexDirection: 'row',
							justifyContent: 'center',
							width: 100,
							borderRadius: 50,
							backgroundColor: '#ececec',
							paddingTop: 5,
							paddingBottom: 5,
							top: '40%',
							bottom: '12%',
							right: 3
						}
					}
				}
				colors={{
					text: '#555555'
				}}
				renderSelectText={() => {
					return (
						<View style={{flexDirection: 'row'}}>
							<Text
								style={styles.text}
							>
								Filter
							</Text>
							<FontAwesomeIcon
								type="FontAwesome"
								name="filter"
								style={styles.icon}
							/>
						</View>
					);
				}}
				selectToggleIconComponent={<Text />}
				selectText="Filter"
				hideSearch={true}
				IconRenderer={Icon}
				uniqueKey="name"
				items={filter_keywords}
				subKey="children"
				showDropDowns={true}
				readOnlyHeadings={true}
				onSelectedItemsChange={this.onSelectedItemsChange}
				selectedItems={this.state.selectedItems}
				onConfirm={() => confirm(this.state.selectedItems)}
				showChips={false}
				removeAllText="Remove all"
				confirmText="Filter selected"
				selectedIconComponent={<Icon
					size={14}
					name="check"
					style={{ color: '#666666', marginRight: 10 }}
				/>}
			/>
		);
	};
};

const styles = StyleSheet.create({
	// button: {
	// 	alignSelf: 'flex-end',
	// 	justifyContent: 'center',
	// 	marginRight: 20,
	// 	marginTop: 10,
	// 	marginBottom: 10,
	// 	backgroundColor: '#ececec',
	// 	width: 130,
	// 	height: 50
	// },
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

export default FilterCategory;
