import { is, htmlEscape } from '@toba/tools';
import {
   Attributes,
   Link,
   Person,
   Generator,
   Feed,
   Text,
   TextType,
   Entry,
   ISyndicate
} from './types';

/**
 * Write an XML tag or return empty string if entity content is empty.
 * @param name Name of entity attribute.
 * @param entity Entity containing named data.
 * @param attr Optional attributes to include in the tag.
 */
export function writeEntityTag<
   T extends Feed | Entry | Person,
   K extends keyof T
>(name: K, entity: T, attr?: Attributes): string {
   const content = entity[name];
   let text = '';

   if (is.value(content)) {
      text = is.date(content) ? content.toISOString() : content.toString();
   }
   return writeTag(name, text, attr);
}

/**
 * Write an XML tag or return empty string if content is empty.
 * @param name Name of entity attribute.
 * @param attr Optional attributes to include in the tag.
 */
export const writeTag = (
   name: string,
   value: string,
   attr?: Attributes
): string =>
   is.empty(value) ? '' : `<${name}${writeAttributes(attr)}>${value}</${name}>`;

/**
 * Write attribute key-value pair within XML tag.
 */
export const writeAttributes = (attr: Attributes): string =>
   is.value(attr)
      ? Array.from(attr.keys()).reduce(
           (pairs, key) => pairs + ` ${key}="${attr.get(key)}"`,
           ''
        )
      : '';

/**
 * @see https://tools.ietf.org/html/rfc4287#section-4.2.4
 * @example
 *  <generator uri="http://www.example.com/" version="1.0">
 *    Example Toolkit
 *  </generator>
 */
export function writeGenerator(g: Generator): string {
   if (is.value(g)) {
      g.generator = g.name;
      writeEntityTag('generator', g);
   }
   return '';
}

/**
 * @example <title type="text">AT&amp;T bought by SBC!</title>
 * @example
 * <title type="html">
 *    AT&amp;amp;T bought &amp;lt;b&amp;gt;by SBC&amp;lt;/b&amp;gt;!
 * </title>
 * @example
 * <title type="xhtml">
 *    <div xmlns="http://www.w3.org/1999/xhtml">
 *       AT&amp;T bought <b>by SBC</b>!
 *    </div>
 * </title>
 *
 * @see https://validator.w3.org/feed/docs/atom.html#text
 */
export function writeTextTag<T extends Feed | Entry, K extends keyof T>(
   name: K,
   entity: T
): string {
   const content = entity[name];
   const attr: Map<string, string> = new Map();
   let value = '';

   if (is.value(content)) {
      let type: TextType;

      if (is.text(content)) {
         type = TextType.Plain;
         value = content;
      } else if (is.value<Text>(content)) {
         type = content.type;
         value = htmlEscape(content.value);
      }
      attr.set('type', type);
   }
   return writeTag(name, value, attr);
}

export const render = (source: ISyndicate<Feed>): string =>
   write(source.rssJSON());

/**
 * Entry-point for writing Atom feed XML.
 *
 * @see https://tools.ietf.org/html/rfc4287
 */
export const write = (feed: Feed): string =>
   '<?xml version="1.0" encoding="utf-8"?>' +
   '<feed xmlns="http://www.w3.org/2005/Atom">' +
   writeEntityTag('id', feed) +
   writeEntityTag('title', feed) +
   writeEntityTag('subtitle', feed) +
   writeEntityTag('rights', feed) +
   writePerson('author', feed.author) +
   writeGenerator(feed.generator) +
   feed.entry.forEach(writeEntry) +
   '</feed>';

export const writeEntry = (entry: Entry): string =>
   '<entry>' +
   writeEntityTag('id', entry) +
   writeTextTag('title', entry) +
   writeEntityTag('updated', entry) +
   writeEntityTag('published', entry) +
   writePerson('author', entry.author) +
   writePerson('contributor', entry.contributor) +
   writeTextTag('rights', entry) +
   writeTextTag('content', entry) +
   '</entry>';

export const writeLink = (link: Link | Link[]): string =>
   is.array<Link>(link)
      ? link.reduce((list, l) => list + writeLink(l), '')
      : `<link href="${link.href}"` +
        (is.value(link.rel) ? ` rel="${link.rel}"` : '') +
        (is.value(link.type) ? ` type="${link.type}"` : '') +
        (is.value(link.length) ? ` length="${link.length}"` : '') +
        '/>';

/**
 * @see https://tools.ietf.org/html/rfc4287#page-10
 * @example
 *  <author>
 *    <name>Mark Pilgrim</name>
 *    <uri>http://example.org/</uri>
 *    <email>f8dy@example.com</email>
 *  </author>
 *  <contributor>
 *    <name>Sam Ruby</name>
 *  </contributor>
 */
export const writePerson = (
   tag: 'author' | 'contributor',
   person: Person | Person[]
): string =>
   is.array<Person>(person)
      ? person.reduce((list, p) => list + writePerson(tag, p), '')
      : `<${tag}>` +
        writeEntityTag('name', person) +
        writeEntityTag('uri', person) +
        writeEntityTag('email', person) +
        `</${tag}>`;
