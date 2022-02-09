import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AsyncStorage } from 'react-native';

import AsyncStorageKeys from './constants/AsyncStorageKeys';

const languageDetector = fallback => {
	return {
		type: 'languageDetector',
		async: true,
		init: () => { },
		detect: async callback => {
			const language = await AsyncStorage.getItem(AsyncStorageKeys.USER_LANGUAGE);
			callback(language || fallback);
		},
		cacheUserLanguage: async language => {
			if (language) {
				await AsyncStorage.setItem(AsyncStorageKeys.USER_LANGUAGE, language);
			}
		}
	};
};

i18n
	.use(languageDetector('en')) // custom plugin in detecting and setting language
	.use(initReactI18next); // passes i18n down to react-i18next
// .init({
// 	resources,
// 	// lng: 'en',
// 	keySeparator: false,
// 	interpolation: {
// 		escapeValue: false // react already safes from xss
// 	}
// });

export default i18n;
