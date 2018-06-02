import { MimeType, LinkRelation } from '@toba/tools';

/**
 * Class can be rendered as an RSS/Atom feed.
 */
export interface ISyndicate<T extends Feed | Entry> {
   rssJSON(): T;
}

export type Attributes = Map<string, string>;
export type AtomEntity = Map<string, string | Date>;

/**
 * @see https://validator.w3.org/feed/docs/atom.html#link
 */
export interface Link {
   [index: string]: string | LinkRelation | MimeType | number;
   /** URI of the referenced resource (typically a Web page). */
   href: string;
   /** Relation defaults to `alternate` if not specified. */
   rel?: LinkRelation;
   /**
    * Human readable information about the link, typically for display purposes.
    */
   title?: string;
   type?: MimeType;
   /** Language of the referenced resource. */
   hreflang?: string;
   /** Size in bytes */
   length?: number;
}

/**
 * @see https://validator.w3.org/feed/docs/atom.html#person
 */
export interface Person {
   name: string;
   email?: string;
   uri?: string;
}

export enum TextType {
   Plain = 'text',
   HTML = 'html',
   XHTML = 'xhtml'
}

/**
 * Human-readable text, usually in small quantities. The `type` attribute
 * determines how this information is encoded.
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
export interface Text {
   value: string;
   type?: TextType;
}

/**
 * Category that a feed belongs to.
 */
export interface Category {
   /** Category name. */
   term: string;
   /** Categorization scheme URI. */
   scheme?: string;
   /** Human readable label. */
   label?: string;
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
 *
 * @see https://validator.w3.org/feed/docs/atom.html#requiredFeedElements
 */
export interface Feed {
   /**
    * Identifies the feed using a universally unique and permanent URI. If you
    * have a long-term, renewable lease on your Internet domain name, then you
    * can feel free to use your website's address.
    *
    * @example <id>http://example.com/</id>
    */
   id: string;

   /**
    * Contains a human readable title for the feed. Often the same as the title
    * of the associated website. This value should not be blank.
    *
    * @example <title>Example, Inc.</title>
    */
   title: string | Text;
   subtitle: string;

   /**
    * Indicates the last time the feed was modified in a significant way.
    *
    * @example <updated>2003-12-13T18:30:02Z</updated>
    */
   updated: Date;

   /**
    * Names one author of the feed. A feed may have multiple author elements. A
    * feed must contain at least one author element unless all of the entry
    * elements contain at least one author element.
    *
    * @example
    * <author>
    *    <name>John Doe</name>
    *    <email>JohnDoe@example.com</email>
    *    <uri>http://example.com/~johndoe</uri>
    * </author>
    */
   author: Person | Person[];

   /**
    * Names one contributor to the feed. A feed may have multiple contributor
    * elements.
    */
   contributor: Person | Person[];

   /**
    * Identifies a related Web page. The type of relation is defined by the
    * `rel` attribute. A feed is limited to one alternate per type and hreflang.
    * A feed should contain a link back to the feed itself.
    */
   link: string | Link;

   /**
    * Identifies a small image which provides iconic visual identification for
    * the feed. Icons should be square.
    *
    * @example <icon>/icon.jpg</icon>
    */
   icon?: string;

   /**
    * Identifies a larger image which provides visual identification for the
    * feed. Images should be twice as wide as they are tall.
    *
    * @example <logo>/logo.jpg</logo>
    */
   logo?: string;

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

   /**
    * Conveys information about rights, e.g. copyrights, held in and over the
    * feed.
    *
    * @see https://validator.w3.org/feed/docs/atom.html#text
    */
   rights?: string | Text;

   /**
    * Identifies the software used to generate the feed, for debugging and other
    * purposes.
    *
    * @example
    * <generator uri="/myblog.php" version="1.0">
    *    Example Toolkit
    * </generator>
    */
   generator?: Generator;

   /**
    * Specifies a category that the feed belongs to. A feed may have multiple
    * category elements.
    *
    * @example <category term="sports"/>
    */
   category?: Category | Category[];
}

/**
 * The `atom:entry` element represents an individual entry, acting as a
 * container for metadata and data associated with the entry.  This
 * element can appear as a child of the `atom:feed` element, or it can
 * appear as the document (i.e., top-level) element of a stand-alone
 * Atom Entry Document.
 *
 * @see https://validator.w3.org/feed/docs/atom.html#requiredEntryElements
 */
export interface Entry {
   /**
    * Identifies the entry using a universally unique and permanent URI. Two
    * entries in a feed can have the same value for id if they represent the
    * same entry at different points in time.
    *
    * @example <id>http://example.com/blog/1234</id>
    */
   id: string;

   /**
    * Contains a human readable title for the entry. This value should not be
    * blank.
    *
    * @example <title>Atom-Powered Robots Run Amok</title>
    */
   title: string | Text;

   /**
    * Identifies a related Web page. The type of relation is defined by the
    * `rel` attribute. An entry is limited to one alternate per `type` and
    * `hreflang`. An entry must contain an alternate link if there is no
    * `content` element.
    *
    * Link `rel` will default to `alternate` if only a URL string is provided.
    * Link objects must therefore be used if assigning multiple links.
    *
    * @example <link rel="alternate" href="/blog/1234"/>
    */
   link: Link | Link[] | string;

   /**
    * Contains the time of the initial creation or first availability of the
    * entry.
    *
    * ISO-8601 value (`toISOString()` standard)
    *
    * @example <published>2003-12-13T09:17:51-08:00</published>
    */
   published: Date;

   /**
    * Indicates the last time the entry was modified in a significant way. This
    * value need not change after a typo is fixed, only after a substantial
    * modification. Generally, different entries in a feed will have different
    * updated timestamps.
    *
    * ISO-8601 value (`toISOString()` standard)
    *
    * @example <updated>2003-12-13T18:30:02-05:00</updated>
    */
   updated: Date;

   /**
    * Conveys a short summary, abstract, or excerpt of the entry. Summary should
    * be provided if there either is no content provided for the entry, or that
    * content is not inline (i.e., contains a `src` attribute), or if the
    * content is encoded in base64
    *
    * @example <summary>Some text.</summary>
    */
   summary: string | Text;

   /**
    * Conveys information about rights, e.g. copyrights, held in and over the
    * entry.
    *
    * @example
    * <rights type="html">
    *    &amp;copy; 2005 John Doe
    * </rights>
    */
   rights?: string | Text;

   /**
    * Specifies a category that the entry belongs to. An entry may have multiple
    * category elements.
    */
   category?: Category | Category[];

   /**
    * Names one author of the entry. An entry may have multiple authors. An
    * entry must contain at least one author element unless there is an author
    * element in the enclosing feed, or there is an author element in the
    * enclosed source element.
    *
    * @example
    * <author>
    *    <name>John Doe</name>
    * </author>
    */
   author?: Person | Person[];
   contributor?: Person | Person[];

   /**
    * Contains or links to the complete content of the entry. Content must be
    * provided if there is no alternate link, and should be provided if there is
    * no summary.
    *
    * @example <content>complete story here</content>
    * @see https://validator.w3.org/feed/docs/atom.html#content
    */
   content: string | Text;

   /**
    * Contains metadata from the source feed if this entry is a copy.
    *
    * @example
    * <source>
    *    <id>http://example.org/</id>
    *    <title>Example, Inc.</title>
    *    <updated>2003-12-13T18:30:02Z</updated>
    * </source>
    */
   source?: string;
}
