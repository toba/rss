import { MimeType } from '@toba/tools';
import { writeTag, writeAttributes, Atom, LinkRelation } from './atom';

test('writes basic tags', () => {
   expect(writeTag('tag', 'content')).toBe('<tag>content</tag>');
});

test('writes attribute key-values', () => {
   expect(writeAttributes({ key1: 'value1', key2: 'value2' })).toBe(
      ' key1="value1" key2="value2"'
   );

   expect(writeAttributes(null)).toBe('');
});

test('writes person', () => {
   const person1 = { name: 'Person' };
   const person2 = { name: 'Bob', email: 'bob@test.com' };
   const expect1 = '<author><name>Person</name></author>';
   const expect2 =
      '<author><name>Bob</name><email>bob@test.com</email></author>';

   expect(Atom.writePerson('author', person1)).toBe(expect1);
   expect(Atom.writePerson('author', person2)).toBe(expect2);
   expect(Atom.writePerson('author', [person1, person2])).toBe(
      expect1 + expect2
   );
});

test('writes link', () => {
   const link1 = { href: 'http://www.test.com', rel: LinkRelation.Alternate };
   const link2 = {
      href: 'http://www.test.com',
      type: MimeType.Atom,
      rel: LinkRelation.Enclosre
   };
   const expect1 = '<link href="http://www.test.com" rel="alternate"/>';
   const expect2 =
      '<link href="http://www.test.com" rel="enclosure" type="application/atom+xml"/>';

   expect(Atom.writeLink(link1)).toBe(expect1);
   expect(Atom.writeLink(link2)).toBe(expect2);
   expect(Atom.writeLink([link1, link2])).toBe(expect1 + expect2);
});
