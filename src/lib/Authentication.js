import { Actions, ActionConst } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';

import AsyncStorageKeys from '../constants/AsyncStorageKeys';
import AlertUtility from './AlertUtility';

const AuthenticationHelper = {
	async isLoggedIn() {
		// Check if auth token is present
		const token = await AsyncStorage.getItem(AsyncStorageKeys.USER_AUTH_TOKEN);
		return Boolean(token);
	}

};

export default AuthenticationHelper;