import { router as expoRouter } from 'expo-router';

export type RoutableComponent = (props: {routeExecution: RouteExecution}) => JSX.Element

export type Route = {
  pattern: string,
  regexp: RegExp,
  pathParameters: string[],
}

export type RouteExecution = {
  route: Route,
  args: Record<string, string>,
}

export class Router {
  prefix?: string;
  routes: Map<Route, RoutableComponent> = new Map();

  setPrefix(prefix: string): this {
    this.prefix = prefix;
    return this;
  }
  
  private extractPathParameters(route: string): string[] {
    const parameterRegex = /{([^}]+)}/g;
    const pathParameters: string[] = [];
    let match: ReturnType<RegExp["exec"]> | null;
    while ((match = parameterRegex.exec(route)) !== null) {
      pathParameters.push(match[1]);
    }
    return pathParameters;
  }

  addRoute(pattern: string, Component: RoutableComponent): this {
    const fullPattern = this.prefix ? `${this.prefix}${pattern}` : pattern;
    const pathParameters = this.extractPathParameters(fullPattern);
    const regexp = new RegExp(fullPattern.replace(/{([^}]+)}/g, "([^/]+)"));
    const route = {pattern: fullPattern, regexp, pathParameters};
    
    this.routes.set(route, Component);

    return this;
  }

  execute(path: string, props?: JSX.Element['props']): JSX.Element | null {
    for (const [route, Component] of this.routes) {
      const match = route.regexp.exec(path);
      if (match) {
        const args: Record<string, string> = {};
        for (let i = 0; i < route.pathParameters.length; i++) {
          args[route.pathParameters[i]] = match[i + 1];
        }
        
        if (props) {
          return <Component routeExecution={{route, args}} {...props} />;
        }

        return <Component routeExecution={{route, args}} />;
      }
    }

    return null;
  }

  navigate(href: Parameters<(typeof expoRouter)['navigate']>[0]) {
    return expoRouter.navigate(href);
  }

  push(href: Parameters<(typeof expoRouter)['push']>[0]) {
    return expoRouter.push(href);
  }

  replace(href: Parameters<(typeof expoRouter)['replace']>[0]) {
    return expoRouter.replace(href);
  }

  back() {
    return expoRouter.back();
  }

  canGoBack() {
    return expoRouter.canGoBack();
  }
}

const routers = new Map<string | undefined, Router>();

export default function router(prefix?: string): Router {
  if (!routers.has(prefix)) {
    const r = new Router();
    if (prefix) {
      r.setPrefix(prefix);
    }
    routers.set(prefix, r);
  }

  const r = routers.get(prefix);
  if (!r) {
    throw new Error(`router(${prefix}) returned undefined`);
  }

  return r;
}
