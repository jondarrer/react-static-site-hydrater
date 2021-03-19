const routeToFilename = (route) => {
  if (route === '/') route = '/index';
  return `_${route.replace(/\//g, '_')}.html`;
};

module.exports = routeToFilename;
