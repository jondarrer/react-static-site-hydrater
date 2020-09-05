import createFirebaseJsonContent from './create-firebase-json-content';

describe('createFirebaseJsonContent', () => {
  it('creates the content for no routes', () => {
    expect(createFirebaseJsonContent([])).toStrictEqual({
      hosting: {
        public: 'dist',
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [],
      },
    });
  });

  it('creates the content for two routes', () => {
    expect(
      createFirebaseJsonContent([
        { route: '/', filename: '__index.html' },
        { route: '/about', filename: '__about.html' },
      ])
    ).toStrictEqual({
      hosting: {
        public: 'dist',
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [
          {
            source: '/about',
            destination: '/__about.html',
          },
          {
            source: '!/@(js|css|jpg|png|txt)/**',
            destination: '/__index.html',
          },
        ],
      },
    });
  });

  it('creates the content for three routes in the correct order', () => {
    expect(
      createFirebaseJsonContent([
        { route: '/abc', filename: '__abc.html' },
        { route: '/', filename: '__index.html' },
        { route: '/about', filename: '__about.html' },
      ])
    ).toStrictEqual({
      hosting: {
        public: 'dist',
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [
          {
            source: '/abc',
            destination: '/__abc.html',
          },
          {
            source: '/about',
            destination: '/__about.html',
          },
          {
            source: '!/@(js|css|jpg|png|txt)/**',
            destination: '/__index.html',
          },
        ],
      },
    });
  });

  it('creates the content for routes without a / index route', () => {
    expect(
      createFirebaseJsonContent([
        { route: '/about', filename: '__about.html' },
        { route: '/abc', filename: '__abc.html' },
      ])
    ).toStrictEqual({
      hosting: {
        public: 'dist',
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [
          {
            source: '/about',
            destination: '/__about.html',
          },
          {
            source: '/abc',
            destination: '/__abc.html',
          },
        ],
      },
    });
  });
});
