import { matchExpression } from './pseudoParser';

// noinspection SpellCheckingInspection
export class Intlocalize {
  private static currentLocale: string = 'en';
  private static fallbackLocale: string = 'en';
  private static localeData = {};
  private static localeMessages = {};

  static loadData(localeName, localeData) {
    this.localeData[localeName] = localeData;
  }

  static loadMessages(data: {
    locale: string;
    messages: { [key: string]: string };
  }) {
    this.localeMessages[data.locale] = data.messages;
  }

  static set locale(locale: string) {
    if (locale && Object.keys(this.localeData).includes(locale)) {
      this.currentLocale = locale;
    } else {
      this.currentLocale = this.fallbackLocale;
    }
  }

  static get locale() {
    return this.currentLocale;
  }

  static get isRtl() {
    return this.checkRtl(this.currentLocale);
  }

  static get currentData() {
    return this.localeData[this.currentLocale];
  }

  static getPluralKey(n) {
    const pls = this.currentData['plural'];
    for (const key of Object.keys(pls)) {
      if (matchExpression(key, n)) {
        return pls[key];
      }
    }
    return 'other';
  }

  static checkRtl(locale: string): boolean {
    return ['fa', 'ar', 'he', 'am'].includes(locale);
  }

  static simpleTranslate(data: string): string {
    let key = data;
    try {
      if (this.localeMessages[this.currentLocale][key]) {
        return this.localeMessages[this.currentLocale][key];
      }
    } catch (e) {
    }
    if (key.charAt(0) === '@') {
      const p = key.indexOf(':');
      if (p > -1) {
        key = key.substr(p + 1);
      }
    }
    return key;
  }
}
