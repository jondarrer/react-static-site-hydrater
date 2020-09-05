/**
 * @param {Array<import("./models").RenderedRoute>} routes The routes from which to build the rewrites
 * @param {string} publicDir The directory on firebase which contains the public files
 * @return {any} The content of the firebase.json file
 */
const createFirebaseJsonContent = (routes, publicDir = 'dist') => {
  const rewrites = routes.map((route) => ({
    source: route.route === '/' ? '!/@(js|css|jpg|png|txt)/**' : route.route,
    destination: `/${route.filename}`,
  }));
  const result = {
    hosting: {
      public: publicDir,
      ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
      rewrites,
    },
  };
  return result;
};

module.exports = createFirebaseJsonContent;
