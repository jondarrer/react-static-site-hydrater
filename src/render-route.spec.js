/* global describe it expect */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import fs from 'fs';
import { resolve } from 'path';
import { HelmetProvider, Helmet } from 'react-helmet-async';
HelmetProvider.canUseDOM = false;

import renderRoute from './render-route';

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
    const Component = () => (
      <Switch>
        <Route path="/" exact>
          <h1>index-content</h1>
        </Route>
        <Route path="/about">
          <h1>about-content</h1>
        </Route>
        <Route>
          <h1>not-found</h1>
        </Route>
      </Switch>
    );

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
    const Component = () => (
      <Switch>
        <Route path="/" exact>
          <Helmet>
            <html lang="en"></html>
            <body className="abc"></body>
            <title>Index</title>
            <meta name="description" content="index" />
            <link rel="alternate" href="http://example.com/" hreflang="en" />
          </Helmet>
          <h1>index-content</h1>
        </Route>
        <Route path="/about">
          <Helmet>
            <html lang="en"></html>
            <body className="abc"></body>
            <title>About</title>
            <meta name="description" content="about" />
            <link
              rel="alternate"
              href="http://example.com/about"
              hreflang="en"
            />
          </Helmet>
          <h1>about-content</h1>
        </Route>
        <Route>
          <Helmet>
            <html lang="en"></html>
            <body className="abc"></body>
            <title>Not Found</title>
            <meta name="description" content="not-found" />
            <link
              rel="alternate"
              href="http://example.com/unknown"
              hreflang="en"
            />
          </Helmet>
          <h1>not-found</h1>
        </Route>
      </Switch>
    );

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
