/* global describe it expect */
import fs from 'fs';
import { resolve } from 'path';
import { HelmetProvider } from 'react-helmet-async';

import renderRouteWithHelmet, {
  prepare,
  postRender,
} from './render-route-with-helmet';

describe('renderRouteWithHelmet', () => {
  let indexHtml, indexEjsWithoutDoctype, hooks, wrapComponent;

  beforeEach(() => {
    indexHtml = fs.readFileSync(
      resolve(__dirname, './test-assets/index.html'),
      {
        encoding: 'utf8',
      }
    );
    indexEjsWithoutDoctype = fs.readFileSync(
      resolve(__dirname, './test-assets/index-without-doctype.ejs'),
      {
        encoding: 'utf8',
      }
    );
    hooks = {
      prepare: jest.fn(),
      postRender: jest.fn(),
    };
    wrapComponent = jest.fn();
  });

  describe('prepare', () => {
    it('should add a prepare hook', () => {
      renderRouteWithHelmet(hooks);
      expect(hooks.prepare).toHaveBeenCalledWith(prepare);
    });

    it('should add a helmetContext', () => {
      const context = {};
      prepare.apply(null, [context, wrapComponent]);
      expect(context).toHaveProperty('helmetContext');
      expect(context.helmetContext).toStrictEqual({});
    });

    it('should call wrapComponent with HelmetProvider', () => {
      const context = {};
      prepare.apply(null, [context, wrapComponent]);
      expect(wrapComponent).toHaveBeenCalledWith({
        type: HelmetProvider,
        props: {
          context: context.helmetContext,
        },
      });
    });
  });

  describe('postRender', () => {
    it('should add a postRender hook', () => {
      renderRouteWithHelmet(hooks);
      expect(hooks.postRender).toHaveBeenCalledWith(postRender);
    });

    it('should add the title tag', () => {
      const context = {
        helmetContext: {
          helmet: {
            title: '<title data-rh="true">Index</title>',
            meta: '<meta data-rh="true"></meta>',
            link: '<link data-rh="true"></link>',
            htmlAttributes: '',
            bodyAttributes: '',
          },
        },
      };
      const renderedComponent = '';
      const result = postRender.apply(null, [
        context,
        renderedComponent,
        indexHtml,
      ]);
      expect(result).toStrictEqual(
        formatEjs(indexEjsWithoutDoctype, {
          content: renderedComponent,
          title: 'Index',
        })
      );
    });

    it('should add the meta tags', () => {
      const context = {
        helmetContext: {
          helmet: {
            title: '<title data-rh="true"></title>',
            meta:
              '<meta data-rh="true" name="description" content="Website"/><meta data-rh="true" name="keywords" content="website"/>',
            link: '<link data-rh="true"></link>',
            htmlAttributes: '',
            bodyAttributes: '',
          },
        },
      };
      const renderedComponent = '';
      const result = postRender.apply(null, [
        context,
        renderedComponent,
        indexHtml,
      ]);
      expect(result).toStrictEqual(
        formatEjs(indexEjsWithoutDoctype, {
          content: renderedComponent,
          metas: { description: 'Website', keywords: 'website' },
        })
      );
    });

    it('should add the link tags', () => {
      const context = {
        helmetContext: {
          helmet: {
            title: '<title data-rh="true"></title>',
            meta: '<meta data-rh="true"></meta>',
            link:
              '<link data-rh="true" rel="alternate" href="https://jondarrer.com" hrefLang="en"/>',
            htmlAttributes: '',
            bodyAttributes: '',
          },
        },
      };
      const renderedComponent = '';
      const result = postRender.apply(null, [
        context,
        renderedComponent,
        indexHtml,
      ]);
      expect(result).toStrictEqual(
        formatEjs(indexEjsWithoutDoctype, {
          content: renderedComponent,
          linkAlt: 'https://jondarrer.com',
        })
      );
    });

    it('should add the html attributes', () => {
      const context = {
        helmetContext: {
          helmet: {
            title: '<title data-rh="true"></title>',
            meta: '<meta data-rh="true"></meta>',
            link: '<link data-rh="true"></link>',
            htmlAttributes: 'lang="en"',
            bodyAttributes: '',
          },
        },
      };
      const renderedComponent = '';
      const result = postRender.apply(null, [
        context,
        renderedComponent,
        indexHtml,
      ]);
      expect(result).toStrictEqual(
        formatEjs(indexEjsWithoutDoctype, {
          content: renderedComponent,
          htmlAttrs: 'lang="en"',
        })
      );
    });

    it('should add the body attributes', () => {
      const context = {
        helmetContext: {
          helmet: {
            title: '<title data-rh="true"></title>',
            meta: '<meta data-rh="true"></meta>',
            link: '<link data-rh="true"></link>',
            htmlAttributes: '',
            bodyAttributes: 'class="my-class another-class" id="id-1"',
          },
        },
      };
      const renderedComponent = '';
      const result = postRender.apply(null, [
        context,
        renderedComponent,
        indexHtml,
      ]);
      expect(result).toStrictEqual(
        formatEjs(indexEjsWithoutDoctype, {
          content: renderedComponent,
          bodyAttrs: 'class="my-class another-class" id="id-1"',
        })
      );
    });
  });
});

const formatEjs = (
  ejs,
  { htmlAttrs, bodyAttrs, content = '', title, metas, linkAlt }
) => {
  return replaceTemplateText(ejs, {
    htmlAttrs: htmlAttrs ? ` ${htmlAttrs}` : '',
    bodyAttrs: bodyAttrs ? ` ${bodyAttrs}` : '',
    content,
    title: title ? `<title data-rh="true">${title}</title>` : '',
    metas: buildTags(metas, 'meta', 'name', 'content'),
    linkAlt: linkAlt
      ? `<link data-rh="true" rel="alternate" href="${linkAlt}" hrefLang="en"/>`
      : '',
  });
};

const buildTags = (tags, tagName, keyName, valueName) => {
  if (!tags) return '';

  return Object.keys(tags)
    .map(
      (key) =>
        `<${tagName} data-rh="true" ${keyName}="${key}" ${valueName}="${tags[key]}"/>`
    )
    .join('');
};

const replaceTemplateText = (ejs, replacements) => {
  return Object.keys(replacements).reduce((acc, key) => {
    return acc.replace(`<%= ${key} %>`, replacements[key]);
  }, ejs);
};
