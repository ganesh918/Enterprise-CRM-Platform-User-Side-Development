# Nexus CRM — User Panel

Modern, responsive CRM **user panel** for employees, sales representatives, and managers. Built with React (JSX), Redux Toolkit, Tailwind CSS, and Recharts, aligned with the Nexus Admin CRM design system.

## Features

- **Authentication** — Login, signup, forgot password, OTP verification, reset password
- **Dashboard** — Assigned leads, customers, deals, tasks, and personal metrics (scoped by role)
- **Lead management** — Create, edit, status updates, follow-ups
- **Sales pipeline** — Kanban board with drag-and-drop stages
- **Customers** — Profiles, contact info, interaction history
- **Tasks** — Priorities, due dates, completion status
- **Activities** — Calls, meetings, emails, notes, follow-ups
- **Reports & analytics** — Conversion, revenue, tasks, activity charts (sales rep & manager)
- **Notifications** — Assignments, reminders, meetings, updates
- **Profile & settings** — Personal info, preferences, password change
- **Role-based access** — `employee`, `sales_rep`, `manager`

Sign in with **any valid email** and **any non-empty password** (optional signup stores profile details in the browser).

## Run the **User Panel** (not Admin)

| App | Folder | Default URL | Look for |
|-----|--------|-------------|----------|
| **User Panel** (this project) | `Enterprise CRM Platform – User Side Development` | **http://localhost:5310** | Green theme, **USER PANEL** badge, sidebar links: Reports, Notifications, Profile |
| Admin / Enterprise platform | `Enterprise CRM Platform` | http://localhost:5173 | Cyan/purple theme, title “Enterprise Platform”, no Reports/Notifications |

If you see the old admin UI, you are on the wrong port or folder. Stop other `npm run dev` tasks and run this project only:

```bash
cd "C:\Users\GaneshReddy\Desktop\Enterprise CRM Platform – User Side Development"
npm run dev
```

Then open **http://localhost:5310/login**.

## Deploy on Vercel

Use the **repository root** (this folder) as the Vercel project root.

| Setting | Value |
|---------|--------|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

This repo includes `vercel.json` so React Router paths (`/login`, `/leads`, etc.) rewrite to `index.html` instead of returning **404 NOT_FOUND**.

After GitHub is connected, redeploy **main**. Open your site at **`/`** or **`/login`**.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
```

## Stack

React 19, JSX (JavaScript), Redux Toolkit, React Router 7, Tailwind CSS 4, Recharts, Framer Motion, dnd-kit.
