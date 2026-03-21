---
name: ui-mockup
description: Create interactive UI mockups as self-contained HTML files using React 18 + Tailwind CSS (via CDN). Generate clickable prototypes with state management and realistic mock data. Output mockups to `.claude/design/mockups/`.
---

# UI Mockup Skill

## Approach

Generate mockups as **single self-contained HTML files** using:
- React 18 (via CDN)
- Tailwind CSS (via CDN)
- Babel standalone (for JSX in browser)

No build tools, no npm — opens directly in any browser.

## Design System

### Colors (Neutral Professional)

- **Primary:** blue-600 / blue-700 (hover)
- **Success:** green-600
- **Warning:** amber-500
- **Error:** red-600
- **Background:** gray-50
- **Surface:** white
- **Text:** gray-900 (primary), gray-500 (secondary)
- **Border:** gray-200

### Typography & Spacing

- **Headings:** text-2xl font-bold text-gray-900
- **Subheads:** text-lg font-semibold text-gray-700
- **Body:** text-sm text-gray-600
- **Spacing:** Use Tailwind's 4px scale (p-1 = 4px, p-2 = 8px, p-4 = 16px, etc.)

## Page Template

See `templates/page-template.html` for the required HTML structure with React setup.

## Mockup Checklist

- [ ] Realistic mock data (names, dates, amounts that make sense)
- [ ] Interactive state (buttons, tabs, forms respond to clicks)
- [ ] Loading state shown where data would be fetched
- [ ] Empty state for lists with no items
- [ ] Error state for failed operations
- [ ] Responsive (works on mobile via Tailwind breakpoints)
- [ ] Consistent with design system above
- [ ] Navigation between screens (even if via state toggle)

## Gotchas

1. **Mock data too generic** — "John Doe", "test@example.com", "Lorem ipsum" make mockups feel fake. Use real names, actual domains (example.com is fine), and plausible data that matches the domain (e.g., "$2,500.50" for order totals, "2026-03-21" for dates, not "$1" or "date").
2. **Missing error/loading states** — A mockup showing only the happy path doesn't guide implementation. Always show: loading spinner while fetching, empty state when no items, error message for failures, and success confirmation after actions.
3. **Interactive state not persisted** — If clicking a button doesn't change the UI visually, developers won't understand the interaction. Use `useState` to toggle states, show different content for each interaction path.
4. **CDN links die or change versions** — If a React or Tailwind CDN URL is old or wrong, the mockup won't load. Always verify CDN links work before delivering the mockup.
5. **Responsive design only desktop** — A mockup that only looks good at 1920px doesn't guide mobile development. Test Tailwind breakpoints (md:, lg:) to ensure it works on phone and tablet sizes.
6. **Component library inconsistency** — If one button is text-sm and another is text-lg, or one input has focus ring and another doesn't, implementers will guess at consistency. Define and use a component snippet library consistently throughout the mockup.
