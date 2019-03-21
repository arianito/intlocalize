import {ReplaceString} from "./functions";
import {LocaleManager} from "./LocaleManager";
import {ENG_TO_AR, ENG_TO_FA, FA_TO_ENG} from "./defaults";



export function ConvertNumbers(str, lang = LocaleManager.CurrentLocale) {
	if (lang === 'fa') {

		Object.keys(ENG_TO_FA).forEach(function (key) {
			str = ReplaceString(str, key, ENG_TO_FA[key])
		});
		return str
	} else if (lang === 'ar') {
		Object.keys(ENG_TO_AR).forEach(function (key) {
			str = ReplaceString(str, key, ENG_TO_AR[key])
		});
		return str
	} else {
		Object.keys(FA_TO_ENG).forEach(function (key) {
			str = ReplaceString(str, key, FA_TO_ENG[key])
		});
		return str
	}
}