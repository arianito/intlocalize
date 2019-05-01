import {extractData, keys, locales} from "./Loader";

test('loader to load files correctly', () =>{
  extractData(`
  
		LocaleManager.LoadLocale('en', LANG_EN);
		LocaleManager.LoadLocale('fa', LANG_FA);
		
		__('{0}')
		__('{name}')
		__('@test:boy')
		__('@test:joy of night')
  `);

  	let messages = {};
	locales.forEach(lc => {
		messages = keys.reduce((output, key: string) => {
			const index = key.indexOf(':') + 1;
			return Object.assign(output, {
				[key]: messages[key] || key.substring(index) || '',
			})
		}, {});
	});

	console.log(messages);
});
