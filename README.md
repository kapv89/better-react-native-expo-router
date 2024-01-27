# better-react-native-expo-router

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