import { MimeType } from '@toba/tools';

export namespace RSS {
   /**
    * http://cyber.harvard.edu/rss/rss.html#ltimagegtSubelementOfLtchannelgt
    */
   export interface Image {
      /**
       *  URL of a GIF, JPEG or PNG image that represents the channel.
       */
      url: string;
      /**
       * Describes the image; used in the `ALT` attribute of the HTML `<img>`
       * tag when the channel is rendered in HTML.
       */
      title: string;

      /**
       * URL of the site, when the channel is rendered, the image is a link to the
       * site. (Note, in practice the image <title> and <link> should have the same
       * value as the channel's <title> and <link>.
       */
      link: string;

      /**
       * Text that is included in the TITLE attribute of the link formed around the
       * image in the HTML rendering.
       */
      description?: string;

      width?: number;
      height?: number;
   }

   /**
    * @example
    * <enclosure
    *    url="http://www.scripting.com/mp3s/weatherReportSuite.mp3"
    *    length="12216320"
    *    type="audio/mpeg" />
    */
   export interface Enclosure {
      url: string;
      /**
       * Size of item in bytes.
       */
      length: number;
      type: MimeType;
   }

   /**
    * http://cyber.harvard.edu/rss/rss.html
    *
    * @example http://cyber.harvard.edu/rss/examples/rss2sample.xml
    */
   export interface Channel {
      /**
       * The name of the channel. It's how people refer to your service. If you
       * have an HTML website that contains the same information as your RSS file,
       * the title of your channel should be the same as the title of your website.
       */
      title: string;

      /**
       * The URL to the HTML website corresponding to the channel.
       */
      link: string;

      /**
       * Phrase or sentence describing the channel.
       */
      description: string;

      /**
       * The language the channel is written in. This allows aggregators to group
       * all Italian language sites, for example, on a single page. A list of
       * allowable values for this element, as provided by Netscape, is here. You
       * may also use values defined by the W3C.
       */
      language?: string;

      /**
       * Copyright notice for content in the channel.
       */
      copyright?: string;

      /**
       * The publication date for the content in the channel. For example, the
       * New York Times publishes on a daily basis, the publication date flips once
       * every 24 hours. That's when the pubDate of the channel changes. All
       * date-times in RSS conform to the Date and Time Specification of RFC 822,
       * with the exception that the year may be expressed with two characters or
       * four characters (four preferred).
       */
      pubDate?: string;

      /**
       * The last time the content of the channel changed.
       */
      lastBuildDate?: string;

      /**
       * Specify one or more categories that the channel belongs to. Follows the
       * same rules as the <item>-level category element.
       */
      category?: string;

      /**
       * A string indicating the program used to generate the channel.
       */
      generator?: string;

      /**
       * Specifies a GIF, JPEG or PNG image that can be displayed with the channel.
       */
      image?: Image;

      item: Item[];
   }

   export interface Item {
      /**
       * There are no rules for the syntax of a guid. Aggregators must view them as
       * a string. It's up to the source of the feed to establish the uniqueness of
       * the string.
       *
       * If the guid element has an attribute named "isPermaLink" with a value of
       * true, the reader may assume that it is a permalink to the item, that is, a
       * url that can be opened in a Web browser, that points to the full item
       * described by the `<item>` element. An example:
       *
       * <guid isPermaLink="true">http://inessential.com/2002/09/01.php#a2</guid>
       *
       * isPermaLink is optional, its default value is true. If its value is false,
       * the guid may not be assumed to be a url, or a url to anything in
       * particular.
       */
      guid: string;
      title: string;
      link: string;
      description: string;

      /**
       * The email address of the author of the item. For newspapers and magazines
       * syndicating via RSS, the author is the person who wrote the article that
       * the <item> describes. For collaborative weblogs, the author of the item
       * might be different from the managing editor or webmaster. For a weblog
       * authored by a single individual it would make sense to omit the <author>
       * element.
       */
      author: string;

      /**
       * URL of a page for comments relating to the item.
       */
      comments?: string;

      pubDate?: string;

      enclosure?: Enclosure;

      /**
       * The RSS channel that the item came from.
       */
      source?: string;
   }
}
