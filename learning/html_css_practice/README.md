# 🎨 HTML & CSS Practice Projects (No JS, No Forms)

Welcome! To help you solidify your HTML and CSS foundations (without any forms or JavaScript), we have created three projects in the `learning/html_css_practice/` directory.

These projects focus purely on **semantic HTML layout**, **Flexbox**, **CSS Grid**, **typography**, **modern aesthetics (glassmorphism, dark mode, gradients)**, and **responsive media queries**.

Here is the index of the projects we set up for you:

---

## 📂 Projects Overview

### 1. 💼 Personal Link-in-Bio / Mini-Portfolio (`learning/html_css_practice/01_portfolio/`)
* **Focus**: Flexbox, Hover Micro-animations, CSS Variables, Glassmorphism.
* **Goal**: Build a gorgeous single-page profile/link tree with custom avatar images, social links, and bio cards.
* **Concepts practiced**: `border-radius`, flex-direction, custom properties, transition effects, `:hover` pseudo-class.

### 2. ⚡ Feature Pricing Grid (`learning/html_css_practice/02_pricing_grid/`)
* **Focus**: CSS Grid, Card Layouts, Responsive Design (`@media` queries), Typography.
* **Goal**: Build a premium 3-column pricing or feature grid that stacks vertically on mobile screens.
* **Concepts practiced**: `grid-template-columns`, `gap`, `box-shadow`, gradients, mobile-first responsiveness.

### 3. 📖 Typography-First Recipe / Article Page (`learning/html_css_practice/03_article_page/`)
* **Focus**: Typography hierarchy, spacing (the box model), CSS nesting, custom scrollbars, and image layout.
* **Goal**: Build an elegant, highly readable blog post or recipe page.
* **Concepts practiced**: `line-height`, `letter-spacing`, margin collapsing, block vs inline, styling sub-headings, and list layouts.

---

## 🚀 How to Run & Practice

To view any of these pages, you can simply open the corresponding `index.html` file directly in your browser. 

Alternatively, you can run a simple local server in this directory:
```bash
# Start a simple web server
npx -y http-server ./learning/html_css_practice -p 8080
```
Then navigate to `http://localhost:8080` in your web browser.

---

## 🎯 Challenges for You in Each Project:
* **Project 1**: Change the primary color theme to a subtle neon purple or ocean blue.
* **Project 2**: Add a "Popular" tag badge to the middle card that overlaps the border using `position: absolute`.
* **Project 3**: Customize the font family by importing a Google Font (like *Outfit* or *Playfair Display*) in the `<head>` of `index.html`.
