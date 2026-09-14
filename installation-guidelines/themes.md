---
description: Tradeboard Themes
---

# Themes

Tradeboard's React frontend ships a two-axis theming system: a light or dark **mode**, combined with an **accent colour**. Analyzer mode overrides both with its own locked purple palette so you can always tell test mode from live trading at a glance.

<figure><img src="/assets/image (126).png" alt=""><figcaption></figcaption></figure>

### Overview

* **Two modes**: Light and Dark
* **Eight accent colours**: applied on top of either mode
* **Mode-specific theming**: Analyzer mode has a fixed purple palette that cannot be changed
* **Instant switching**: theme changes apply immediately, with no page reload
* **Persistent preferences**: your choice is stored in the browser and restored on the next visit
* **Responsive design**: every combination works on desktop, tablet and mobile
* **Accessibility**: colours are defined in the OKLCH colour space with contrast-checked foreground pairings

### Available Themes

#### Modes

| Mode      | Description                                    |
| --------- | ---------------------------------------------- |
| **Light** | Default bright interface                       |
| **Dark**  | Reduced eye strain for extended trading sessions |

#### Accent colours

The accent colour drives the `--primary` and `--ring` tokens: buttons, links, active states and focus rings.

| Accent      | Notes                                     |
| ----------- | ----------------------------------------- |
| **Zinc**    | Default. No override applied.             |
| **Slate**   | Subtle blue-grey                          |
| **Gray**    | Pure neutral grey                         |
| **Neutral** | Warm grey                                 |
| **Green**   |                                           |
| **Blue**    |                                           |
| **Violet**  |                                           |
| **Orange**  |                                           |

Each accent has a separate value for light and dark mode, so the same choice stays legible in both.

### Theme Usage

#### Live Mode (production trading)

In Live Mode both axes are yours to set: either mode, any of the eight accents.

**Quick toggle (navbar)**

The navigation bar carries a sun/moon button that flips between Light and Dark instantly.

**Full selection (Profile page)**

1. Open the profile menu and go to **Profile**
2. Select the **Theme** tab
3. Pick a mode, then pick an accent colour
4. Both apply immediately and are saved automatically

#### Analyzer Mode (sandbox environment)

**Analyzer Mode** is the risk-free environment for validating strategies and API requests without sending real orders.

**Fixed purple theme**

When you enter Analyzer Mode:

* **Auto-switch**: the `analyzer` class is applied to the document root, replacing the palette with a dark purple scheme
* **Visual indicator**: the distinctive purple interface signals that no real orders are being placed
* **Locked theme**: mode and accent changes are ignored while Analyzer Mode is active
* **Safety feature**: you always know whether you are in test mode or live trading

**Why a fixed theme?**

1. **Visual confirmation**: instantly recognise you are in test mode
2. **Prevent confusion**: no mistaking Analyzer Mode for Live Mode
3. **Consistent experience**: every user sees the same interface in documentation and support threads
4. **Safety first**: a clear visual distinction reduces the risk of accidental live trading

**Returning to Live Mode**

When you leave Analyzer Mode, your saved light or dark mode and accent colour are restored and theme switching becomes available again.

### How to change themes

#### Method 1: quick toggle (navbar)

1. Click the sun/moon icon in the navigation bar
2. The interface switches between Light and Dark instantly

**Best for**: quick switching at different times of day

#### Method 2: full selection (Profile page)

1. Open the profile menu and select **Profile**
2. Go to the **Theme** tab
3. Choose Light or Dark, then choose an accent colour
4. The current selection is highlighted

**Best for**: setting the accent colour, which the navbar toggle does not cover

### Technical details

#### Technology stack

The frontend lives in `frontend/` and is a Vite + React application:

* **Tailwind CSS 4** via `@tailwindcss/vite`, with the theme tokens declared in `frontend/src/index.css`
* **Radix UI** primitives for the accessible component layer
* **Zustand** with its `persist` middleware for the theme store, at `frontend/src/stores/themeStore.ts`

DaisyUI is no longer part of Tradeboard's theming. Guides that reference a `tailwind.config.mjs`, a `static/js/theme.js`, `npm run build:css`, or a list of 30 DaisyUI theme names describe an older build and no longer apply.

#### Theme implementation

Themes are pure CSS custom properties. Two independent hooks drive them:

```html
<!-- Dark mode is a class on the root element -->
<html class="dark" data-theme="blue">

<!-- Analyzer mode replaces both -->
<html class="analyzer">
```

* `.dark` selects the dark token set
* `data-theme="<accent>"` overrides `--primary` and `--ring`
* `.analyzer` overrides the whole palette and takes priority over both

The accent rules are written as `[data-theme="blue"]:not(.analyzer)` precisely so that Analyzer Mode cannot be recoloured.

#### Storage and persistence

The Zustand store persists to `localStorage` under the key `tradeboard-theme`:

```javascript
JSON.parse(localStorage.getItem('tradeboard-theme'))
// { state: { mode: 'dark', color: 'blue', appMode: 'live' }, version: 0 }
```

Analyzer mode itself is server state, not a browser preference: toggling it posts to `/auth/analyzer-toggle` with a CSRF token, and the frontend re-syncs the value from the backend on load.

#### Theme colour tokens

Each mode defines the same semantic tokens, so components never hardcode a colour:

| Token                    | Purpose            | Examples                      |
| ------------------------ | ------------------ | ----------------------------- |
| `--primary`              | Accent colour      | Buttons, links, active states |
| `--primary-foreground`   | Text on accent     | Button labels                 |
| `--background`           | Page background    | App shell                     |
| `--foreground`           | Body text          | Labels, paragraphs            |
| `--card`                 | Raised surface     | Cards, panels                 |
| `--popover`              | Overlay surface    | Dropdowns, dialogs            |
| `--secondary`            | Supporting surface | Secondary buttons             |
| `--muted`                | Subdued surface    | Disabled states, placeholders |
| `--accent`               | Highlight surface  | Hover states                  |
| `--destructive`          | Error states       | Loss, failed orders           |
| `--border` / `--input`   | Borders            | Dividers, input outlines      |
| `--ring`                 | Focus ring         | Keyboard focus                |

Colours are authored in OKLCH, which keeps perceived lightness consistent when an accent is swapped.

### Browser compatibility

Tradeboard's themes work in all current browsers:

* Chrome/Edge 111+
* Firefox 113+
* Safari 15.4+
* Modern mobile browsers (iOS Safari, Chrome Mobile)

OKLCH colours and the Tailwind 4 engine need these versions. Internet Explorer is not supported.

### Rebuilding the frontend (advanced)

You do not need Node.js to run Tradeboard. The repository ships the built bundle in `frontend/dist`, and the Docker image rebuilds it as part of the image build.

If you want to change the theme tokens yourself, edit `frontend/src/index.css` and rebuild:

```bash
cd frontend
npm ci
npm run build
```

This requires Node.js 20.20+, 22.22+ or 24.13+ (the range declared in `frontend/package.json`). `npm run dev` starts the Vite dev server if you would rather iterate with hot reload.

To add a new accent colour you need to touch three places:

1. `ThemeColor` in `frontend/src/stores/themeStore.ts`
2. `ACCENT_COLORS` in `frontend/src/pages/Profile.tsx`
3. A `[data-theme="<name>"]:not(.analyzer)` block, and its `.dark` counterpart, in `frontend/src/index.css`

### Troubleshooting

#### Theme not changing

1. **Clear browser cache**: hard reload with `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Check localStorage**: DevTools, Application, Local Storage, look for the `tradeboard-theme` key
3. **Disable browser extensions**: some extensions rewrite page styles
4. **Try a private window**: rules out extension conflicts

#### Analyzer mode theme will not change

This is **expected behaviour**. The purple Analyzer palette is locked for safety. To change themes:

1. Leave Analyzer Mode
2. Return to Live Mode
3. Select your preferred mode and accent
4. They are restored automatically the next time you leave Analyzer Mode

#### A custom accent does not appear

1. Confirm you added the colour in all three places listed above
2. Rebuild the frontend: `cd frontend && npm run build`
3. Hard reload the browser so the new bundle is fetched

### Credits and acknowledgments

#### Tailwind CSS

Thanks to [**Tailwind Labs**](https://tailwindcss.com/) for the utility-first CSS framework that forms the foundation of the design system.

* **Project**: [github.com/tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
* **License**: MIT

#### Radix UI

Thanks to the [**Radix**](https://www.radix-ui.com/) team for the accessible, unstyled component primitives underneath Tradeboard's UI.

* **License**: MIT

#### Community

Special thanks to the Tradeboard community for feedback on themes, accessibility improvements, and user experience suggestions.

### Resources

#### Official documentation

* **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
* **Radix UI**: [radix-ui.com/primitives](https://www.radix-ui.com/primitives)

#### Tradeboard documentation

* **Getting Started**: [docs.algo.wesoftcorp.com/getting-started](https://docs.algo.wesoftcorp.com/getting-started)
