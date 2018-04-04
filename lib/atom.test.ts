import { MimeType, LinkRelation } from '@toba/tools';
import { writeTag, writeAttributes, writePerson, writeLink } from './atom';
import { Link } from './types';

test('writes basic tags', () => {
   const now = new Date();
   const thing1 = { tag: 'content', ignore: 'stuff' };
   const thing2 = { when: now };
   expect(writeTag('tag', thing1)).toBe('<tag>content</tag>');
   expect(writeTag('when', thing2)).toBe(`<when>${now.toISOString()}</when>`);
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

   expect(writePerson('author', person1)).toBe(expect1);
   expect(writePerson('author', person2)).toBe(expect2);
   expect(writePerson('author', [person1, person2])).toBe(expect1 + expect2);
});

test('writes link', () => {
   const href = 'http://www.test.com';
   const link1: Link = {
      href,
      rel: LinkRelation.Alternate
   };
   const link2: Link = {
      href,
      type: MimeType.Atom,
      rel: LinkRelation.Enclosure
   };
   const expect1 = `<link href="${href}" rel="alternate"/>`;
   const expect2 = `<link href="${href}" rel="enclosure" type="application/atom+xml"/>`;

   expect(writeLink(link1)).toBe(expect1);
   expect(writeLink(link2)).toBe(expect2);
   expect(writeLink([link1, link2])).toBe(expect1 + expect2);
});
