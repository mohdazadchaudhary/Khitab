# Design System Document

## 1. Overview & Creative North Star: "The Digital Heirloom"

The Creative North Star for this design system is **"The Digital Heirloom."** 

In an era of instant, ephemeral communication, this system is designed to facilitate "slow" digital correspondence. We are moving away from the frantic, high-density layouts of social media toward an editorial, immersive experience that feels like opening a physical letter. The design breaks the "template" look through generous whitespace, intentional asymmetry (reminiscent of a hand-placed stamp or a signature), and a tactile approach to depth. We are not just building an interface; we are crafting a sanctuary for thought.

---

## 2. Colors & Surface Philosophy

The color palette is rooted in organic, earthy tones that evoke high-quality stationery and iron-gall ink.

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit on a `surface` background to create a clean, modern break without the visual clutter of "boxes."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of vellum or fine cotton paper.
- **Base Layer:** `surface` (#fdf9f1) or `background` (#fdf9f1).
- **Secondary Content:** `surface-container-low` (#f7f3eb) for subtle differentiation.
- **Interactive Layers:** Use `surface-container` (#f1ede5) or `surface-container-high` (#ece8e0) to pull focus toward active reading or writing areas.
- **Nesting:** An inner container (like a letter preview) should always use a slightly higher tier (e.g., `surface-container-highest`) than its parent to define its importance.

### The "Glass & Gradient" Rule
To avoid a flat "out-of-the-box" look, use Glassmorphism for floating elements (like navigation bars or hovering tooltips). Utilize semi-transparent surface colors with a `backdrop-blur` of 12px–20px. 
- **Signature Gradients:** For primary CTAs or hero sections, use a subtle radial gradient transitioning from `primary` (#324e58) to `primary-container` (#4a6670). This adds a "visual soul" and depth that mimics the way ink dries unevenly on paper.

---

## 3. Typography

The typography strategy pairs the intellectual weight of a serif with the modern clarity of a sans-serif, punctuated by human-centric accents.

- **Display & Headline (Noto Serif):** Used for titles and intros. The high-contrast serif evokes traditional printing presses. Use `display-lg` for impactful landing moments with generous letter-spacing (-0.02em).
- **Body & Labels (Manrope):** A clean, humanist sans-serif. It provides the "modern" half of the nostalgic-meets-modern equation. `body-lg` should be used for the actual "letter" content to ensure maximum readability during long-form sessions.
- **Handwriting Accents:** (Conceptual Role) Use a script-style font or SVG handwriting assets for signatures and "P.S." notes. These should be placed with intentional asymmetry—slightly rotated or overlapping a container edge—to break the rigid grid.

---

## 4. Elevation & Depth

We achieve hierarchy through **Tonal Layering** rather than traditional structural lines.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift that mimics the way light hits layered paper.
- **Ambient Shadows:** When a floating effect is required (e.g., an envelope being "opened"), shadows must be extra-diffused. Use a blur value of 30px–50px with an opacity of 4%–8%. The shadow color should be a tinted version of `on-surface` (#1c1c17) to mimic natural light.
- **The "Ghost Border" Fallback:** If a border is essential for accessibility, use the `outline-variant` token at **15% opacity**. Never use 100% opaque, high-contrast borders.
- **Tactile Depth:** Incorporate subtle paper textures (grain or fiber overlays) at 3% opacity on `surface` layers to enhance the premium feel.

---

## 5. Components

### Buttons
- **Primary:** `primary` (#324e58) background with `on-primary` text. Use a `DEFAULT` (0.25rem) or `md` (0.375rem) corner radius. Avoid "Pill" shapes for primary buttons to maintain a sophisticated, architectural feel.
- **Secondary:** `surface-container-high` background with `on-surface` text. No border.
- **Tertiary:** Text-only using `secondary` (#75584d). Use for low-priority actions like "Cancel" or "Save Draft."

### Inputs & Text Areas
- **Styling:** Use `surface-container-lowest` for the field background. Labels (`label-md`) should always be visible above the field, never as placeholder text. 
- **Focus State:** Transition the background to `surface-container-high` and use a "Ghost Border" of `primary` at 20% opacity.

### Cards & Lists
- **The "No-Divider" Rule:** Forbid the use of divider lines between list items. Instead, use vertical white space (32px+) or subtle background shifts between items.
- **Composition:** Cards should feel like physical objects. Use `surface-container-highest` for a card sitting on a `surface` background.

### Custom Component: The "Wax Seal" Chip
- Used for status indicators (e.g., "Sent," "Delivered"). These should use `secondary` (#75584d) with a `full` (9999px) roundedness and a very subtle inner shadow to mimic a wax seal imprint.

### Tooltips
- Use Glassmorphism (`surface` color at 80% opacity + blur). No hard shadows. Text should be `label-sm` in `on-surface`.

---

## 6. Do’s and Don’ts

### Do
- **Embrace Asymmetry:** Place "stamps" or "postmarks" (as decorative elements) slightly off-center to break the digital grid.
- **Prioritize Negative Space:** If a screen feels "busy," increase the padding. This system thrives on the luxury of space.
- **Use Tonal Transitions:** Shift from `surface` to `surface-container-low` to define different parts of a journey (e.g., from a list of letters to the writing desk).

### Don't
- **No Social Patterns:** Avoid "Like" hearts, "Streaks," or "Infinite Scroll." Interaction should be intentional (e.g., "Fold Letter," "Apply Stamp").
- **No High-Contrast Borders:** Never use a solid #000000 or high-opacity outline. It breaks the "soft paper" immersion.
- **No Aggressive Motion:** Animations should be slow and ease-in-out, mimicking the physical weight of paper and ink. Avoid "springy" or "bouncy" UI animations.
