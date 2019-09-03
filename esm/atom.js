import { is, htmlEscape } from '@toba/tools';
/**
 * Write an XML tag or return empty string if entity content is empty.
 * @param name Name of entity attribute.
 * @param entity Entity containing named data.
 * @param attr Optional attributes to include in the tag.
 */
export function writeEntityTag(name, entity, attr) {
    const content = entity[name];
    let text = '';
    if (is.value(content)) {
        text = is.date(content)
            ? content.toISOString()
            : content.toString();
    }
    return writeTag(name, text, attr);
}
/**
 * Write an XML tag or return empty string if content is empty.
 * @param name Name of entity attribute.
 * @param attr Optional attributes to include in the tag.
 */
export const writeTag = (name, value, attr) => is.empty(value)
    ? ''
    : `<${name}${writeAttributes(attr)}>${htmlEscape(value)}</${name}>`;
/**
 * Write attribute key-value pair within XML tag.
 */
export const writeAttributes = (attr) => is.value(attr)
    ? Array.from(attr.keys()).reduce((pairs, key) => pairs + ` ${key}="${attr.get(key)}"`, '')
    : '';
/**
 * @see https://tools.ietf.org/html/rfc4287#section-4.2.4
 * @example
 *  <generator uri="http://www.example.com/" version="1.0">
 *    Example Toolkit
 *  </generator>
 */
export function writeGenerator(g) {
    if (is.value(g)) {
        g.generator = g.name;
        writeEntityTag('generator', g);
    }
    return '';
}
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
export function writeTextTag(name, entity) {
    const content = entity[name];
    const attr = new Map();
    let value = '';
    if (is.value(content)) {
        let type;
        if (is.text(content)) {
            type = "text" /* Plain */;
            value = content;
        }
        else if (is.value(content)) {
            type = content.type;
            value = content.value;
        }
        if (is.value(type)) {
            attr.set('type', type);
        }
    }
    return writeTag(name, value, attr);
}
/**
 * Render XML text for class that implements `ISyndicate`.
 */
export const render = (source) => write(source.rssJSON());
/**
 * Entry-point for writing Atom feed XML.
 *
 * @see https://tools.ietf.org/html/rfc4287
 */
export const write = (feed) => '<?xml version="1.0" encoding="utf-8"?>' +
    '<feed xmlns="http://www.w3.org/2005/Atom">' +
    writeEntityTag('id', feed) +
    writeEntityTag('title', feed) +
    writeEntityTag('subtitle', feed) +
    writeEntityTag('rights', feed) +
    writePerson('author', feed.author) +
    writeGenerator(feed.generator) +
    feed.entry.map(e => writeEntry(e, feed.author)).join('') +
    '</feed>';
export const writeEntry = (entry, feedAuthor = null) => '<entry>' +
    writeEntityTag('id', entry) +
    writeTextTag('title', entry) +
    writeEntityTag('updated', entry) +
    writeEntityTag('published', entry) +
    (feedAuthor == entry.author ? '' : writePerson('author', entry.author)) +
    writePerson('contributor', entry.contributor) +
    writeTextTag('rights', entry) +
    writeTextTag('content', entry) +
    writeTextTag('summary', entry) +
    '</entry>';
/**
 * Write link text.
 */
export const writeLink = (link) => is.array(link)
    ? link.reduce((list, l) => list + writeLink(l), '')
    : is.text(link)
        ? writeLink({ href: link, rel: "alternate" /* Alternate */ })
        : `<link${Object.keys(link)
            .sort()
            .reduce((attr, key) => {
            const value = link[key];
            return attr + (is.value(value) ? ` ${key}="${value}"` : '');
        }, '')}/>`;
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
export const writePerson = (tag, person) => is.array(person)
    ? person.reduce((list, p) => list + writePerson(tag, p), '')
    : is.value(person)
        ? `<${tag}>` +
            writeEntityTag('name', person) +
            writeEntityTag('uri', person) +
            writeEntityTag('email', person) +
            `</${tag}>`
        : '';
