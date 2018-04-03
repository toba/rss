import { is } from '@toba/tools';

export type Attributes = { [key: string]: string };

export function writeTag(name: string, content: string, attr?: Attributes) {
   return `<${name}${writeAttributes(attr)}>${content}</${name}>`;
}

export const writeAttributes = (attr: Attributes): string =>
   is.value(attr)
      ? Object.keys(attr).reduce(
           (pairs, key) => pairs + ` ${key}="${attr[key]}"`,
           ''
        )
      : '';
