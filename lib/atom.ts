import { is } from '@toba/tools';
import {
   Attributes,
   Link,
   Person,
   Generator,
   Feed,
   Entry,
   ISyndicate
} from './types';

/**
 * Write an XML tag.
 * @param name Name of entity attribute.
 * @param entity Entity containing named data.
 * @param attr Optional attributes to include in the tag.
 */
export function writeTag<T, K extends keyof T>(
   name: K,
   entity: T,
   attr?: Attributes
): string {
   const content = entity[name];

   if (is.value(content)) {
      const text = is.date(content)
         ? content.toISOString()
         : content.toString();

      return `<${name}${writeAttributes(attr)}>${text}</${name}>`;
   } else {
      return '';
   }
}

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
      writeTag('generator', g);
   }
   return '';
}

export const render = (source: ISyndicate): string => write(source.feedJSON());

/**
 * Entry-point for writing Atom feed XML.
 *
 * @see https://tools.ietf.org/html/rfc4287
 */
export const write = (feed: Feed): string =>
   '<?xml version="1.0" encoding="utf-8"?>' +
   '<feed xmlns="http://www.w3.org/2005/Atom">' +
   writeTag('id', feed) +
   writeTag('title', feed) +
   writeTag('subtitle', feed) +
   writeTag('rights', feed) +
   writePerson('author', feed.author) +
   writeGenerator(feed.generator) +
   feed.entry.forEach(writeEntry) +
   '</feed>';

export const writeEntry = (entry: Entry): string =>
   '<entry>' +
   writeTag('id', entry) +
   writeTag('title', entry) +
   writeTag('updated', entry) +
   writeTag('published', entry) +
   writePerson('author', entry.author) +
   writePerson('contributor', entry.contributor) +
   writeTag('content', entry) +
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
        writeTag('name', person) +
        writeTag('uri', person) +
        writeTag('email', person) +
        `</${tag}>`;
