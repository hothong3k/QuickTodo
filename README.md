# QuickTodo - Modern Todo Application

QuickTodo is a modern task management application (Todo List), focusing on smooth user experience, refined interface, and high performance. The application is designed to be minimalist, requiring no login or app downloads, suitable for personal use or feature demos.

## Tech Stack

The project uses the following technologies:

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - Powerful full-stack React framework.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Ensures type safety and clean code.
- **Database ODM**: [Mongoose](https://mongoosejs.com/) - Easily connect and manage MongoDB data.
- **Database**: [MongoDB](https://www.mongodb.com/) - Flexible NoSQL database.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI design.
- **Authentication**: [NextAuth](https://next-auth.js.org/) - Authentication for Next.js.
- **UI State Management**: [Zustand](https://zustand.dev/) - Simple, fast, and scalable state management.

## User Manual (Workflow)

The application provides a simple and intuitive workflow:

1.  **Add task**: Enter the task title in the input field, select a priority level (P1 to P4 by color), and press "Add".
2.  **Manage status**: Click the checkbox next to each task to mark it as completed or uncompleted.
3.  **Edit**: Click directly on the task title to modify the content or change the priority level.
4.  **Delete task**: Use the trash icon to remove tasks that are no longer needed.
5.  **Switch interface**: Use the toggle button in the corner of the screen to switch between Light and Dark modes.

## System Architecture Overview

The system architecture is built according to the modern Next.js model:

- **Frontend & Backend Unified**: Uses Next.js App Router to combine both the interface and data processing logic into a single project.
- **Server Components**: Defaults to using Server Components to fetch data from MongoDB via Mongoose.
- **Server Actions**: Processes CRUD (Create, Read, Update, Delete) operations directly from the client without going through traditional API endpoints, making the code more concise and secure.
- **Data Modeling**: Data is stored in MongoDB with a flexible structure, strictly managed by the Mongoose Schema.

## Folder Structure

```
quicktodo/
├── public/               # Static assets (images, icons, fonts)
│   ├── tasks.md
│   └── ui-changes-plan.md
├── src/
│   ├── actions/          # Server Actions for server-side logic (CRUD Todo)
│   │   └── todo-actions.ts
│   ├── app/              # App Router: Pages, Layouts, and API routes
│   │   ├── api/
│   │   │   └── auth/     # Authentication routes (NextAuth, Register)
│   │   ├── auth/         # Login and registration UI
│   │   ├── contact/      # Contact page
│   │   ├── todo/         # Main Todo list page
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx      # Landing page
│   ├── components/       # Shared UI components
│   │   ├── auth-button.tsx
│   │   ├── header.tsx
│   │   ├── priority-picker.tsx
│   │   ├── session-provider.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── todo-client-wrapper.tsx
│   │   ├── todo-form.tsx
│   │   ├── todo-item.tsx
│   │   └── todo-list.tsx
│   ├── lib/              # Libraries and configurations (Database, Auth)
│   │   ├── auth.ts
│   │   ├── mongodb-client.ts
│   │   └── mongoose.ts
│   ├── models/           # Mongoose schema definitions
│   │   └── Todo.ts
│   ├── store/            # Local state management (Zustand) when not logged in
│   │   └── todo-store.ts
│   └── types/            # TypeScript interfaces/types definitions
│       └── index.ts
├── .env                  # Environment variables storage (Secrets, URI)
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript compiler configuration

```

## System Installation and Deployment Guide

### System Requirements
- Node.js 22 or higher.
- A MongoDB account (Atlas) or a locally running MongoDB.

### Installation
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

### Deployment
The application can be easily deployed on platforms like Vercel:
1. Connect the repository with Vercel.
2. Add the `DATABASE_URL` environment variable.
3. Vercel will automatically build and deploy the application.

## Running the Application

To run the application in development mode:

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience it.

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

## Notes and Limitations

- **Network connection**: An active Internet connection is required if using MongoDB Atlas.
- **Browser**: Best supported on modern browsers (Chrome, Edge, Firefox, Safari).
- **LocalStorage (Unauthenticated)**: When not logged in, data is stored only in the browser's `localStorage`. This means:
    - Data is not synced across different devices or browsers.
    - Data only stored in the device that was used to create it. So logged in means two separate list of data. (Will figure solution later)
    - Clearing browser cache or data will result in the loss of all tasks.
    - It is recommended to log in for persistent storage and multi-device synchronization.
- **Future Updates**: New features such as categories, due dates, and detailed user profiles are planned for subsequent versions.

## Documentation Deliverables

- Overview of the QuickTodo project.
- List of technologies used (Tech stack).
- Application usage workflow (User Manual).
- System architecture overview.
- Installation and deployment guide (Installation & Deployment).
- Application operation guide (Running the Application).
- System notes and limitations.
