import { pluralFormatter } from './pluralFormatter';
import { numberFormatter } from './numberFormatter';
import { dateFormatter } from './dateFormatter';
import { selectFormatter } from './selectFormatter';
import { prefixFormatter } from './prefixFormatter';
import { ellipsisFormatter } from './ellipsisFormatter';

export const formatterBucket = {
  plural: pluralFormatter,
  number: numberFormatter,
  date: dateFormatter,
  select: selectFormatter,
  prefix: prefixFormatter,
  ellipsis: ellipsisFormatter,
};
