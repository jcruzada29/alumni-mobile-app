import React, { Component } from 'react';
import {ListItem, Text } from 'native-base';

class ListItemDivider extends Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<ListItem itemDivider>
				<Text style={{fontSize: 14, color: '#666', marginTop: 8}}>{ this.props.text || ' '}</Text>
			</ListItem>
		);
	}
};

export default ListItemDivider;