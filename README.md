# QuickTodo - Modern Todo Application

## About group

|---|---|
| **Group Name** | The Baka |
| **Project Name** | QuickTodo |
| **GitHub Repository** | https://github.com/hothong3k/QuickTodo |
| **Video Demo** | https://drive.google.com/file/d/14TlHNwooYsrzDmoyMJQ6pkaVOBkVX0dY/view?usp=sharing |
| **Submit Date** | 27/05/2026 |

## Project Overview
QuickTodo is a modern task management application (Todo List), focusing on smooth user experience, refined interface, and high performance. The application is designed to be minimalist, requiring no app downloads, suitable for personal use or feature demos. Users can either use some basic features when they are Guest, or logged in to use more advance features (add description, subtasks, due-date).

**Tech stack:**

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, next-themes, Zustand (localStorage), lucide-react |
| Backend | Next.js App Router, Server Actions, Route Handlers, NextAuth.js |
| Database | MongoDB, Mongoose |
| Deploy | Vercel |

**Main features:**

- Make todo quickly and level it by 4 stage ( 1 - important - to 4 - not important - )
- Quick filter todos by level
- Add description to todos
- Add due date to todos, deadline tags when set
- Add subtasks to todos, notify when all subtasks are done

![Make quick todo and set level](public/feature-1.png)
![Level Filter](public/feature-2.png)
![Add description, due date, deadline tags, subtasks](public/feature-5.png)

## System Installation and Deployment Guide

**System Requirements:**
- Node.js 22 or higher.
- A MongoDB account (Atlas) or a locally running MongoDB.

**Installation**
1.  **Clone repository**:
    ```bash
    git clone <repository-url>
    cd quicktodo
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment configuration**:
    Create a `.env` file in the root directory and add the `DATABASE_URL` variable.

    **For MongoDB Atlas (Cloud):**
    ```env
    DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/todoDB?retryWrites=true&w=majority"
    ```

    **For Local MongoDB:**
    If you are running MongoDB locally (standard installation):
    ```env
    DATABASE_URL="mongodb://localhost:27017/todoDB"
    ```

    **For Local MongoDB (Docker):**
    If you are using MongoDB with Docker:
    ```env
    DATABASE_URL="mongodb://root:password@localhost:27017/todoDB?authSource=admin"
    ```
4.  **Initialize Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

**Running the Application**

To run the application in development mode:

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```

Open [http://localhost:3000] in your browser to experience it.

To build the project for a production environment:

```bash
# npm
npm run build
npm start

# yarn
yarn build
yarn start

# pnpm
pnpm build
pnpm start
```

**Deployment**
The application can be easily deployed on platforms like Vercel:
1. Connect the repository with Vercel.
2. Add the `DATABASE_URL` environment variable.
3. Vercel will automatically build and deploy the application.

---

## Task 1 — Project Planning & Teamwork

### (a) Roles

Group has only one member - Duy Thống, who is in charge for: Frontend - Backend - Database - Deploy

### (b) Wireframe

- **Tool used:** Figma Make
- **Page designed:**
  - [x] Homepage
  - [x] About
  - [x] Todo
  - [x] My Account

![Home page design](<public/design-1.png>)
![About page design](public/design-2.png)
![Todo page design](public/design-3.png)
![My Account design](public/design-4.png)

### (c) Project Plan

**Milestones:**

| Milestone | Deadline | State |
|---|---|---|
| Complete Design | 02/05 | Completed, right on time
| Setup GitHub & database schema | 08/05 | Completed, right on time
| Complete Frontend | 08/05 | Completed, right on time
| Complete Backend | 08/05 | Completed, right on time
| Add some features | 16/05 | Completed, right on time
| Optimization & peer review | 17/05 | Ongoing
| Submit | 22/05 | Ongoing |

### (d) GitHub Repository

- **Repository link:** (https://github.com/hothong3k/QuickTodo)

### (e) Working process on Github

The project uses a GitHub Issue-based workflow so every change has a clear purpose and can be reviewed before being merged.

**Workflow:**

1. Create a GitHub Issue for each feature, bug fix, documentation update, or improvement.
2. Create a new branch from the issue, using a short branch name that matches the work scope.
3. Implement the changes locally and commit them with the Gitmoji + Conventional Commits format.
4. Push the branch to the remote repository.
5. Open a Pull Request from the issue branch into the main branch.
6. Review the Pull Request, check file changes, and resolve merge conflicts if GitHub reports any.
7. Merge the Pull Request after the changes are confirmed and the branch has no conflicts.

**Commit convention:**

Commit messages follow the Conventional Commits format with Gitmoji:

```txt
<emoji> <type>(<scope>): <description>
```

- The commit type describes the purpose of the change, such as `feat`, `fix`, `docs`, `refactor`, `style`, `build`, `chore`, or `test`.
- The scope is written in English and identifies the affected area, such as `todo`, `auth`, `deps`, `README`, or `ui`.
- The description is written in English, uses imperative mood, does not start with a capital letter, and does not end with a period.
- When a commit completes or relates to a GitHub Issue, the commit body or footer references it with `Closes #issue-number`, `Fixes #issue-number`, `Resolves #issue-number`, or `References #issue-number`.

**Pull Request workflow:**

- Each Pull Request is linked to the related GitHub Issue.
- The Pull Request description summarizes what changed and why the change was needed.
- Before merging, GitHub is used to check whether the branch has conflicts with the target branch.
- If conflicts exist, they are resolved on the issue branch, pushed again to remote, and rechecked in the Pull Request.
- After the Pull Request is clean and the changes are reviewed, it is merged into the main branch.

```
✨ feat(api): add user registration endpoint
♻️ refactor(todo): update todoform to accept handler props
🏗️ build(deps): update lockfile for vercel deployment fix
💄 style(contact): update contact page presentation
📝 docs(assets): add mobile responsive screenshot
```
![Commit messages](public/commit-messages.png)
---

## Task 2 — Implement User Interface

### (a) Pages built

The website is built with the Next.js App Router. Each route has a focused role in the user flow, from introducing the product to managing todos and authentication.

| Page | URL / Route | Description
|---|---|---|
| Home | `/` | Landing page with QuickTodo introduction, main call-to-action buttons, feature cards, and a short usage guide.
| Contact | `/contact` | Personal/about page with avatar, email, GitHub, LinkedIn, and navigation back to Home or Todo.
| Todo | `/todo` | Main task management page. Guests use local browser storage, while logged-in users load and sync todos from MongoDB.
| Sign in | `/auth/signin` | Login page with credentials login, Google login, password visibility toggle, loading state, and validation messages.
| Register | `/auth/register` | Account registration page with name, email, password validation, password visibility toggle, and auto-login after successful registration.
| My Account | `/profile` | Basic account management for account type, name, email, edit information and change password

**Main UI screenshots:**

![Home](public/Home.png)
![Contact](public/Contact.png)
![Todo](public/Todo.png)
![Sign in](public/Signin.png)
![Register](public/Register.png)
![My Account](public/Myaccount.png)

### (b) Tailwind CSS

Tailwind CSS is integrated through `src/app/globals.css` with `@import "tailwindcss";`. The project uses Tailwind utility classes directly in React components to build layouts, spacing, typography, cards, buttons, forms, hover states, and responsive behavior.

The design also uses CSS variables for theme tokens:

- `--background`, `--foreground`, `--card-bg`, `--card-border`, `--muted`, `--muted-foreground`, and `--title` are defined in `:root`.
- The `.dark` class overrides these variables for dark mode.
- Tailwind classes such as `bg-[var(--background)]`, `text-[var(--foreground)]`, and `border-[var(--card-border)]` keep components consistent across light and dark themes.

**Main Tailwind usage in the project:**

- Responsive layouts: `flex`, `grid`, `grid-cols-1`, `md:grid-cols-3`, `sm:flex-row`, `lg:hidden`, `hidden lg:block`.
- Page containers: `mx-auto`, `max-w-2xl`, `max-w-4xl`, `px-4`, `py-12`, `pt-24`, `pb-16`.
- Cards and panels: `rounded-xl`, `rounded-2xl`, `border`, `shadow-sm`, `shadow-xl`, `bg-[var(--card-bg)]`.
- Form styling: `h-12`, `h-14`, `pl-10`, `pr-12`, `outline-none`, `focus:border-blue-500`, `focus:ring-4`, `disabled:opacity-50`.
- Interaction states: `hover:bg-[var(--muted)]`, `hover:text-blue-500`, `active:scale-[0.98]`, `transition-all`, `duration-200`.
- Dark mode: `dark:bg-zinc-900`, `dark:border-zinc-800`, `dark:text-zinc-100`, `dark:hover:bg-zinc-800`.
- Priority colors: `bg-red-500`, `bg-orange-500`, `bg-blue-500`, `bg-zinc-400`, plus matching border and ring colors.

### (c) Interactive features

The interactive behavior is implemented with React client components, `useState`, `useEffect`, `useRef`, `useTransition`, Zustand for guest todos, NextAuth for authentication, and Server Actions for logged-in todo CRUD.

| Feature | Description | File / Component |
|---|---|---|
| Add todo | User enters a title, chooses a priority level, and submits the form. The button shows a loading state while the action is pending. | `src/components/todo-form.tsx`, `src/components/todo-client-wrapper.tsx` |
| Priority picker | Popover menu for choosing priority from level 1 to level 4 with color indicators and selected-state feedback. | `src/components/priority-picker.tsx`, `src/components/todo-form.tsx` |
| Priority filter | Dropdown filter on the Todo page lets users filter visible tasks by one or more priority levels and clear the filter. | `src/components/todo-client-wrapper.tsx` |
| Toggle completion | Checkbox-style button marks a todo as completed or uncompleted, with visual line-through state. | `src/components/todo-item.tsx`, `src/components/todo-client-wrapper.tsx` |
| Todo detail panel | Clicking a todo opens its detail view. On mobile/tablet it appears inline, and on desktop it opens as a right-side panel. | `src/components/todo-item.tsx` |
| Edit todo title | Users can edit the todo title, save it, cancel it, press Enter to save, or press Escape to cancel. | `src/components/todo-item.tsx` |
| Edit description | Logged-in users can add or update a todo description. Guests receive a login notice when trying to use this feature. | `src/components/todo-item.tsx`, `src/components/todo-client-wrapper.tsx` |
| Delete todo | Trash button removes a todo and displays a loading spinner while the action is pending. | `src/components/todo-item.tsx`, `src/components/todo-client-wrapper.tsx` |
| Guest/local mode | Guests can create, update, delete, and filter todos stored in browser localStorage through Zustand. | `src/store/todo-store.ts`, `src/components/todo-client-wrapper.tsx` |
| Authenticated sync mode | Logged-in users load todos from MongoDB and update them through Server Actions. | `src/app/todo/page.tsx`, `src/actions/todo-actions.ts`, `src/components/todo-client-wrapper.tsx` |
| Theme toggle | Button switches between light and dark themes using `next-themes`. | `src/components/theme-toggle.tsx`, `src/components/theme-provider.tsx` |
| Auth dropdown | Logged-in users can open an account dropdown, view account information, navigate to profile, or sign out. | `src/components/auth-button.tsx` |
| Sign in form | Credentials login, Google login, validation errors, password visibility toggle, and loading states. | `src/app/auth/signin/page.tsx` |
| Register form | User registration with validation, password visibility toggle, API submission, and auto-login after success. | `src/app/auth/register/page.tsx`, `src/app/api/auth/register/route.ts` |

**How the interactive elements were tested manually:**

- Add a todo with each priority level, then confirm the list order and color indicators.
- Toggle a todo complete/incomplete and confirm the line-through state changes.
- Open the filter dropdown, select multiple priorities, clear filters, and check the visible list.
- Open a todo detail panel, edit the title, save, cancel, and test Enter/Escape behavior.
- Try editing description as a guest and confirm the login notice appears.
- Sign in, create todos, update description/priority/title, delete todos, and refresh to confirm MongoDB persistence.
- Switch light/dark mode and confirm the UI colors update across Header, Todo, Contact, and Auth pages.

### (d) Interface on multiple devices

- [x] Mobile (< 768px)
- [x] Tablet (768px – 1024px)
- [x] Desktop (> 1024px)

![Tablet](public/tablet.png)
![Laptop](public/laptop.png)
![Mobile](public/mobile.png)

---

## Task 3 — Database Integration & Dynamic Content

### (a) Database design

The project uses MongoDB as the main database. Todo data is modeled with Mongoose, while authentication and account data are stored through the NextAuth MongoDB Adapter plus custom account actions.

- **Database system:** MongoDB
- **ODM / database driver:** Mongoose and MongoDB Node.js Driver
- **Main application collection:** `todos`
- **Authentication collections:** `users`, `accounts`, `sessions`, `verification_tokens`
- **Guest data:** localStorage through Zustand, not MongoDB

**Main collections:**

| Collection | Description | Main fields |
|---|---|---|
| `todos` | Stores todos for authenticated users. It now supports descriptions, due dates, and embedded subtasks. | `_id`, `title`, `description`, `dueDate`, `subtasks`, `isDone`, `priority`, `createdAt`, `userId` |
| `users` | Stores users created by credentials registration or Google login. Credentials users also have `passwordHash`. | `_id`, `name`, `email`, `passwordHash`, `emailVerified`, `image`, `createdAt` |
| `accounts` | Stores OAuth provider account information for NextAuth, mainly used for Google login. | `_id`, `userId`, `type`, `provider`, `providerAccountId`, `access_token` |
| `sessions` | NextAuth session collection available through the adapter. The app currently uses JWT session strategy. | `_id`, `sessionToken`, `userId`, `expires` |
| `verification_tokens` | NextAuth collection for verification token flows if they are enabled later. | `_id`, `identifier`, `token`, `expires` |

**Todo schema:**

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | MongoDB document ID. Converted to `id` string before being passed to the UI. |
| `title` | `String` | Todo title. Required and limited in the app to 100 characters. |
| `description` | `String` | Optional detailed description. Defaults to an empty string and is limited in the app to 1000 characters. |
| `dueDate` | `String \| null` | Optional due date stored as a normalized date string, or `null` when no deadline is set. |
| `subtasks` | `Array` | Embedded subtask list. Defaults to an empty array and is limited in the app to 50 items. |
| `isDone` | `Boolean` | Completion state. Defaults to `false`. |
| `priority` | `Number` | Priority level from 1 to 4. Defaults to 4. |
| `createdAt` | `Date` | Creation time. Defaults to the current date. |
| `userId` | `String` | Authenticated user ID. Indexed for faster user-specific queries. |

**Subtask schema:**

| Field | Type | Description |
|---|---|---|
| `id` | `String` | Client-safe subtask ID generated with `crypto.randomUUID()`. |
| `title` | `String` | Subtask title. Required and limited in the app to 100 characters. |
| `isDone` | `Boolean` | Subtask completion state. Defaults to `false`. |
| `createdAt` | `Date` | Subtask creation time. Defaults to the current date. |

**User/account fields used by the app:**

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | User ID used by NextAuth and referenced by todos through `userId`. |
| `name` | `String` | Display name shown in the header and account page. |
| `email` | `String` | Login email. It is normalized and checked for duplicates before updates. |
| `passwordHash` | `String` | Bcrypt hash for credentials accounts. Google accounts do not use this field. |
| `emailVerified` | `Date \| null` | NextAuth-compatible email verification field. |
| `image` | `String \| null` | Avatar URL from Google or null for credentials accounts. |
| `createdAt` | `Date` | Registration time for credentials accounts. |

**Relationship overview:**

```txt
users._id 1 -> * todos.userId
users._id 1 -> * accounts.userId
users._id 1 -> * sessions.userId
```

![ER Diagram](public/er-diagram.png)

### (b) Database connection

- **Server-side technology:** Next.js App Router, Server Components, Server Actions, Route Handlers, NextAuth.js
- **Database connection:** MongoDB connection string from environment variables
- **Connection files:** `src/lib/mongoose.ts` and `src/lib/mongodb-client.ts`
- **Main environment variable:** `MONGODB_URI`
- **Fallback variable for Mongoose:** `MONGODB_URL`

The project uses two MongoDB connection helpers:

- `src/lib/mongoose.ts` connects Mongoose to MongoDB and caches the connection globally to avoid creating a new connection on every server request.
- `src/lib/mongodb-client.ts` creates a cached MongoDB client promise for the NextAuth MongoDB Adapter.

**Implemented CRUD operations for authenticated todos:**

| Operation | Status | Implementation |
|---|---|---|
| Create | [x] | `addTodo(title, priority)` creates a new todo with the current `userId`. |
| Read | [x] | `/todo` reads todos with `TodoModel.find({ userId })` and sorts by priority and creation date. |
| Update | [x] | `toggleTodo`, `updateTodo`, `updateTodoDescription`, `updateDueDate`, and `updatePriority` update existing todos. |
| Delete | [x] | `deleteTodo(id)` removes a todo that belongs to the current user. |

**Implemented nested subtask operations:**

| Operation | Status | Implementation |
|---|---|---|
| Create | [x] | `addSubtask(todoId, title)` appends an embedded subtask to an existing todo. |
| Read | [x] | `/todo` maps each todo's `subtasks` array into the client `Todo` type. |
| Update | [x] | `toggleSubtask` and `updateSubtask` update a subtask inside the parent todo document. |
| Delete | [x] | `deleteSubtask(todoId, subtaskId)` filters the subtask out of the parent todo. |

**Implemented account operations:**

| Operation | Status | Implementation |
|---|---|---|
| Register | [x] | `POST /api/auth/register` creates a credentials user with a bcrypt `passwordHash`. |
| Login | [x] | NextAuth Credentials Provider reads `users` by email and compares `passwordHash`. |
| Google auth | [x] | NextAuth Google Provider stores OAuth user data in `users` and `accounts`. |
| Read profile | [x] | `getCurrentAccountProfile()` reads `users` and checks `accounts` to detect Google vs credentials accounts. |
| Update profile | [x] | `updateAccountInfo()` updates credentials users' `name` and `email` after duplicate-email validation. |
| Change password | [x] | `changePassword()` hashes a new password and updates `users.passwordHash`. |

**Connection architecture:**

```txt
React UI
  -> TodoClientWrapper client handlers
  -> Next.js Server Actions / Server Component
  -> connectDB()
  -> Mongoose TodoModel
  -> MongoDB
```

For guests, the same Todo UI works without database access. Guest todos are handled by `src/store/todo-store.ts` and saved in browser localStorage. Guest mode supports basic todo fields only; authenticated mode persists descriptions, due dates, and subtasks in MongoDB.

### (c) Dynamic content pages

| Page | Displayed dynamic data | Query / Endpoint |
|---|---|---|
| Todo | Shows the authenticated user's todo list from MongoDB, including title, description, due date, subtasks, completion state, priority, and created date. | Server Component query: `TodoModel.find({ userId }).sort({ priority: 1, createdAt: -1 })` in `src/app/todo/page.tsx` |
| Todo actions | Creates, updates, toggles, filters, adds due dates, manages subtasks, and deletes todo data. UI updates are handled optimistically before `/todo` is revalidated. | Server Actions in `src/actions/todo-actions.ts` |
| Sign in | Reads user account data by email for credentials login and validates password hash with `bcryptjs`; Google login is handled by NextAuth. | NextAuth providers in `src/lib/auth.ts` |
| Register | Creates a credentials user after validating input, checking duplicate email, and hashing the password. | `POST /api/auth/register` in `src/app/api/auth/register/route.ts` |
| Profile | Displays account provider, name, and email; redirects unauthenticated users to sign in. | `getCurrentAccountProfile()` in `src/lib/account.ts` and `src/app/profile/page.tsx` |
| Account update | Updates credentials users' name/email and refreshes the current NextAuth session data. | `updateAccountInfo()` in `src/actions/account-actions.ts` |
| Password change | Updates credentials users' `passwordHash`, then signs the user out so the next login uses the new password. | `changePassword()` in `src/actions/account-actions.ts` |
| Auth button / header | Shows login state, user name, email, avatar or initials, profile link, and sign-out action. | `useSession()` from NextAuth in `src/components/auth-button.tsx` |

**Dynamic data screenshots:**

![Todo page with dynamic data](public/feature-2.png)
![Todo detail and interaction](public/feature-5.png)

---

## Task 4 — Optimization

### (a) Check performance with Lighthouse

**Result on Mobile:**

| Metric | Point |
|---|---|
| Performance | 99 |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |

![Lighthouse on Mobile](public/lighthouse-mobile.png)

**Result on Desktop:**

| Metric | Point |
|---|---|
| Performance | 100 |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |

![Lighthouse on Desktop](public/lighthouse-desktop.png)

### (b) Track errors and user behaviors

**Simple Analytics:**
- [x] Intergrated
- Simple Analytics is integrated directly into src/app/layout.tsx using Next.js's Script component. The approach is concise:
    - Import Script from next/script.
    - Insert Simple Analytics' tracking script into the root layout.
    - Since it's placed in the root layout, the script will be loaded across all pages of the app

```tsx
import Script from "next/script";

<Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
```
- This integration allows Simple Analytics to record basic page views and traffic without needing to add separate tracking code for each page."

![Simple Analytics Dashboard](public/simple-analytics.png)

**Sentry:**
- [x] Intergrated
- **Project DSN / Config:** https://96e7d5200b4dc79f8f5037f5a6f3a1c5@o4511394738995200.ingest.de.sentry.io/4511394749349968
- The type of error being monitored is server-side infrastructure/database connectivity error.
    - Specifically, The app on Vercel is trying to connect to MongoDB via TLS, but the secureConnect step is timing out.
    - This means the request fails to successfully reach the database within the allowed time, so the MongoDB driver throws an error

```txt
MongoNetworkTimeoutError
Socket 'secureConnect' timed out
connectTimeoutMS: 30000
```

![Error log](public/error-log.png)

---

## Task 5 — UI/UX Peer Review & Evaluation (Do Later)

### (a) Feedbacks from other groups

> Present the feedback that the group gave to the reviewed groups.

**Reviewed group #1:**

- **Group / Project name:** Tracker_yourMoney
- **Project link:** [Project](https://github.com/tducn110/Tracker_yourMoney)

| Aspect | Strengths | Suggestions for improvement |
|---|---|---|
| Usability | Clear dashboard flow with quick add, budgets, goals, bills, transactions, wallets, and analytics. | Improve global search, mobile navigation, filters, and responsive layouts. |
| Aesthetics | Modern interface with consistent cards, icons, colors, progress bars, and charts. | Reduce visual clutter from heavy gradients, shadows, emojis, and overly bold typography. |
| User-Friendliness | 	Easy onboarding, Vietnamese labels, helpful quick-add examples, loading states, and feedback messages. | Clarify demo vs real Google login, fix placeholder links, improve accessibility, and make error messages more specific. |

**Reviewed group #2:**

- **Group / Project name:** Calorie Web
- **Project link:** [Project](https://github.com/nguyenduythaibao1611-eng/calorie-web.github.io)

| Aspect | Strengths | Suggestions for improvement |
|---|---|---|
| Usability | Clear main flow: profile setup, dashboard, diary, and stats are easy to understand. | Add edit/delete actions for logged meals and stronger validation in settings. |
| Aesthetics | 	Clean health-focused green palette, rounded cards, icons, and good mobile-first layout. | Add more visual contrast and reduce repeated green/white card styling. |
| User-Friendliness | Bottom navigation, food search, and calorie/macro summaries make daily tracking simple. | Replace browser alerts with inline feedback, improve empty states, and expand accessibility support. |

### (b) Solve feedbacks from other groups

> Summarize the feedback received from other groups and the team's decision for each item.

| Feedback | Source group | Decision | Reason / Commit |
|---|---|---|---|
| Guest mode: Cannot add subtask – error message lacks clear login guidance | Tracker_yourMoney | Implemented | PR #31 |

![Before](public/before-1.png)
![After](public/After-1.png)
---

## Deliverables Checklist

- [x] **Source code trên GitHub** — repository public or shared with lecturer
- [x] **README.md** include: installation guide, project overview, features list with screenshots, ERD
- [x] **Video demo** — maximum 10 phút, resolution minumum 720p, make it public
