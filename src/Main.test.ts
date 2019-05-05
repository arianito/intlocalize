import {__} from "./Translate";
import {LocaleManager} from "./LocaleManager";
import {LANG_FA} from "./defaults/fa";
import {LANG_EN} from "./defaults/en";

test('test intlocalize', () => {


	LocaleManager.LoadLocale('en', LANG_EN);
	LocaleManager.LoadLocale('fa', LANG_FA);
	LocaleManager.Initalize('en');

	LocaleManager.LoadMessages({
		locale: 'fa',
		messages: {
			'@test:hello world': 'hello',
			'hello world': 'busted',
		},
	});
	expect(__('@test:hello world')).toEqual('hello world');
	expect(__('hello world')).toEqual('hello world');



	expect(__('{date, date, @relative}', {date: Date.now()})).toBe('')

});
