"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("@toba/tools");
function writeEntityTag(name, entity, attr) {
    const content = entity[name];
    let text = '';
    if (tools_1.is.value(content)) {
        text = tools_1.is.date(content)
            ? content.toISOString()
            : content.toString();
    }
    return exports.writeTag(name, text, attr);
}
exports.writeEntityTag = writeEntityTag;
exports.writeTag = (name, value, attr) => tools_1.is.empty(value)
    ? ''
    : `<${name}${exports.writeAttributes(attr)}>${tools_1.htmlEscape(value)}</${name}>`;
exports.writeAttributes = (attr) => tools_1.is.value(attr)
    ? Array.from(attr.keys()).reduce((pairs, key) => pairs + ` ${key}="${attr.get(key)}"`, '')
    : '';
function writeGenerator(g) {
    if (tools_1.is.value(g)) {
        g.generator = g.name;
        writeEntityTag('generator', g);
    }
    return '';
}
exports.writeGenerator = writeGenerator;
function writeTextTag(name, entity) {
    const content = entity[name];
    const attr = new Map();
    let value = '';
    if (tools_1.is.value(content)) {
        let type;
        if (tools_1.is.text(content)) {
            type = "text";
            value = content;
        }
        else if (tools_1.is.value(content)) {
            type = content.type;
            value = content.value;
        }
        if (tools_1.is.value(type)) {
            attr.set('type', type);
        }
    }
    return exports.writeTag(name, value, attr);
}
exports.writeTextTag = writeTextTag;
exports.render = (source) => exports.write(source.rssJSON());
exports.write = (feed) => '<?xml version="1.0" encoding="utf-8"?>' +
    '<feed xmlns="http://www.w3.org/2005/Atom">' +
    writeEntityTag('id', feed) +
    writeEntityTag('title', feed) +
    writeEntityTag('subtitle', feed) +
    writeEntityTag('rights', feed) +
    exports.writePerson('author', feed.author) +
    writeGenerator(feed.generator) +
    feed.entry.map(e => exports.writeEntry(e, feed.author)).join('') +
    '</feed>';
exports.writeEntry = (entry, feedAuthor = null) => '<entry>' +
    writeEntityTag('id', entry) +
    writeTextTag('title', entry) +
    writeEntityTag('updated', entry) +
    writeEntityTag('published', entry) +
    (feedAuthor == entry.author ? '' : exports.writePerson('author', entry.author)) +
    exports.writePerson('contributor', entry.contributor) +
    writeTextTag('rights', entry) +
    writeTextTag('content', entry) +
    writeTextTag('summary', entry) +
    '</entry>';
exports.writeLink = (link) => tools_1.is.array(link)
    ? link.reduce((list, l) => list + exports.writeLink(l), '')
    : tools_1.is.text(link)
        ? exports.writeLink({ href: link, rel: "alternate" })
        : `<link${Object.keys(link)
            .sort()
            .reduce((attr, key) => {
            const value = link[key];
            return attr + (tools_1.is.value(value) ? ` ${key}="${value}"` : '');
        }, '')}/>`;
exports.writePerson = (tag, person) => tools_1.is.array(person)
    ? person.reduce((list, p) => list + exports.writePerson(tag, p), '')
    : tools_1.is.value(person)
        ? `<${tag}>` +
            writeEntityTag('name', person) +
            writeEntityTag('uri', person) +
            writeEntityTag('email', person) +
            `</${tag}>`
        : '';
