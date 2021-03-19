/* global describe it expect */
const React = require('react');
const { Route, Switch } = require('react-router-dom');
const fs = require('fs');
const { resolve } = require('path');
const { HelmetProvider, Helmet } = require('react-helmet-async');
HelmetProvider.canUseDOM = false;

const renderRoute = require('./render-route');

describe('renderRoute', () => {
  const indexHtml = fs.readFileSync(
    resolve(__dirname, './test-assets/index.html'),
    {
      encoding: 'utf8',
    }
  );
  const indexEjs = fs.readFileSync(
    resolve(__dirname, './test-assets/index.ejs'),
    {
      encoding: 'utf8',
    }
  );

  describe('without react-helmet-async', () => {
    const Component = () =>
      React.createElement(Switch, null, [
        React.createElement(
          Route,
          { path: '/', exact: true, key: '1' },
          React.createElement('h1', null, 'index-content')
        ),
        React.createElement(
          Route,
          { path: '/about', key: '2' },
          React.createElement('h1', null, 'about-content')
        ),
        React.createElement(
          Route,
          { path: '/', key: '3' },
          React.createElement('h1', null, 'not-found')
        ),
      ]);

    it('should render the index route for /', () => {
      const route = '/';
      const renderedContent = '<h1>index-content</h1>';
      const result = renderRoute(route, indexHtml, Component);
      expect(result).toStrictEqual(
        formatEjs(indexEjs, {
          content: renderedContent,
        })
      );
    });

    it('should render the about route for /about', () => {
      const route = '/about';
      const renderedContent = '<h1>about-content</h1>';
      const result = renderRoute(route, indexHtml, Component);
      expect(result).toEqual(
        formatEjs(indexEjs, {
          content: renderedContent,
        })
      );
    });

    it('should render the not-found route for /unknown', () => {
      const route = '/unknown';
      const renderedContent = '<h1>not-found</h1>';
      const result = renderRoute(route, indexHtml, Component);
      expect(result).toEqual(
        formatEjs(indexEjs, {
          content: renderedContent,
        })
      );
    });
  });

  describe('with react-helmet-async', () => {
    const Component = () =>
      React.createElement(Switch, null, [
        React.createElement(Route, { path: '/', exact: true, key: '1' }, [
          React.createElement(Helmet, { key: '1' }, [
            React.createElement('html', { lang: 'en', key: '1' }),
            React.createElement('body', { className: 'abc', key: '2' }),
            React.createElement('title', { key: '3' }, 'Index'),
            React.createElement('meta', {
              name: 'description',
              content: 'index',
              key: '4',
            }),
            React.createElement('link', {
              rel: 'alternate',
              href: 'http://example.com/',
              hreflang: 'en',
              key: '5',
            }),
          ]),
          React.createElement('h1', { key: '2' }, 'index-content'),
        ]),
        React.createElement(Route, { path: '/about', key: '2' }, [
          React.createElement(Helmet, { key: '1' }, [
            React.createElement('html', { lang: 'en', key: '1' }),
            React.createElement('body', { className: 'abc', key: '2' }),
            React.createElement('title', { key: '3' }, 'About'),
            React.createElement('meta', {
              name: 'description',
              content: 'about',
              key: '4',
            }),
            React.createElement('link', {
              rel: 'alternate',
              href: 'http://example.com/about',
              hreflang: 'en',
              key: '5',
            }),
          ]),
          React.createElement('h1', { key: '2' }, 'about-content'),
        ]),
        React.createElement(Route, { path: '/', key: '3' }, [
          React.createElement(Helmet, { key: '1' }, [
            React.createElement('html', { lang: 'en', key: '1' }),
            React.createElement('body', { className: 'abc', key: '2' }),
            React.createElement('title', { key: '3' }, 'Not Found'),
            React.createElement('meta', {
              name: 'description',
              content: 'not-found',
              key: '4',
            }),
            React.createElement('link', {
              rel: 'alternate',
              href: 'http://example.com/unknown',
              hreflang: 'en',
              key: '5',
            }),
          ]),
          React.createElement('h1', { key: '2' }, 'not-found'),
        ]),
      ]);

    it('should render the index route for /', () => {
      const route = '/';
      const renderedContent = '<h1>index-content</h1>';
      const result = renderRoute(route, indexHtml, Component);
      expect(result).toEqual(
        formatEjs(indexEjs, {
          htmlAttrs: 'lang="en"',
          bodyAttrs: 'class="abc"',
          content: renderedContent,
          title: 'Index',
          metaDescr: 'index',
          linkAlt: 'http://example.com/',
        })
      );
    });

    it('should render the about route for /about', () => {
      const route = '/about';
      const renderedContent = '<h1>about-content</h1>';
      const result = renderRoute(route, indexHtml, Component);
      expect(result).toEqual(
        formatEjs(indexEjs, {
          htmlAttrs: 'lang="en"',
          bodyAttrs: 'class="abc"',
          content: renderedContent,
          title: 'About',
          metaDescr: 'about',
          linkAlt: 'http://example.com/about',
        })
      );
    });

    it('should render the not-found route for /unknown', () => {
      const route = '/unknown';
      const renderedContent = '<h1>not-found</h1>';
      const result = renderRoute(route, indexHtml, Component);
      expect(result).toEqual(
        formatEjs(indexEjs, {
          htmlAttrs: 'lang="en"',
          bodyAttrs: 'class="abc"',
          content: renderedContent,
          title: 'Not Found',
          metaDescr: 'not-found',
          linkAlt: 'http://example.com/unknown',
        })
      );
    });
  });
});

const formatEjs = (
  ejs,
  { htmlAttrs, bodyAttrs, content = '', title, metaDescr, linkAlt }
) => {
  return replaceTemplateText(ejs, {
    htmlAttrs: htmlAttrs ? ` ${htmlAttrs}` : '',
    bodyAttrs: bodyAttrs ? ` ${bodyAttrs}` : '',
    content,
    title: title ? `<title data-rh="true">${title}</title>` : '',
    metaDescr: metaDescr
      ? `<meta data-rh="true" name="description" content="${metaDescr}">`
      : '',
    linkAlt: linkAlt
      ? `<link data-rh="true" rel="alternate" href="${linkAlt}" hreflang="en">`
      : '',
  });
};

const replaceTemplateText = (ejs, replacements) => {
  return Object.keys(replacements).reduce((acc, key) => {
    return acc.replace(`<%= ${key} %>`, replacements[key]);
  }, ejs);
};
