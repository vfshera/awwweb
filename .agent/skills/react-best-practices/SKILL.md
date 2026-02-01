---
name: react-best-practices
description: React performance optimization guidelines. Use when writing, reviewing, or refactoring React components to ensure optimal rendering and bundle patterns. Triggers on tasks involving React components, hooks, memoization, or bundle optimization.
---

# React Best Practices

Performance optimization and composition patterns for React components. Contains 47 rules across 8 categories focused on reducing re-renders, optimizing bundles, component composition, accessibility, and avoiding common React pitfalls.

## When to Apply

Reference these guidelines when:

- Writing new React components
- Reviewing code for performance and accessibility issues
- Refactoring existing React code
- Optimizing bundle size
- Working with hooks and state
- Ensuring accessibility compliance

## Rules Summary

### Bundle Size Optimization (CRITICAL)

#### bundle-barrel-imports - @rules/bundle-barrel-imports.md

Import directly from source, avoid barrel files.

```tsx
// Bad: loads entire library (200-800ms)
import { Check, X } from "lucide-react";

// Good: loads only what you need
import Check from "lucide-react/dist/esm/icons/check";
import X from "lucide-react/dist/esm/icons/x";
```

#### bundle-conditional - @rules/bundle-conditional.md

Load modules only when feature is activated.

```tsx
useEffect(() => {
  if (enabled && typeof window !== "undefined") {
    import("./heavy-module").then((mod) => setModule(mod));
  }
}, [enabled]);
```

#### bundle-preload - @rules/bundle-preload.md

Preload on hover/focus for perceived speed.

```tsx
<button
  onMouseEnter={() => import("./editor")}
  onFocus={() => import("./editor")}
  onClick={openEditor}
>
  Open Editor
</button>
```

### Re-render Optimization (MEDIUM)

#### rerender-functional-setstate - @rules/rerender-functional-setstate.md

Use functional setState for stable callbacks.

```tsx
// Bad: stale closure risk, recreates on items change
const addItem = useCallback(
  (item) => {
    setItems([...items, item]);
  },
  [items],
);

// Good: always uses latest state, stable reference
const addItem = useCallback((item) => {
  setItems((curr) => [...curr, item]);
}, []);
```

#### rerender-derived-state-no-effect - @rules/rerender-derived-state-no-effect.md

Derive state during render, not in effects.

```tsx
// Bad: extra state and effect, extra render
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(firstName + " " + lastName);
}, [firstName, lastName]);

// Good: derived directly during render
const fullName = firstName + " " + lastName;
```

#### rerender-lazy-state-init - @rules/rerender-lazy-state-init.md

Pass function to useState for expensive initial values.

```tsx
// Bad: runs expensiveComputation() on every render
const [data] = useState(expensiveComputation());

// Good: runs only on initial render
const [data] = useState(() => expensiveComputation());
```

#### rerender-dependencies - @rules/rerender-dependencies.md

Use primitive dependencies in effects.

```tsx
// Bad: runs on any user field change
useEffect(() => {
  console.log(user.id);
}, [user]);

// Good: runs only when id changes
useEffect(() => {
  console.log(user.id);
}, [user.id]);
```

#### rerender-derived-state - @rules/rerender-derived-state.md

Subscribe to derived booleans, not raw values.

```tsx
// Bad: re-renders on every pixel change
const width = useWindowWidth();
const isMobile = width < 768;

// Good: re-renders only when boolean changes
const isMobile = useMediaQuery("(max-width: 767px)");
```

#### rerender-memo - @rules/rerender-memo.md

Extract expensive work into memoized components.

```tsx
// Good: skips computation when loading
const UserAvatar = memo(function UserAvatar({ user }) {
  let id = useMemo(() => computeAvatarId(user), [user]);
  return <Avatar id={id} />;
});

function Profile({ user, loading }) {
  if (loading) return <Skeleton />;
  return <UserAvatar user={user} />;
}
```

#### rerender-memo-with-default-value - @rules/rerender-memo-with-default-value.md

Hoist default non-primitive props to constants.

```tsx
// Bad: breaks memoization (new function each render)
const Button = memo(({ onClick = () => {} }) => ...)

// Good: stable default value
const NOOP = () => {}
const Button = memo(({ onClick = NOOP }) => ...)
```

#### rerender-simple-expression-in-memo - @rules/rerender-simple-expression-in-memo.md

Don't wrap simple primitive expressions in useMemo.

```tsx
// Bad: useMemo overhead > expression cost
const isLoading = useMemo(() => a.loading || b.loading, [a.loading, b.loading]);

// Good: just compute it
const isLoading = a.loading || b.loading;
```

#### rerender-move-effect-to-event - @rules/rerender-move-effect-to-event.md

Put interaction logic in event handlers, not effects.

```tsx
// Bad: effect re-runs on theme change
useEffect(() => {
  if (submitted) post("/api/register");
}, [submitted, theme]);

// Good: in handler
const handleSubmit = () => post("/api/register");
```

#### rerender-transitions - @rules/rerender-transitions.md

Use startTransition for non-urgent updates.

```tsx
// Good: non-blocking scroll tracking
const handler = () => {
  startTransition(() => setScrollY(window.scrollY));
};
```

#### rerender-use-ref-transient-values - @rules/rerender-use-ref-transient-values.md

Use refs for transient frequent values.

```tsx
// Good: no re-render, direct DOM update
const lastXRef = useRef(0);
const dotRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  let onMove = (e) => {
    lastXRef.current = e.clientX;
    dotRef.current?.style.transform = `translateX(${e.clientX}px)`;
  };
  window.addEventListener("mousemove", onMove);
  return () => window.removeEventListener("mousemove", onMove);
}, []);
```

#### rerender-defer-reads - @rules/rerender-defer-reads.md

Don't subscribe to state only used in callbacks.

```tsx
// Bad: subscribes to all searchParams changes
const searchParams = useSearchParams()
const handleShare = () => shareChat(chatId, { ref: searchParams.get('ref') })

// Good: reads on demand, no subscription
const handleShare = () => {
  const params = new URLSearchParams(window.location.search)
  shareChat(chatId, { ref: params.get('ref') })
}
```

### Rendering Performance (MEDIUM)

#### rendering-conditional-render - @rules/rendering-conditional-render.md

Use ternary, not && for conditionals with numbers.

```tsx
// Bad: renders "0" when count is 0
{
  count && <Badge>{count}</Badge>;
}

// Good: renders nothing when count is 0
{
  count > 0 ? <Badge>{count}</Badge> : null;
}
```

#### rendering-hoist-jsx - @rules/rendering-hoist-jsx.md

Extract static JSX outside components.

```tsx
// Good: reuses same element, especially for large SVGs
const skeleton = <div className="h-20 animate-pulse bg-gray-200" />;

function Container({ loading }) {
  return loading ? skeleton : <Content />;
}
```

#### rendering-content-visibility - @rules/rendering-content-visibility.md

Use content-visibility for long lists.

```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

#### rendering-animate-svg-wrapper - @rules/rendering-animate-svg-wrapper.md

Animate wrapper div, not SVG element (for GPU acceleration).

```tsx
// Good: hardware accelerated
<div className="animate-spin">
  <svg>...</svg>
</div>
```

#### rendering-svg-precision - @rules/rendering-svg-precision.md

Reduce SVG coordinate precision with SVGO.

```bash
npx svgo --precision=1 --multipass icon.svg
```

#### rendering-hydration-no-flicker - @rules/rendering-hydration-no-flicker.md

Use inline script for client-only data to prevent flicker.

```tsx
<div id="theme-wrapper">{children}</div>
<script dangerouslySetInnerHTML={{ __html: `
  var theme = localStorage.getItem('theme') || 'light';
  document.getElementById('theme-wrapper').className = theme;
` }} />
```

#### rendering-hydration-suppress-warning - @rules/rendering-hydration-suppress-warning.md

Suppress expected hydration mismatches.

```tsx
<span suppressHydrationWarning>{new Date().toLocaleString()}</span>
```

#### rendering-client-only - @rules/rendering-client-only.md

Render browser-only components with ClientOnly and a fallback.

```tsx
<ClientOnly fallback={<Skeleton />}>{() => <Map />}</ClientOnly>
```

#### rendering-use-hydrated - @rules/rendering-use-hydrated.md

Use `useHydrated` for SSR/CSR divergence.

```tsx
let hydrated = useHydrated();
return hydrated ? <Widget /> : <Skeleton />;
```

#### rendering-usetransition-loading - @rules/rendering-usetransition-loading.md

Prefer useTransition over manual loading states.

```tsx
const [isPending, startTransition] = useTransition();

let handleSearch = (value) => {
  startTransition(async () => {
    let data = await fetchResults(value);
    setResults(data);
  });
};
```

#### fault-tolerant-error-boundaries - @rules/fault-tolerant-error-boundaries.md

Place error boundaries at feature boundaries.

```tsx
<ErrorBoundary fallback={<SidebarError />}>
  <Sidebar />
</ErrorBoundary>
```

#### rendering-activity - @rules/rendering-activity.md

Use React's `<Activity>` component for show/hide (React 19+).

```tsx
import { Activity } from "react";

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <ExpensiveMenu />
    </Activity>
  );
}
```

#### rendering-suspense-boundaries - @rules/rendering-suspense-boundaries.md

Use Suspense to show UI immediately while data loads.

```tsx
// Good: layout shows immediately, content streams in
function Page() {
  return (
    <Layout>
      <Suspense fallback={<Skeleton />}>
        <Content />
      </Suspense>
    </Layout>
  );
}
```

### Client Patterns (MEDIUM)

#### client-passive-event-listeners - @rules/client-passive-event-listeners.md

Use passive listeners for scroll/touch.

```tsx
document.addEventListener("wheel", handler, { passive: true });
document.addEventListener("touchstart", handler, { passive: true });
```

#### client-localstorage-schema - @rules/client-localstorage-schema.md

Version and minimize localStorage data.

```typescript
const VERSION = "v2";

function saveConfig(config: Config) {
  try {
    localStorage.setItem(`config:${VERSION}`, JSON.stringify(config));
  } catch {} // Handle incognito/quota exceeded
}
```

#### client-event-listeners - @rules/client-event-listeners.md

Deduplicate global event listeners using SWR subscription.

```tsx
import useSWRSubscription from "swr/subscription";

const keyCallbacks = new Map<string, Set<() => void>>();

function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    if (!keyCallbacks.has(key)) keyCallbacks.set(key, new Set());
    keyCallbacks.get(key)!.add(callback);
    return () => {
      const set = keyCallbacks.get(key);
      if (set) {
        set.delete(callback);
        if (set.size === 0) keyCallbacks.delete(key);
      }
    };
  }, [key, callback]);

  useSWRSubscription("global-keydown", () => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && keyCallbacks.has(e.key)) {
        keyCallbacks.get(e.key)!.forEach((cb) => cb());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
}
```

### Hooks (HIGH)

#### hooks-limit-useeffect - @rules/hooks-limit-useeffect.md

Use useEffect only when absolutely necessary. Prefer derived state or event handlers.

```tsx
// Bad: useEffect to derive state
let [filtered, setFiltered] = useState(items);
useEffect(() => {
  setFiltered(items.filter((i) => i.active));
}, [items]);

// Good: derive during render
let filtered = items.filter((i) => i.active);

// Good: useMemo if expensive
let filtered = useMemo(() => items.filter((i) => i.active), [items]);
```

#### hooks-useeffect-named-functions - @rules/hooks-useeffect-named-functions.md

Use named function declarations in useEffect for better debugging and self-documentation.

```tsx
// Bad: anonymous arrow function
useEffect(() => {
  document.title = title;
}, [title]);

// Good: named function
useEffect(
  function syncDocumentTitle() {
    document.title = title;
  },
  [title],
);

// Good: also name cleanup functions
useEffect(function subscribeToOnlineStatus() {
  window.addEventListener("online", handleOnline);
  return function unsubscribeFromOnlineStatus() {
    window.removeEventListener("online", handleOnline);
  };
}, []);
```

#### hooks-event-handler-refs - @rules/hooks-event-handler-refs.md

Store event handlers in refs for stable subscriptions.

```tsx
// Better: use useEffectEvent (React 19+)
import { useEffectEvent } from "react";

// Good: stable subscription
function useWindowEvent(event: string, handler: (e) => void) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (e) => handlerRef.current(e);
    window.addEventListener(event, listener);
    return () => window.removeEventListener(event, listener);
  }, [event]);
}

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler);
  useEffect(() => {
    window.addEventListener(event, onEvent);
    return () => window.removeEventListener(event, onEvent);
  }, [event]);
}
```

#### hooks-init-once - @rules/hooks-init-once.md

Initialize app once per load, not per component mount.

```tsx
// Good: once per app load
let didInit = false;

function Comp() {
  useEffect(() => {
    if (didInit) return;
    didInit = true;
    loadFromStorage();
    checkAuthToken();
  }, []);
}
```

#### hooks-use-effect-event - @rules/hooks-use-effect-event.md

Use `useEffectEvent` for stable callback refs (React 19+).

```tsx
import { useEffectEvent } from "react";

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  const onSearchEvent = useEffectEvent(onSearch);

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);
}
```

### Composition Patterns (HIGH)

#### composition-avoid-boolean-props - @rules/composition-avoid-boolean-props.md

Don't add boolean props to customize behavior. Use composition instead.

```tsx
// Bad: boolean prop explosion
<Composer isThread isEditing={false} showAttachments />

// Good: explicit variants
<ThreadComposer channelId="abc" />
<EditComposer messageId="xyz" />
```

#### composition-compound-components - @rules/composition-compound-components.md

Structure complex components as compound components with shared context.

```tsx
// Good: compound components
<Composer.Provider state={state} actions={actions}>
  <Composer.Frame>
    <Composer.Input />
    <Composer.Footer>
      <Composer.Submit />
    </Composer.Footer>
  </Composer.Frame>
</Composer.Provider>
```

#### composition-state-provider - @rules/composition-state-provider.md

Lift state into provider components for cross-component access.

```tsx
// Good: state in provider, accessible anywhere inside
<ForwardMessageProvider>
  <Dialog>
    <Composer.Input />
    <MessagePreview /> {/* Can read state */}
    <ForwardButton /> {/* Can call submit */}
  </Dialog>
</ForwardMessageProvider>
```

#### composition-explicit-variants - @rules/composition-explicit-variants.md

Create explicit variant components instead of prop combinations.

```tsx
// Good: self-documenting variants
function ThreadComposer({ channelId }) {
  return (
    <ThreadProvider channelId={channelId}>
      <Composer.Frame>
        <Composer.Input />
        <AlsoSendToChannelField />
        <Composer.Submit />
      </Composer.Frame>
    </ThreadProvider>
  );
}
```

#### composition-children-over-render-props - @rules/composition-children-over-render-props.md

Prefer children for composition. Use render props only when passing data back.

```tsx
// Good: children for structure
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>

// OK: render props when passing data
<List renderItem={({ item }) => <Item {...item} />} />
```

#### composition-avoid-overabstraction - @rules/composition-avoid-overabstraction.md

Avoid rigid configuration props; prefer composable children APIs.

```tsx
<Select value="abc" onChange={...}>
  <Option value="abc">ABC</Option>
  <Option value="xyz">XYZ</Option>
</Select>
```

#### composition-typescript-namespaces - @rules/composition-typescript-namespaces.md

Use TypeScript namespaces to combine component and its types for single-import access.

```tsx
// components/button.tsx
export namespace Button {
  export type Variant = "solid" | "ghost" | "outline";
  export interface Props {
    variant?: Variant;
    children: React.ReactNode;
  }
}

export function Button({ variant = "solid", children }: Button.Props) {
  // ...
}

// Usage: single import
import { Button } from "~/components/button";

<Button variant="ghost">Click</Button>
function wrap(props: Button.Props) { ... }
```

**Important:** Namespaces should only contain types, never runtime code.

### React 19 APIs (MEDIUM)

#### react19-no-forwardref - @rules/react19-no-forwardref.md

In React 19, `ref` is now a regular prop and `use()` replaces `useContext()`.

```tsx
// Good: ref as a regular prop
function ComposerInput({
  ref,
  ...props
}: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />;
}

// Good: use() instead of useContext()
const value = use(MyContext);
```

### Accessibility (a11y) (HIGH)

#### a11y-semantic-html-landmarks - @rules/a11y-semantic-html-landmarks.md

Use semantic HTML elements for page structure.

```tsx
// Bad: divs with class names
<div className="header">...</div>
<div className="nav">...</div>
<div className="content">...</div>

// Good: semantic elements
<header>...</header>
<nav aria-label={t("Primary")}>...</nav>
<main>...</main>
<footer>...</footer>
```

#### a11y-screen-reader-sr-only - @rules/a11y-screen-reader-sr-only.md

Use sr-only class for visually hidden text.

```tsx
// Icon-only buttons need accessible labels
<Button variant="icon" onPress={onClose}>
  <XMarkIcon aria-hidden="true" />
  <span className="sr-only">{t("Close")}</span>
</Button>

// Visually hidden section headings
<section>
  <h2 className="sr-only">{t("Search results")}</h2>
  <SearchResultsList />
</section>
```

#### a11y-aria-live-regions - @rules/a11y-aria-live-regions.md

Announce dynamic content changes to screen readers.

```tsx
// Error messages - announced immediately
{
  error && (
    <p role="alert" className="text-failure-600">
      {error}
    </p>
  );
}

// Status updates - announced politely
<div role="status" aria-live="polite">
  {t("{{count}} results found", { count })}
</div>;
```

#### a11y-keyboard-navigation - @rules/a11y-keyboard-navigation.md

Use semantic elements for built-in keyboard support.

```tsx
// Bad: div with onClick not keyboard accessible
<div onClick={handleClick}>Click me</div>

// Good: button has Enter/Space support
<button onClick={handleClick}>Click me</button>

// Good: react-aria Button handles everything
import { Button } from "react-aria-components";
<Button onPress={handlePress}>Click me</Button>
```

#### a11y-focus-management - @rules/a11y-focus-management.md

Show visible focus indicators and trap focus in modals.

```tsx
// react-aria Modal handles focus trapping automatically
import { Dialog, Modal } from "react-aria-components";

// Always use focus-visible for focus styles
<button className="focus-visible:ring-2 focus-visible:ring-teal-600">
  Click me
</button>;

<Modal isOpen={isOpen}>
  <Dialog>{/* Focus automatically trapped here */}</Dialog>
</Modal>;
```

#### a11y-reduced-motion - @rules/a11y-reduced-motion.md

Respect prefers-reduced-motion setting.

```tsx
import { usePrefersReducedMotion } from "~/hooks/use-prefers-reduced-motion";

// CSS approach
<div className="animate-bounce motion-reduce:animate-none">
  Bouncing content
</div>;

// JS approach
function AnimatedCounter({ value }) {
  let prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return <span>{value}</span>;
  return <CountUp target={value} />;
}
```

#### a11y-touch-targets - @rules/a11y-touch-targets.md

Ensure 44x44px minimum touch targets.

```tsx
// Icon buttons need explicit sizing
<Button variant="icon" className="h-11 w-11">
  <XMarkIcon className="h-5 w-5" />
  <span className="sr-only">{t("Close")}</span>
</Button>

// Links need padding for tappable area
<Link to={href} className="block py-3 px-4">
  {label}
</Link>
```
