import wrapComponentBase from './wrap-component';

const AsyncFunctionPrototype = Reflect.getPrototypeOf(async () => {});

/**
 * Build the execution pipeline for rendering a route
 *
 * @param {import("./models").Pipeline} pipeline
 * @param {String} route
 * @param {String} indexHtml
 * @param {React.Component} Component
 */
const executeRenderPipelineForRoute = async (
  pipeline,
  route,
  indexHtml,
  Component
) => {
  if (!pipeline || pipeline.length < 1) {
    return null;
  }
  let result;
  const context = {
    route,
    component: {
      type: Component,
      props: {},
    },
    __wrappedComponent: null,
  };
  let renderedComponent;

  // __state.wrappedComponent = null;
  /**
   * @type {import("./models").WrapComponentCallback}
   */
  const wrapComponent = (elementTree) => {
    context.__wrappedComponent = wrapComponentBase(
      elementTree,
      context.__wrappedComponent
    );
  };
  wrapComponent(context.component);

  for (let i = 0; i < pipeline.length; i++) {
    const { plugin, options, hookName } = pipeline[i];
    switch (hookName) {
      case 'prepare':
        if (
          Reflect.getPrototypeOf(plugin['prepare']) === AsyncFunctionPrototype
        ) {
          await Reflect.apply(plugin['prepare'], null, [
            context,
            wrapComponent,
            options,
          ]);
        } else {
          Reflect.apply(plugin['prepare'], null, [context, wrapComponent]);
        }
        break;
      case 'render':
        renderedComponent = Reflect.apply(plugin['render'], null, [
          context.__wrappedComponent,
        ]);
        break;
      case 'postRender':
        indexHtml = Reflect.apply(plugin['postRender'], null, [
          context,
          renderedComponent,
          indexHtml,
        ]);
        break;
      case 'finalise':
        result = Reflect.apply(plugin['finalise'], null, [
          context,
          renderedComponent,
          indexHtml,
        ]);
        break;
    }
  }

  return result;
};

export default executeRenderPipelineForRoute;
