const routeToFilename = (route) => {
  if (route === '/') route = '/index';
  return `_${route.replace(/\//g, '_')}.html`;
};

export default routeToFilename;
