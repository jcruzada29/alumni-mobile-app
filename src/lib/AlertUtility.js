import { Alert } from 'react-native';

export default {
	show(title, message) {
		setTimeout( () => {
			Alert.alert(title, message);
		}, 200);
	}
};