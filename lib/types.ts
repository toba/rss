import { MimeType, LinkRelation } from '@toba/tools';

export interface ISyndicate {
   feedJSON(): Feed;
}

//export type Attributes = { [key: string]: string };
export type Attributes = Map<string, string>;

//export type AtomEntity = { [key: string]: string | Date };
export type AtomEntity = Map<string, string | Date>;

export interface Link {
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

/**
 * Software that generated the feed.
 */
export interface Generator {
   [index: string]: string;
   name: string;
   generator?: string;
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
