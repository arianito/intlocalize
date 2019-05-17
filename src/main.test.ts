import { __ } from './translate';
import { Intlocalize } from './Intlocalize';
import { LANG_FA } from './defaults/fa';
import { LANG_EN } from './defaults/en';

test('test intlocalize', () => {
  Intlocalize.loadData('en', LANG_EN);
  Intlocalize.loadData('fa', LANG_FA);
  Intlocalize.locale = 'en';

  Intlocalize.loadMessages({
    locale: 'fa',
    messages: {
      '@test:hello world': 'hello',
      'hello world': 'busted',
    },
  });
  expect(__('@test:hello world')).toEqual('hello world');
  expect(__('hello world')).toEqual('hello world');

  expect(__('{date, date, @relative}', { date: Date.now() })).toBe('1 seconds ago');
});
