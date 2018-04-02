interface XmlAttrs {
   [attr: string]: string;
}
interface XmlDescArray {
   [index: number]: { _attr: XmlAttrs } | XmlObject;
}
interface ElementObject {
   push(xmlObject: XmlObject): void;
   close(xmlObject?: XmlObject): void;
}
type XmlAtom = string | number | boolean;

export type XmlDesc =
   | { _attr: XmlAttrs }
   | { _cdata: string }
   | { _attr: XmlAttrs; _cdata: string }
   | XmlAtom
   | XmlAtom[]
   | XmlDescArray;

export type XmlObject = { [tag: string]: ElementObject | XmlDesc } | XmlDesc;
