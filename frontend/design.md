---
name: Komorebi Gift Atelier
colors:
  surface: '#141315'
  surface-dim: '#141315'
  surface-bright: '#3a393b'
  surface-container-lowest: '#0f0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2b292c'
  surface-container-highest: '#363436'
  on-surface: '#e6e1e4'
  on-surface-variant: '#dac2b1'
  inverse-surface: '#e6e1e4'
  inverse-on-surface: '#313032'
  outline: '#a28d7d'
  outline-variant: '#544336'
  surface-tint: '#ffb77a'
  primary: '#ffb77a'
  on-primary: '#4c2700'
  primary-container: '#e98b2c'
  on-primary-container: '#582e00'
  inverse-primary: '#8f4e00'
  secondary: '#ffaeda'
  on-secondary: '#541a3f'
  secondary-container: '#6f3157'
  on-secondary-container: '#ec9dc8'
  tertiary: '#85d3dc'
  on-tertiary: '#00363b'
  tertiary-container: '#60aeb7'
  on-tertiary-container: '#003f45'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc2'
  primary-fixed-dim: '#ffb77a'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6d3a00'
  secondary-fixed: '#ffd8ea'
  secondary-fixed-dim: '#ffaeda'
  on-secondary-fixed: '#3a0329'
  on-secondary-fixed-variant: '#6f3157'
  tertiary-fixed: '#a1eff8'
  tertiary-fixed-dim: '#85d3dc'
  on-tertiary-fixed: '#002023'
  on-tertiary-fixed-variant: '#004f55'
  background: '#141315'
  on-background: '#e6e1e4'
  surface-variant: '#363436'
typography:
  display-lg:
    fontFamily: Fredoka
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system establishes a "Luxury Kawaii" aesthetic, blending the playful charm of Japanese gift culture with the sophisticated atmosphere of a high-end Tokyo boutique. The visual direction is deeply inspired by the reference image—a warm, dimly lit sanctuary that balances dark architectural tones with glowing accents.

The style is a hybrid of **Modern Corporate** and **Glassmorphism**, enriched by tactile organic elements. It targets collectors who appreciate quality and "cuteness" as an art form. The emotional response should be one of "Komorebi" (sunlight filtering through trees)—warm, safe, and quietly magical. Surfaces are dark and matte, punctuated by glowing amber interactions and soft, frosted glass overlays that mimic delicate paper screens or translucent resins.

## Colors

The palette is anchored in a deep charcoal base to create a high-end, gallery-like backdrop. 

- **Charcoal (#1C1B1D):** The primary canvas, used for backgrounds and structural elements.
- **Warm Amber (#E98B2C):** Represents the "glow" of the boutique. Used for primary calls-to-action, active states, and "lit" highlights.
- **Cream (#F7F3EE):** The primary text and iconography color, providing high legibility without the harshness of pure white.
- **Pastel Pink & Sky Blue:** Used sparingly as accent highlights for categories, badges, or "soft" decorative elements to maintain the kawaii identity.
- **Surface Overlays:** Use semi-transparent variants of the charcoal base with a blur effect to create glassmorphic depth.

## Typography

The typographic hierarchy balances playfulness with clinical precision. 

- **Fredoka** is reserved strictly for branding, large display quotes, or specific "kawaii" callouts to maintain a friendly personality. 
- **Poppins** provides a clean, geometric structure for headers, echoing the modern boutique vibe. 
- **Inter** handles the heavy lifting for body copy and product descriptions, ensuring maximum readability on dark backgrounds. 
- **Be Vietnam Pro** is utilized for metadata and labels, offering a contemporary, slightly more casual feel to micro-copy. 

For accessibility on dark backgrounds, body text uses the Cream (#F7F3EE) color with a slightly increased line-height to prevent "bleeding" of characters.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with generous margins to evoke a sense of luxury and space. 

- **Desktop:** A 12-column grid with 64px side margins. Content is often centered or offset to create an editorial feel.
- **Mobile:** A 4-column grid with 16px margins. 
- **Rhythm:** Spacing follows a 4px/8px baseline. Use `lg` and `xl` spacing between sections to allow the dark theme to "breathe" and prevent the UI from feeling cluttered.

Product grids should utilize asymmetrical layouts occasionally to mimic the curated shelf-arrangement seen in the reference boutique.

## Elevation & Depth

This design system uses a combination of **Glassmorphism** and **Tonal Layers** to create a multi-dimensional environment.

- **The Base:** The Charcoal (#1C1B1D) background represents the floor/walls.
- **The Shelves:** Surface containers use a slightly lighter charcoal with a subtle wooden grain texture overlay (low opacity) to ground the design.
- **Floating Glass:** Modals, navigation bars, and certain cards use a backdrop filter (blur: 16px) with a semi-transparent cream border (0.5px) to simulate premium frosted glass.
- **The Glow:** Shadows are not neutral; they are "Ambient Glows." Elements elevated near Amber accents should cast a soft, low-opacity Amber shadow to simulate reflected light.

## Shapes

The shape language is "Softly Geometric." A consistent **16px (rounded-lg)** corner radius is applied to all primary containers, buttons, and product images to maintain the kawaii approachability. 

- **Standard Elements:** 8px (0.5rem) for small inputs and tags.
- **Main Cards/Modals:** 16px (1rem) for a friendly yet structured feel.
- **Interactive States:** Buttons can subtly transition to a slightly higher roundedness on hover to feel more "squishy" and interactive.

## Components

### Buttons
- **Primary:** Warm Amber background, charcoal text, 16px rounded corners. It should have a subtle inner glow.
- **Secondary:** Frosted glass effect with a thin Cream border and Cream text.
- **Icon Buttons:** Circular or highly rounded, using Sky Blue or Pastel Pink for secondary interactions (like "Wishlist").

### Cards
Product cards feature a "Shelf" style. The image container has a 16px radius, sitting on a slightly lighter charcoal background. Price labels should glow in Amber when hovered.

### Input Fields
Darker charcoal backgrounds with 1px Cream borders at 20% opacity. On focus, the border transitions to Warm Amber with a soft outer glow.

### Chips & Badges
Small, pill-shaped elements using the Pastel Pink and Sky Blue palette with low-opacity backgrounds (15%) and high-saturation text to indicate categories or "New" status.

### Navigation
The top bar is a persistent glassmorphic element. It uses a 20px blur and a 10% opacity Cream fill to ensure it remains distinct as users scroll over product images.