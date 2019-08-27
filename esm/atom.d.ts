import { Attributes, Link, Person, Generator, Feed, Entry, ISyndicate } from './types';
/**
 * Write an XML tag or return empty string if entity content is empty.
 * @param name Name of entity attribute.
 * @param entity Entity containing named data.
 * @param attr Optional attributes to include in the tag.
 */
export declare function writeEntityTag<T extends Feed | Entry | Person, K extends keyof T>(name: K, entity: T, attr?: Attributes): string;
/**
 * Write an XML tag or return empty string if content is empty.
 * @param name Name of entity attribute.
 * @param attr Optional attributes to include in the tag.
 */
export declare const writeTag: (name: string, value: string, attr?: Map<string, string> | undefined) => string;
/**
 * Write attribute key-value pair within XML tag.
 */
export declare const writeAttributes: (attr?: Map<string, string> | undefined) => string;
/**
 * @see https://tools.ietf.org/html/rfc4287#section-4.2.4
 * @example
 *  <generator uri="http://www.example.com/" version="1.0">
 *    Example Toolkit
 *  </generator>
 */
export declare function writeGenerator(g?: Generator): string;
/**
 * Write tag with attribute for content type.
 *
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
export declare function writeTextTag<T extends Feed | Entry, K extends keyof T>(name: K, entity: T): string;
/**
 * Render XML text for class that implements `ISyndicate`.
 */
export declare const render: (source: ISyndicate<Feed>) => string;
/**
 * Entry-point for writing Atom feed XML.
 *
 * @see https://tools.ietf.org/html/rfc4287
 */
export declare const write: (feed: Feed) => string;
export declare const writeEntry: (entry: Entry, feedAuthor?: Person | Person[] | null) => string;
/**
 * Write link text.
 */
export declare const writeLink: (link: string | Link | (string | Link)[]) => string;
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
export declare const writePerson: (tag: "author" | "contributor", person?: Person | Person[] | undefined) => string;
