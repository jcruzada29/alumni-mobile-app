import React from 'react';
import { View, ActivityIndicator } from 'react-native';
// import Colors from '../../../native-base-theme/variables/commonColor';

const Loading = (props) => (
	<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
		<ActivityIndicator
			color={props.color ? props.color : '#0B3366' }
			{...props}
		/>
	</View>
);

export default Loading;
