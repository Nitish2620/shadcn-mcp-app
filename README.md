# 🎨 Custom Component Registry & MCP Server

> A production-grade, MNC-standard custom React component library and registry powered by **Vite**, **TypeScript**, **Tailwind CSS v4**, and the **shadcn MCP Server**.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![shadcn/ui](https://img.shields.io/badge/shadcn-compatible-black.svg)](https://ui.shadcn.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## 📁 Organized Repository Structure

```
shadcn-mcp-app/
├── public/
│   └── r/                             <-- REGISTRY SPECIFICATION FILES
│       ├── registry.json              <-- Master list of all components
│       └── social-post-card.json       <-- 1-Command CLI installer spec
│
├── src/
│   └── components/                    <-- SOURCE CODE ORGANIZED BY CATEGORY
│       └── social/                    <-- Category: Social & Feed
│           ├── SocialPostCard.tsx
│           └── types.ts
│
├── components.json                    <-- shadcn MCP Registry Config
├── README.md                          <-- Project Documentation
└── package.json
```

---

## 🧩 Component Catalog

| Component | Category | Description | 1-Command Installation |
| :--- | :---: | :--- | :--- |
| **Social Post Card** | `Social & Feed` | MNC-grade feed card with multi-reaction bar, right-side discussion panel, audio voice note player, and lightbox. | `npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/social-post-card.json"` |

---

## 🚀 How Developers Can Use This Registry

### Option 1: 1-Command CLI Install (Recommended)

Run this command inside any React / Next.js / Vite project:

```bash
npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/social-post-card.json"
```

### Option 2: AI Assistant Prompt (Claude Code, Cursor, VS Code)

If your project is configured with `components.json`, simply ask your AI assistant:

> *"Add the social-post-card component from Nitish2620 registry to my project"*

---

## 📁 How to Add New Components Cleanly

When adding a new component to this repository:

1. Create a category subfolder: `src/components/<category>/<ComponentName>.tsx`
2. Create its registry JSON: `public/r/<component-name>.json`
3. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add <component-name> component"
   git push origin main
   ```

---

## 📄 License
[MIT](LICENSE) © Nitish Yadav
