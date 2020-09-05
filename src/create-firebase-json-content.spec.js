const createFirebaseJsonContent = require('./create-firebase-json-content');

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
            source: '!/@(js|css|jpg|png|txt)/**',
            destination: '/__index.html',
          },
          {
            source: '/about',
            destination: '/__about.html',
          },
        ],
      },
    });
  });
});
