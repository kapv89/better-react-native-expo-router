# better-react-native-expo-router

Just copy the file `router.tsx` in your project and start using.

---

## Usage

In `app/[...container].tsx`:

```tsx
import router from './router';
import { usePathname } from 'expo-router';

router()
  .addRoute('/shop', ShopScreen)
  .addRoute('/shop/{item}', ItemScreen)
  .addRoute('/item-designer', ItemDesignerScreen)
;

// In app/[...container].tsx
export default function Container() {
    const pathname = usePathname();

    return (
        <>
            ...
            {router.execute(pathname, extraProps)}
            ...
        </>
    )
}
```

In `ItemDesignerScreen` component's file:

```tsx
import router from './router';
import { usePathname } from 'expo-router';

router('/item-designer')
    .addRoute('/theme-picker/{color}')
    .addRoute('/pixel-art/{color}')

export default function ItemDesignerScreen() {
    const pathname = usePathname();

    return (
        <>
            ...
            {router('/item-designer').execute(pathname, extraProps)}
            ...
        </>
    )
}
```

or

```tsx
import router from './router';
import { usePathname } from 'expo-router';

const r = router('/item-designer')
    .addRoute('/theme-picker/{color}')
    .addRoute('/pixel-art/{color}')

export default function ItemDesignerScreen() {
    const pathname = usePathname();

    return (
        <>
            ...
            {r.execute(pathname, extraProps)}
            ...
        </>
    )
}
```

Routed components receive the following prop by via the router, and any extra props you pass:

```tsx
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
```

