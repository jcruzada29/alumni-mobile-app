import _ from 'lodash';
import { Alert, AsyncStorage } from 'react-native';
import RNRestart from 'react-native-restart';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';

import config from '../../config';
import AlertUtility from '../AlertUtility';

export default {
	_objToQueryString(obj) {
		const keyValuePairs = [];
		for (const key in obj) {
			keyValuePairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
		}
		return keyValuePairs.join('&');
	},
	async _handleInvalidBearerToken({ result }) {
		const resBody = await result.json();
		const code = _.get(resBody, 'meta.code');
		if (code === 4031 || code === 4032) {
			// clear token
			await AsyncStorage.removeItem(AsyncStorageKeys.USER_AUTH_TOKEN);
			await AsyncStorage.removeItem(AsyncStorageKeys.USER_ID);
			await AsyncStorage.removeItem(AsyncStorageKeys.USER_APPLOCK_PIN);
			await AsyncStorage.removeItem(AsyncStorageKeys.USER_APPLOCK_ENABLE_BIOMETRIC);

			// reload app after login to guest mode
			Alert.alert(
				'',
				'Session expired. You would be logged out of your account.',
				[
					{ text: 'OK', onPress: () => RNRestart.Restart() }
				],
				{ cancelable: false }
			);
		}
		return resBody;
	},
	async get(path, query) {
		const uri = this._generateRequestUri(path, query);
		const headers = await this._generateRequestHeaders();
		const options = {
			method: 'GET',
			headers
		};
		try {
			const result = await fetch(uri, options);
			const resBody = await this._handleInvalidBearerToken({ result });
			return resBody;
		} catch (e) {
			console.log('Network error -> ', e);
			return this._networkError();
		}
	},

	async post(path, body) {
		const uri = this._generateRequestUri(path);
		const headers = await this._generateRequestHeaders();
		const options = {
			method: 'POST',
			body: body ? JSON.stringify(body) : null,
			headers
		};
		try {
			const result = await fetch(uri, options);
			const resBody = await this._handleInvalidBearerToken({ result });
			return resBody;
		} catch (e) {
			console.log('Network error -> ', e);
			return this._networkError();
		}
	},

	async put(path, body) {
		const uri = this._generateRequestUri(path);
		const headers = await this._generateRequestHeaders();
		const options = {
			method: 'PUT',
			body: body ? JSON.stringify(body) : null,
			headers
		};
		try {
			const result = await fetch(uri, options);
			const resBody = await this._handleInvalidBearerToken({ result });
			return resBody;
		} catch (e) {
			console.log('Network error -> ', e);
			return this._networkError();
		}
	},

	async patch(path, body) {
		const uri = this._generateRequestUri(path);
		const headers = await this._generateRequestHeaders();
		const options = {
			method: 'PATCH',
			body: body ? JSON.stringify(body) : null,
			headers
		};
		try {
			const result = await fetch(uri, options);
			const resBody = await this._handleInvalidBearerToken({ result });
			return resBody;
		} catch (e) {
			console.log('Network error -> ', e);
			return this._networkError();
		}
	},

	async delete(path, query) {
		const uri = this._generateRequestUri(path, query);
		const headers = await this._generateRequestHeaders();
		const options = {
			method: 'DELETE',
			headers,
			simple: false, // do not throw error when status code is not 2xx
			json: true // Automatically parses the JSON string in the response
		};
		try {
			const result = await fetch(uri, options);
			const resBody = await this._handleInvalidBearerToken({ result });
			return resBody;
		} catch (e) {
			console.log('Network error -> ', e);
			return this._networkError();
		}
	},

	_networkError() {
		return {
			meta: {
				code: 598,
				message: 'Network error'
			}
		};
	},

	_generateRequestUri(path, query) {
		let result = config.api + path;
		if (query) {
			result += `?${this._objToQueryString(query)}`;
		}
		return result;
	},

	async _generateRequestHeaders() {
		const token = await AsyncStorage.getItem(AsyncStorageKeys.USER_AUTH_TOKEN);
		if (!token) {
			return {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			};
		}
		return {
			'Authorization': `Bearer ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		};
	}
};
