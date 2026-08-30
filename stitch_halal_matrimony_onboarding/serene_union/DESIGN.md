---
name: Serene Union
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#42493e'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#4f6073'
  on-secondary: '#ffffff'
  secondary-container: '#d2e4fb'
  on-secondary-container: '#556679'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca730'
  on-tertiary-container: '#4f3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#d2e4fb'
  secondary-fixed-dim: '#b7c8de'
  on-secondary-fixed: '#0b1d2d'
  on-secondary-fixed-variant: '#38485a'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  stack-gap: 16px
  section-gap: 40px
  max-width: 480px
---

## Brand & Style

The design system is built upon a foundation of tranquility, intentionality, and respect. It caters to a demographic seeking meaningful, long-term connections within a faith-based context. The aesthetic merges **Modern Minimalism** with **Tactile / Skeuomorphic** hints to create a digital environment that feels as grounded and welcoming as a physical sanctuary.

The visual language avoids the frantic energy of typical "swipe" apps, instead utilizing heavy whitespace and a restricted, nature-inspired palette to encourage a slower, more deliberate user experience. The emotional response should be one of safety and quiet confidence.

## Colors

The palette is anchored in organic, earthen tones to evoke stability and growth. 

- **Primary (#2D5A27):** A deep, forest green used for primary actions, success states, and key brand moments. It represents life and tradition.
- **Secondary (#1A2B3C):** A scholarly navy used for secondary buttons, navigation, and deep contrast elements to provide a sense of authority and depth.
- **Tertiary (#D4AF37):** A muted gold reserved for delicate accents, such as verified badges or active tab indicators, signaling value without being "loud."
- **Neutral (#F9F7F2):** A warm cream "Sand" base that replaces pure white to reduce eye strain and provide a more premium, parchment-like feel.

## Typography

This design system employs a sophisticated typographic pairing to balance tradition with modern utility. 

**Playfair Display** is used for all headlines and display text. Its high-contrast serifs convey elegance and a "literary" quality. For mobile-specific onboarding screens, ensure `display-lg` is used sparingly to prevent overcrowding.

**Inter** handles all functional and long-form text. It provides exceptional legibility at small sizes, ensuring that user bios and instructional labels are easy to digest. Use `label-md` in all-caps for small category headers to introduce a subtle architectural rhythm to the layouts.

## Layout & Spacing

The design system follows a **Mobile-First Fluid** philosophy, specifically optimized for single-handed use during onboarding. 

- **Grid:** A 4-column fluid grid for mobile, expanding to a centered 12-column fixed grid (max-width 480px) for desktop preview to maintain the intimate feel of a mobile app.
- **Margins:** Generous 24px side margins ensure content doesn't feel cramped against the screen edges.
- **Rhythm:** An 8px base unit drives all spacing. Use "Section Gaps" (40px+) to separate distinct steps in the onboarding flow, such as moving from personal details to religious preferences.
- **Vertical Centering:** During onboarding, key questions should be vertically centered to focus the user's attention on one task at a time.

## Elevation & Depth

This design system avoids harsh dropshadows in favor of **Tonal Layers** and **Ambient Depth**. 

- **Surfaces:** Use subtle shifts in background color (e.g., a slightly darker cream #F2EFE9) to define input areas rather than heavy borders.
- **Shadows:** When necessary for interactivity (like floating action buttons), use extremely soft, diffused shadows: `0 12px 32px rgba(26, 43, 60, 0.05)`. The shadow should inherit a hint of the secondary Navy color to maintain palette harmony.
- **Depth:** Elements should feel like they are resting gently on a soft surface, not floating in a void.

## Shapes

The shape language is defined by **Soft Geometricism**. Sharp corners are eliminated to maintain the "warm and calm" narrative.

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Profile cards and modal sheets use a 1.5rem (24px) radius on top corners to create a "nested" and protected visual feel.
- **Icons:** Use thick-stroke (2px), rounded icons. Avoid thin, clinical iconography.

## Components

### Buttons
- **Primary:** Solid #2D5A27 with white text. High-padding (16px vertical) to feel substantial and "clickable."
- **Secondary:** Outlined in #1A2B3C with a 1px border. Used for "Skip" or "Back" actions.
- **Tertiary:** Text-only in #1A2B3C with a 60% opacity for low-priority actions.

### Input Fields
- Fields are "Floating Label" style to maximize vertical space. 
- Default state: Sand-toned background (#F2EFE9) with no border. 
- Focus state: 1px border of #2D5A27 with a soft green inner glow.

### Progress Indicators
- A horizontal bar at the top of the onboarding flow. 
- Use the Tertiary Gold (#D4AF37) for the filled state to symbolize the journey toward a valuable goal.

### Choice Chips
- For multi-select items (e.g., interests, languages). 
- Unselected: Light cream background. 
- Selected: Primary green background with white text and a subtle "check" icon.

### Cards
- Selection cards for "Intent" or "Lifestyle" questions should use high-quality, desaturated imagery or minimal botanical illustrations. Avoid stock photos of people where possible; prefer abstract representations of peace and companionship.