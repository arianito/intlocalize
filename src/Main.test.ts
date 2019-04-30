import {__} from "./Translate";
import {LocaleManager} from "./LocaleManager";
import {LANG_EN, LANG_FA} from "./defaults";

test('test intlocalize', () => {


	LocaleManager.LoadLocale('en', LANG_EN);
	LocaleManager.LoadLocale('fa', LANG_FA);
	LocaleManager.Initalize('fa');

	LocaleManager.LoadMessages({
		locale: 'fa',
		messages: {
			'@test:hello world': 'hello',
			'hello world': 'busted',
		},
	});
	expect(__('@test:hello world')).toEqual('hello');
	expect(__('hello world')).toEqual('busted');

});
