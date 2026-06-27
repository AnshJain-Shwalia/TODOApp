# 🗺️ HTML & CSS Gentle Learning Roadmap

Welcome to your self-paced learning path! This plan is designed specifically for someone starting with **literally zero** experience in HTML and CSS. It breaks down complex styling and layout concepts into **18 bite-sized, progressive exercises** so you can learn without feeling overwhelmed.

---

## 📈 Learning Path Overview

- **Phase 1: HTML Text & Assets** (Exercises 1-2) — Learn markup syntax, text headings, links, and images.
- **Phase 2: CSS Styles & Box Model** (Exercises 3-7) — Selectors, colors, typography, margins, padding, rounded cards, and hover transitions.
- **Phase 3: Flexbox Alignments** (Exercises 8-10) — 1D flex container spacing, split column structures, responsive wrapping, and navbar layouts.
- **Phase 4: CSS Grid & Positioning** (Exercises 11-14) — 2D grids, column spanning, element positioning overrides (static, relative, absolute, fixed, sticky), and badging.
- **Phase 5: Advanced Fluid Layouts & Capstone** (Exercises 15-18) — Media-query-free auto-fitting grids, aspect ratios, image zoom hover transitions, native interactive HTML accordion FAQs, and a landing page capstone combining all skills.

---

## 📚 Detailed Exercise Plan

### 🟢 Phase 1: Raw HTML & Document Structure
Learn to structure words, load pictures, and link pages without worrying about layout.

#### 1. `01_html_text_tags` (Very Easy)
* **Goal**: Learn how tags wrap content to tell the browser what is a heading, paragraph, or list.
* **Concepts**: `<h1>` to `<h6>`, `<p>`, `<strong>` (bold), `<em>` (italic), `<ol>`, `<ul>`, `<li>`.
* **What to Google first**:
  - `"MDN Getting started with the Web HTML basics"`
  - `"HTML headings and paragraphs structure"`
  - `"HTML ordered and unordered lists tutorial"`
* **Prompt to ask me (AI)**:
  - `"Explain the basics of HTML text tags (headings, paragraphs, lists, bold/italic markup). Show a simple example of a text-only HTML structure, and explain the semantic difference between ordered and unordered lists."`
* **Exercise**: Create a basic reading log with a title, a paragraph review, and a list of three books.

#### 2. `02_html_links_images` (Very Easy)
* **Goal**: Connect pages to the web and import external resources.
* **Concepts**: `<a>` (anchors), `href`, `target="_blank"`, `<img>` (images), `src`, `alt` tags.
* **What to Google first**:
  - `"HTML anchor tag href target blank"`
  - `"HTML img tag src alt attribute"`
  - `"HTML relative vs absolute file paths"`
* **Prompt to ask me (AI)**:
  - `"How do I use HTML anchor links and images? Explain the 'href', 'target', 'src', and 'alt' attributes, and show me the difference between linking to an external website versus referencing a local image file."`
* **Exercise**: Add a vacation destination title, load an image of it, and link to its Wikipedia article.

---

### 🔵 Phase 2: CSS Styles & The Box Model
Connect a stylesheet, selector rules, colors, and space-control.

#### 3. `03_css_basics` (Very Easy)
* **Goal**: Link an external stylesheet and target elements.
* **Concepts**: `<link rel="stylesheet">`, element selectors, class selectors (`.class-name`), `color`, `background-color`.
* **What to Google first**:
  - `"How to link CSS to HTML file"`
  - `"CSS selectors MDN"`
  - `"CSS color and background-color properties"`
* **Prompt to ask me (AI)**:
  - `"Explain how to link an external CSS file to an HTML document. Show examples of element selectors vs class selectors, and how to change text colors and background colors using CSS."`
* **Exercise**: Style a basic HTML document to give headings and alert warnings different colors and backgrounds.

#### 4. `04_typography_page` (Easy)
* **Goal**: Control text sizing and center content wrappers to make pages comfortable to read.
* **Concepts**: `font-family`, `font-size`, `line-height`, `max-width`, `margin: 0 auto`.
* **What to Google first**:
  - `"CSS font-family and typography basics"`
  - `"CSS line-height and font-size for readability"`
  - `"How to center a div horizontally CSS margin auto"`
  - `"CSS max-width vs width properties"`
* **Prompt to ask me (AI)**:
  - `"Teach me CSS typography basics (font-family, font-size, line-height). Show me how to wrap text content in a centered container with a maximum width using margin auto so it is comfortable to read."`
* **Exercise**: Style a readable blog article limit to `650px` width so it doesn't stretch across widescreen displays.

#### 5. `05_box_model` (Easy)
* **Goal**: Master the layers of the CSS Box Model and learn how sizing works.
* **Concepts**: Padding (inside space), Border (boundary), Margin (outside space), `box-sizing: border-box`.
* **What to Google first**:
  - `"CSS Box Model MDN"`
  - `"Difference between padding border and margin in CSS"`
  - `"CSS box-sizing border-box explained"`
* **Prompt to ask me (AI)**:
  - `"Explain the CSS Box Model (margin, border, padding, content). Show why padding/borders can make elements wider than expected, and how using 'box-sizing: border-box' solves this."`
* **Exercise**: Style 3 different colored boxes to see how padding and borders expand element widths, and correct it using `border-box`.

#### 6. `06_business_card` (Easy)
* **Goal**: Combine typography and box model properties to build a standard UI component.
* **Concepts**: Cards, `border-radius` (rounded corners), `box-shadow` (elevation depth).
* **What to Google first**:
  - `"CSS border-radius property syntax"`
  - `"CSS box-shadow generator and syntax"`
  - `"How to style buttons in CSS"`
* **Prompt to ask me (AI)**:
  - `"Show me how to style a modern UI card component in CSS. Include rounded corners (border-radius) and a subtle drop shadow (box-shadow) to give it visual depth. Also show how to style a button inside the card."`
* **Exercise**: Create a modern personal business card containing a profile name, description, and primary message button.

#### 7. `07_profile_card` (Easy)
* **Goal**: Load custom web fonts and add interactive hover triggers.
* **Concepts**: Google Fonts import, circle avatar wrapping (`border-radius: 50%`, `object-fit: cover`), `:hover`, `transition`.
* **What to Google first**:
  - `"How to import and use Google Fonts in CSS"`
  - `"CSS crop image to circle border-radius 50 percent"`
  - `"CSS object-fit cover tutorial"`
  - `"CSS hover state and transitions"`
* **Prompt to ask me (AI)**:
  - `"How do I import custom Google Fonts into CSS, style a perfectly circular profile picture using 'border-radius: 50%' and 'object-fit: cover', and add a smooth hover zoom/glow transition effect?"`
* **Exercise**: Style an avatar profile card that floats upwards and glows slightly when the mouse hovers over it.

---

### 🟡 Phase 3: CSS Flexbox Layouts
Align elements horizontally and vertically in rows or columns.

#### 8. `08_flexbox_basics` (Easy)
* **Goal**: Turn block stacked elements into horizontal rows.
* **Concepts**: `display: flex`, `flex-direction`, `justify-content` (main axis), `align-items` (cross axis), `gap`.
* **What to Google first**:
  - `"A Complete Guide to Flexbox CSS-Tricks"`
  - `"CSS flexbox justify-content and align-items differences"`
  - `"CSS flex gap property"`
* **Prompt to ask me (AI)**:
  - `"Give me a crash course on CSS Flexbox. Explain display flex, main axis alignment (justify-content), cross axis alignment (align-items), and container spacing using flex gap."`
* **Exercise**: Align three simple colored squares side-by-side, spaced out, and vertically centered in a dashboard container.

#### 9. `09_feature_card` (Moderate)
* **Goal**: Build a side-by-side container and stack it vertically on mobile devices.
* **Concepts**: Split columns (`flex-basis`), Media Queries (`@media`), responsive column stacking.
* **What to Google first**:
  - `"CSS flex-wrap and flex-basis properties"`
  - `"CSS Media Queries beginners guide"`
  - `"Responsive design mobile first CSS layout"`
* **Prompt to ask me (AI)**:
  - `"How do I build a responsive side-by-side feature card using Flexbox? Explain flex-basis, flex-wrap, and show a media query example that stacks the columns vertically on mobile devices."`
* **Exercise**: Design a feature highlight block showing a picture on the left and description text on the right on desktop, stacking on mobile.

#### 10. `10_nav_bar` (Moderate)
* **Goal**: Build a standard website header navigation bar.
* **Concepts**: Header alignment (`justify-content: space-between`), list styling resets, nav-link click interactions.
* **What to Google first**:
  - `"How to create a navigation bar using Flexbox"`
  - `"CSS reset margin padding list-style"`
  - `"CSS remove underline link text-decoration none"`
* **Prompt to ask me (AI)**:
  - `"Show me how to design a modern, responsive website navigation header using CSS Flexbox. Explain how to align the logo left, links center, and button right, and reset default list styles."`
* **Exercise**: Style a navbar displaying a logo on the left, horizontal text links in the center, and a pill-shaped button on the right.

---

### 🟣 Phase 4: CSS Grid & Absolute Positionings
Create multi-column grid layouts and float elements out of the normal layout flow.

#### 11. `11_css_grid` (Moderate)
* **Goal**: Arrange items into rows and columns simultaneously.
* **Concepts**: `display: grid`, columns (`grid-template-columns`), fractional units (`1fr`), `gap`.
* **What to Google first**:
  - `"A Complete Guide to CSS Grid CSS-Tricks"`
  - `"CSS Grid fr fractional unit explained"`
  - `"CSS grid gap vs margin"`
* **Prompt to ask me (AI)**:
  - `"Give me a beginner's guide to CSS Grid. Explain display grid, how to define columns using fractional units (1fr), and how to set up spacing using grid gaps."`
* **Exercise**: Style six block items into a clean 3-column, 2-row layout grid.

#### 12. `12_testimonials_grid` (Moderate)
* **Goal**: Learn how to span items across multiple grid rows or columns.
* **Concepts**: Column spans (`grid-column: span 2`), card highlighting, responsive column collapse.
* **What to Google first**:
  - `"CSS Grid grid-column span and grid-row span"`
  - `"CSS grid-template-areas vs grid-column"`
  - `"Responsive grid grid-column-span mobile"`
* **Prompt to ask me (AI)**:
  - `"How do I make grid items span multiple rows or columns in CSS Grid? Show me an example using 'grid-column: span' to highlight a primary testimonial card in a review grid."`
* **Exercise**: Create a testimonial review grid where a primary customer quote spans twice the width of the other cards.

#### 13. `13_positioning` (Moderate)
* **Goal**: Break elements out of the normal layout flow to stick to specific screen positions.
* **Concepts**: `position: static`, `position: relative`, `position: absolute`, `position: fixed`, `position: sticky`.
* **What to Google first**:
  - `"CSS layout position properties static relative absolute fixed sticky"`
  - `"CSS position absolute relative parent container"`
  - `"CSS z-index and stacking context"`
* **Prompt to ask me (AI)**:
  - `"Explain the differences between CSS position static, relative, absolute, fixed, and sticky. Provide code examples showing when and how to use each positioning type."`
* **Exercise**: Lock a header to the top of the browser screen, float a "Back to Top" button in the corner, and stick a widget inside the sidebar.

#### 14. `14_pricing_card` (Moderate)
* **Goal**: Lock badges over elements.
* **Concepts**: Absolute-positioned elements overlaying relative parent containers.
* **What to Google first**:
  - `"How to overlay a badge on top of a card CSS"`
  - `"CSS absolute positioning negative top coordinates"`
* **Prompt to ask me (AI)**:
  - `"Show me how to overlap a 'Popular' or 'Sale' badge on top of a pricing card using relative and absolute positioning in CSS. Explain how coordinates work relative to the parent card."`
* **Exercise**: Style a subscription tier pricing card featuring a "Popular" badge overlapping the card's top border.

---

### 🔴 Phase 5: Advanced Fluid Layouts & Capstone
Master advanced responsive layouts and combine all styling assets.

#### 15. `15_grid_autofit` (Harder)
* **Goal**: Build fully responsive grid columns that wrap automatically without using media queries.
* **Concepts**: `repeat(auto-fit, minmax(width, 1fr))`.
* **What to Google first**:
  - `"CSS grid repeat auto-fit auto-fill differences"`
  - `"CSS grid minmax function explained"`
  - `"Responsive grid without media queries auto-fit"`
* **Prompt to ask me (AI)**:
  - `"Explain how to use CSS Grid 'repeat(auto-fit, minmax(...))' to create a fully responsive, self-wrapping layout grid that adapts to any screen size without using a single media query."`
* **Exercise**: Arrange features cards so they wrap dynamically from 4 columns to 1 column based on window size.

#### 16. `16_photo_gallery` (Harder)
* **Goal**: Create responsive square photo widgets.
* **Concepts**: Aspect ratio locking (`aspect-ratio: 1 / 1`), image fit containments, overflow zoom actions.
* **What to Google first**:
  - `"CSS aspect-ratio property MDN"`
  - `"CSS hover zoom effect overflow hidden"`
  - `"CSS transform scale transition duration"`
* **Prompt to ask me (AI)**:
  - `"How do I build a modern photo gallery using CSS 'aspect-ratio: 1/1'? Show me how to zoom the images on hover using transition and overflow hidden without resizing the grid cell."`
* **Exercise**: Style an 8-item fluid image gallery featuring pictures that zoom in slowly when hovered.

#### 17. `17_details_accordion` (Harder)
* **Goal**: Code interactive open/close components without writing any JavaScript.
* **Concepts**: `<details>`, `<summary>` elements, custom caret indicators, state matching (`details[open]`).
* **What to Google first**:
  - `"HTML details and summary tags MDN"`
  - `"How to style HTML details and summary element transition"`
  - `"CSS style details open state details[open]"`
  - `"CSS remove or customize details summary default arrow"`
* **Prompt to ask me (AI)**:
  - `"How can I build an interactive accordion (like an FAQ list) using only HTML '<details>' and '<summary>' elements? Show me how to style the open state and customize or rotate the expansion caret using CSS."`
* **Exercise**: Style an FAQ accordion block where clicking a question rotates a icon and expands the answer panel.

#### 18. `18_mini_landing` (Intermediate)
* **Goal**: Combine all HTML & CSS concepts into a single complete landing page.
* **Concepts**: CSS Custom Variables (`--primary-color`), navbar headers, split hero layouts, auto-grid cards, footers.
* **What to Google first**:
  - `"CSS variables custom properties tutorial"`
  - `"HTML CSS landing page step by step"`
  - `"CSS layout template architecture best practices"`
* **Prompt to ask me (AI)**:
  - `"Guide me through building a complete landing page using modern HTML and CSS. Show how to set up global design tokens using CSS variables, structure the layout, and establish a clean styling system."`
* **Exercise**: Build a landing page for a mobile application from scratch using your design guidelines.
