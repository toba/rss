import { is } from '@toba/tools';

export type Attributes = { [key: string]: string };

export type AtomEntity = { [key: string]: string | Date };

export enum LinkRelation {
   Alternate = 'alternate',
   Enclosre = 'enclosure',
   Self = 'self'
}

export function writeTag<T, K extends keyof T>(
   name: K,
   entity: T,
   attr?: Attributes
) {
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

export const writeAttributes = (attr: Attributes): string =>
   is.value(attr)
      ? Object.keys(attr).reduce(
           (pairs, key) => pairs + ` ${key}="${attr[key]}"`,
           ''
        )
      : '';

export namespace Atom {
   interface Link {
      href: string;
      rel?: LinkRelation;
      type?: MimeType;
      /** Size in bytes */
      length?: number;
   }

   export interface Person {
      name: string;
      email?: string;
      uri?: string;
   }

   export interface Generator {
      [index: string]: string;
      name: string;
      uri?: string;
      version?: string;
   }

   /**
    * An Atom Feed Document is a representation of an Atom feed, including
    * metadata about the feed, and some or all of the entries associated
    * with it.  Its root is the `atom:feed` element.
    *
    * Note that there MUST NOT be any white space in a Date construct or in
    * any IRI.
    */
   export interface Feed {
      id: string;
      title: string;
      subtitle: string;
      author: Person | Person[];
      link: Link;

      /**
       * If multiple `atom:entry` elements with the same `atom:id` value appear in
       * an Atom Feed Document, they represent the same entry.  Their
       * atom:updated timestamps SHOULD be different.  If an Atom Feed
       * Document contains multiple entries with the same `atom:id`, Atom
       * Processors MAY choose to display all of them or some subset of them.
       * One typical behavior would be to display only the entry with the
       * latest atom:updated timestamp.
       */
      entry: Entry[];

      rights?: string;

      /**
       * Program that generated the feed.
       */
      generator?: Generator;
   }

   /**
    * The `atom:entry` element represents an individual entry, acting as a
    * container for metadata and data associated with the entry.  This
    * element can appear as a child of the `atom:feed` element, or it can
    * appear as the document (i.e., top-level) element of a stand-alone
    * Atom Entry Document.
    */
   export interface Entry {
      id: string;
      title: string;
      link: Link | Link[];

      /**
       * ISO-8601 value (`toISOString()` standard)
       */
      published: Date;

      /**
       * ISO-8601 value (`toISOString()` standard)
       */
      updated: Date;

      summary: string;
      rights?: string;
      category?: string | string[];
      /**
       * Author may be omitted if the `atom:feed` specifies an author.
       */
      author?: Person | Person[];
      contributor: Person | Person[];

      /** Either contents or links to the content of the entry */
      content: string;
   }

   function writeGenerator(g: Generator): string {
      if (is.value(g)) {
         const name = g.name;
         delete g.name;
         writeTag('generator', name, g);
      }
      return '';
   }

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

   export const writePerson = (
      tag: 'author' | 'contributor',
      person: Atom.Person | Atom.Person[]
   ): string =>
      is.array<Person>(person)
         ? person.reduce((list, p) => list + writePerson(tag, p), '')
         : `<${tag}>` +
           writeTag('name', person) +
           writeTag('uri', person) +
           writeTag('email', person) +
           `</${tag}>`;
}
