# Contributing to tweakcn.com

Thanks for your interest in contributing to tweakcn.com! We're excited to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend checking open [Issues](https://github.com/jnsahaj/tweakcn/issues) and [Pull Requests](https://github.com/jnsahaj/tweakcn/pulls) to see if someone else is working on something similar.

If you need any help or want to discuss ideas, feel free to join our community on [Discord](https://discord.com/invite/Phs4u2NM3n).

## About This Project

tweakcn.com is a powerful Visual Theme Editor designed for Tailwind CSS & shadcn/ui components. Websites built with shadcn/ui often share a similar look; tweakcn helps you visually customize these components to make your projects stand out.

## Project Structure

This repository contains the Next.js application for tweakcn.com. Here's a simplified overview of the project's directory structure:

```
├── actions/          # Next.js Server Actions
├── app/
    ├── (auth)/       # Authentication routes
    ├── (legal)/      # Legal pages (privacy policy)
    ├── api/          # Public API endpoints
    ├── dashboard/    # User dashboard (saved themes)
    ├── editor/       # Main theme editor route
    ├── layout.tsx    # Root application layout
    └── page.tsx      # Landing page route
├── components/
    ├── editor/       # Theme editor interface components
    ├── examples/     # Demo components for theme previews
    ├── home/         # Landing page components
    └── ui/           # Base shadcn/ui components
├── config/           # App configuration & default values
├── db/               # Database schema & logic (Drizzle ORM)
├── hooks/            # Custom React hooks
├── lib/              # 3rd-party library integrations & helpers
├── public/
    └── r/            # Holds JSON files for the theme registry
├── scripts/          # Utility scripts used during development
├── store/            # Global state management (Zustand)
└── utils/            # General utility functions and helpers
```

## How to Contribute

### Non-Technical

Even if you don't plan to write code, there are many ways to contribute:

- **Create an Issue:** If you find a bug, have an idea for a new feature, or want to suggest an improvement, please [create an issue on GitHub](https://github.com/jnsahaj/tweakcn/issues). This helps us track and prioritize feedback.
- **Spread the Word:** If you like tweakcn.com, please share it with your friends, colleagues, and on social media. Helping grow the community makes the tool better for everyone.
- **Use tweakcn.com:** The best feedback comes from real-world usage! As you use the editor, if you encounter any issues or have ideas for improvement, please let us know by creating an issue or reaching out on [Discord](https://discord.com/invite/Phs4u2NM3n).

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1.  **Fork the Repository:** Start by creating your own copy of the [tweakcn repository](https://github.com/jnsahaj/tweakcn) on GitHub. Click the "Fork" button in the top-right corner.

2.  **Clone Your Fork:** Clone the repository you just forked to your local machine:

    ```bash
    git clone https://github.com/YOUR_USERNAME/tweakcn.git
    cd tweakcn
    ```

    Replace `YOUR_USERNAME` with your actual GitHub username.

3.  **Install Dependencies:** Install the necessary project dependencies:

    ```bash
    npm install
    ```

### Set up the development environment (follow closely)

1.  **Configure Environment Variables:**

    - Create a new file named `.env.local` in the root of the project directory.
    - Copy the following content into `.env.local` and fill in your credentials.

    ```bash
    # Base URL for local development
    BASE_URL="http://localhost:3000"

    ###### DATABASE ######
    # Set up a free PostgreSQL database on Neon: https://console.neon.tech/
    # The project uses the Neon serverless driver adapter.
    # Copy your connection string here.
    DATABASE_URL="postgresql://neondb_owner:[YOUR_NEON_PASSWORD]@[YOUR_NEON_HOST]/neondb?sslmode=require"

    ###### AUTH ######
    # Create GitHub OAuth App: https://www.better-auth.com/docs/authentication/github
    GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"
    GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET"

    # Create Google OAuth Credentials: https://www.better-auth.com/docs/authentication/google
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
    ```

    - Make sure to replace the placeholder values with your actual credentials obtained from Neon, GitHub, and Google Cloud Platform.

2.  **Apply Database Schema:** Push the database schema defined in `db/schema.ts` to your Neon database using Drizzle Kit:

    ```bash
    npx drizzle-kit push
    ```

    - _(Optional)_ You can view your database structure using Drizzle Studio by running `npx drizzle-kit studio`.

3.  **Create a New Branch:** Before making changes, create a dedicated branch for your feature or bug fix:

    ```bash
    git checkout -b your-descriptive-branch-name
    ```

    (e.g., `feature/add-community-gallery`, `fix/login-button-style`)

4.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

You're now ready to start coding!

### Troubleshooting Setup

If you encounter unexpected issues, especially after pulling new changes or related to database/auth setup, try resetting your local environment:

1.  Stop the development server (Ctrl+C).

2.  Delete the `node_modules` and `.next` directories:

    ```bash
    # On macOS / Linux:
    rm -rf node_modules .next

    # On Windows (PowerShell):
    Remove-Item -Recurse -Force node_modules, .next
    ```

3.  Reinstall dependencies:

    ```bash
    npm install
    ```

4.  Re-run the database push command (optional, but good practice if schema might have changed):

    ```bash
    npx drizzle-kit push
    ```

5.  Restart the development server:

    ```bash
    npm run dev
    ```

## Submitting Your Changes (Pull Request Workflow)

Once you've made your changes and tested them locally, follow these steps to submit them for review:

1.  **Stage Your Changes:** Add the files you've modified to the Git staging area.

    ```bash
    git add .
    ```

2.  **Commit Your Changes:** Commit your staged changes with a descriptive message that follows the **Conventional Commits** specification. This helps automate releases and makes the commit history easier to understand.

    ```bash
    git commit -m "feat(editor): Add contrast checker component"
    ```

    - **Format:** `type(scope): description` (e.g., `fix(auth): Correct GitHub redirect URL`, `docs(readme): Update setup instructions`).
    - **Common Types:** `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (code style), `chore` (build process, tooling).
    - Refer to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) for more details.

3.  **Push to Your Fork:** Push your committed changes to the branch on your forked repository on GitHub.

    ```bash
    git push origin your-descriptive-branch-name
    ```

    Replace `your-descriptive-branch-name` with the actual name of your branch.

4.  **Open a Pull Request (PR):**

    - Go to the original [tweakcn repository](https://github.com/jnsahaj/tweakcn) on GitHub.
    - You should see a prompt suggesting you create a Pull Request from your recently pushed branch. Click on it. If not, navigate to the "Pull requests" tab and click "New pull request".
    - Ensure the base repository is `jnsahaj/tweakcn` and the base branch is `main` (or the appropriate target branch).
    - Ensure the head repository is your fork and the compare branch is `your-descriptive-branch-name`.
    - **Write a Clear Description:** Fill out the pull request template (if one exists). Provide a clear title and a detailed description of the changes you've made. Explain _why_ you made the changes and link to any relevant GitHub Issues (e.g., "Closes #123").

5.  **Review Process:**

    - Once submitted, maintainers will review your pull request.
    - Maintainers may provide feedback or request changes directly on the pull request. Please address these comments by pushing further commits to your branch.
    - Once approved, a maintainer will merge your changes into the main project.

Thank you for contributing!
