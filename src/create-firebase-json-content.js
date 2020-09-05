/**
 * @param {Array<import("./models").RenderedRoute>} routes The routes from which to build the rewrites
 * @param {string} publicDir The directory on firebase which contains the public files
 * @return {any} The content of the firebase.json file
 */
const createFirebaseJsonContent = (routes, publicDir = 'dist') => {
  const orderedRoutes = routes.sort((a, b) => {
    if (a.route === '/' && b.route !== '/') {
      return 1;
    } else if (a.route !== '/' && b.route === '/') {
      return -1;
    }
    return 0;
  });
  const rewrites = orderedRoutes.map((route) => ({
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

export default createFirebaseJsonContent;
