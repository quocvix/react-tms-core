# AGENTS.md

# Frontend AI Development Guidelines (react-tms-core)

## Purpose

You are an AI coding assistant working on this React 19 / Vite repository (`react-tms-core`).

Your goal is to deliver the smallest correct change while preserving the existing architecture, coding style, and project conventions.

When in doubt, prefer consistency over creativity.

---

# Tech Stack & Architecture Overview

* **Core Framework**: React 19 (`react`, `react-dom`) + Vite 7 + TypeScript 5.8
* **Routing**: React Router v7 (`react-router-dom`) with `createBrowserRouter` in `src/routes/index.tsx`
* **State Management**:
  * **Global State**: Zustand (`src/stores/` e.g., `useAuthStore`, `useLanguageStore`, `useThemeStore`)
  * **Server State**: TanStack React Query v5 (`@tanstack/react-query`) with custom cache options
* **API / HTTP Layer**: Axios instance (`src/lib/axios.ts`) configured with `VITE_API_URL`, request interceptor for Bearer token, and response interceptor for 401/403 auth clearing.
* **Forms & Validation**: React Hook Form + Zod schema validation via `@hookform/resolvers/zod`
* **UI & Styling**:
  * Tailwind CSS v4 (`@tailwindcss/vite`) + `tailwind-merge` (`cn` utility in `src/lib/utils.ts`)
  * Radix UI primitives (`radix-ui`) & Shadcn UI components (`src/components/ui/`)
  * Ant Design (`antd`) table components (`src/components/table/antd-table.tsx`)
  * Toast notifications via `sonner`
  * Internationalization via `i18next` / `react-i18next`

---

# Folder Structure Conventions

```
src/
├── assets/          # Static assets & images
├── bones/           # Boneyard / skeleton loader elements
├── components/      # Reusable UI components
│   ├── auth/        # Auth guard & wrapper components
│   ├── header/      # Header navigation bar
│   ├── pagination/  # Custom pagination controls
│   ├── search-box/  # Search filter inputs
│   ├── select-box/  # SelectBox dropdowns
│   ├── sidebar/     # Main navigation sidebar
│   ├── table/       # Antd table wrappers & action bars
│   └── ui/          # Shadcn / Radix primitives (Button, Input, Card, Tabs, Field, Dialog)
├── hooks/           # Custom React hooks
├── lib/             # Axios instance (`axios.ts`), API route paths (`api.ts`), utils (`utils.ts`), i18n
├── locales/         # i18n translation JSON dictionaries
├── pages/           # Route page components (Layout.tsx, admin/, dashboard/, user/, etc.)
├── routes/          # React Router definitions (`index.tsx`)
├── services/        # API service methods (`userService.ts`, `hubService.ts`, `permissionService.ts`)
├── stores/          # Zustand global stores (`useAuthStore.ts`, `useLanguageStore.ts`)
├── types/           # Shared TypeScript interfaces & types
└── App.tsx / main.tsx
```

---

# Before Editing Code

Before making any code changes:

* If the CodeGraph index is missing or outdated, run `codegraph sync`.
* Use CodeGraph to understand related files, dependencies, callers, and potential impact.
* Inspect the relevant route, page, component, service, API endpoint, model, and types before modifying code.
* For bug fixes, identify the root cause before implementing a solution.
* For shared code (e.g. `src/services/`, `src/components/ui/`), review downstream usages before making changes.

---

# Thinking Process

Never guess.

* State assumptions explicitly.
* If multiple valid interpretations exist, present them instead of silently choosing one.
* If requirements are unclear, ask for clarification.
* Prefer the simplest solution that satisfies the request.

---

# Keep It Simple & Surgical

Modify only the code required for the task.

Avoid:
* unnecessary abstractions
* speculative features
* over-engineering
* premature optimization
* unnecessary configuration

Do NOT:
* refactor unrelated code or adjacent formatting
* rename files without clear reason
* introduce new architectural patterns or new state libraries

Remove only unused code introduced by your own changes.

---

# Project-Specific Code Conventions

### React & Component Conventions
* **Imports**: Import React hooks directly from `"react"` (`import { useState, useEffect, useMemo } from "react"`). Do NOT prefix with `React.useState` or `React.useEffect`.
* **Component Typing**: Use `React.FC<PropsType>` for functional component declarations.
* **Path Alias**: Always use the `@/` alias for imports originating from `src/` (e.g., `import { Button } from "@/components/ui/button"`).

### Data Fetching & Service Layer
* Place all API request functions inside `src/services/<domain>Service.ts` exported as an object literal (e.g., `const userService = { getUsers: ..., getUserById: ... }; export default userService;`).
* Consume API services in components exclusively via TanStack React Query (`useQuery`, `useMutation`).
* Avoid duplicate manual `axios` or service calls in `useEffect` when `useQuery` is already managing the data.

### Forms & Validation
* Form state is managed with `react-hook-form` + `zod`.
* Define form schema using `z.object({...})` and export `type FormValues = z.infer<typeof formSchema>`.
* Use `<Field>`, `<Label>`, and `<FieldError>` from `@/components/ui/field` for input layouts.

### UI & Styling
* Use Tailwind CSS utility classes and `cn()` from `@/lib/utils` for conditional class joining.
* Preserve relative/absolute layout hierarchy when working with tabs or nested containers (e.g., ensure `<Tabs className="w-full relative">` is relative if child tabs position absolute controls).
* **Lucide Icons**: Do NOT add hardcoded sizing/spacing classes like `mr-2 h-4 w-4` to Lucide icons. Pass `<Icon />` or `<Icon className="" />` (or only animation classes like `animate-spin` when needed).

---

# Success Criteria

Before finishing, verify:

* The implementation solves the requested problem.
* Code builds cleanly without TypeScript or ESLint errors (`npm run build`).
* Existing behavior remains unchanged unless requested.
* The solution strictly adheres to project architecture and existing patterns.
* No unnecessary files or dependencies were introduced.

---

# Never Do

* Invent APIs or data models.
* Rewrite project architecture or introduce unapproved external libraries.
* Add duplicate API calls inside `useEffect` when `useQuery` is used.
* Modify unrelated code or formatting.
* Over-engineer simple problems.
* Hide uncertainty — ask when clarification is needed.