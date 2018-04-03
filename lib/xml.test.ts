import { writeTag, writeAttributes } from './xml';

test('writes basic tags', () => {
   expect(writeTag('tag', 'content')).toBe('<tag>content</tag>');
});

test('writes attribute key-values', () => {
   expect(writeAttributes({ key1: 'value1', key2: 'value2' })).toBe(
      ' key1="value1" key2="value2"'
   );

   expect(writeAttributes(null)).toBe('');
});
