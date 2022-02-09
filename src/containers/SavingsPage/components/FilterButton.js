import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

class FilterButton extends Component {
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
		const { keywords, confirm } = this.props;
		return (
			<SafeAreaView>
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
								top: '30%',
								bottom: '30%',
								width: '90%',
								minHeight: 250,
								maxHeight: 250
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
								alignSelf: 'flex-end',
								marginRight: 16,
								marginTop: 10,
								marginBottom: 5,
								width: 100,
								flexDirection: 'row',
								justifyContent: 'center',
								borderRadius: 50,
								backgroundColor: '#ececec',
								paddingLeft: 20,
								paddingRight: 20,
								paddingTop: 5,
								paddingBottom: 5
							}
						}
					}
					colors={{
						text: '#555555'
					}}
					itemFontFamily="normal"
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
					uniqueKey="id"
					items={keywords}
					onSelectedItemsChange={this.onSelectedItemsChange}
					selectedItems={this.state.selectedItems}
					onConfirm={() => confirm(this.state.selectedItems)}
					showChips={false}
					showRemoveAll={true}
					removeAllText="Remove all"
					confirmText="Filter selected"
					selectedIconComponent={<Icon
						size={14}
						name="check"
						style={{ color: '#666666', marginRight: 10 }}
					/>}
				/>
				{/* </Button> */}
			</SafeAreaView>
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
	// 	width: 130
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

export default FilterButton;
