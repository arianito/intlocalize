import {LocaleManager} from "./LocaleManager";
import {LANG_EN, LANG_FA} from "./defaults";
import {__} from "./Translate";

test('test currency formatter', function() {

	LocaleManager.LoadLocale('en', LANG_EN);
	LocaleManager.LoadLocale('fa', LANG_FA);
	LocaleManager.Initalize('en');

	const value = 10000.234;
	expect(__('{0, number, @currency}', value)).toEqual('10,000.23 USD');
	expect(__('{0, number, @currency @shrink}', 6922)).toEqual('6,922 USD');
	expect(__('{0, number, @currency @shrink}', 6922786)).toEqual('6,922.79 G');
	expect(__('{0, number, @currency @shrink}', 6922786002)).toEqual('6,922.79 M');



});
