import { Intlocalize } from './Intlocalize';
import { LANG_EN } from './defaults/en';
import { LANG_FA } from './defaults/fa';
import { __ } from './translate';

test('test currency formatter', () => {

  Intlocalize.loadData('en', LANG_EN);
  Intlocalize.loadData('fa', LANG_FA);
  Intlocalize.locale = 'en';

  const value = 10000.234;
  expect(__('{0, number, @currency}', value)).toEqual('10,000.23 USD');
  expect(__('{0, number, @currency @shrink}', 6922)).toEqual('6,922 USD');
  expect(__('{0, number, @currency @shrink}', 6922786)).toEqual('6,922.79 G');
  expect(__('{0, number, @currency @shrink}', 6922786002)).toEqual('6,922.79 M');
  expect(__('{0, number, @currency @shrink}', {
    0: 1231231123122312312312,
    currency: 'IRR',
  })).toEqual('123,123,112,312.2 میلیارد تومان');
});
