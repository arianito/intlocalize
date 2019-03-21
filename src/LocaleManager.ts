import {MatchExpression} from "./PseudoParser";

export class LocaleManager {
	private static _CurrentLocale: string = 'en';
	private static _fallback: string = 'en';
	private static _locales = {};
	private static _messages = {};

	static Initalize(locale: string){
		this.CurrentLocale = locale;
	}

	static LoadLocale(localeName, localeData){
		this._locales[localeName] = localeData;
	}

	static LoadMessages(data : {
		locale: string, messages: {[key:string]: string}
	}){
		this._messages[data.locale] = data.messages;
	}

	static set CurrentLocale(locale: string) {
		if (locale && Object.keys(this._locales).includes(locale)) {
			this._CurrentLocale = locale
		} else {
			this._CurrentLocale = this._fallback
		}
	}

	static get CurrentLocale() {
		return this._CurrentLocale;
	}

	static get IsRtl() {
		return this.CheckRtl(this._CurrentLocale);
	}

	static get CurrentLocaleConfig() {
		return this._locales[this._CurrentLocale];
	}


	static GetPluralKey(n) {
		const pls = this.CurrentLocaleConfig['plural'];
		for (let key of Object.keys(pls)) {
			if (MatchExpression(key, n)) {
				return pls[key]
			}
		}
		return 'other'
	}
	static CheckRtl(locale: string): boolean {
		return ['fa', 'ar', 'he', 'am'].includes(locale)
	}

	static SimpleTranslate(key: string): string {
		try {
			if (this._messages[this._CurrentLocale][key]) {
				return this._messages[this._CurrentLocale][key]
			}
		} catch (e) {
		}
		if (key.charAt(0) == '@') {
			const p = key.indexOf(':');
			if (p > -1) {
				key = key.substr(p + 1)
			}
		}
		return key
	}
}
