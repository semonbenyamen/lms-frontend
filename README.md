# LMS Frontend

Frontend application for the 5DVR Learning Management System (LMS).

The project is built with TanStack Start, React, TypeScript, TanStack Router, TanStack Query, TanStack Form, Tailwind CSS, shadcn/ui, Valibot, ParaglideJS, Playwright, Vite, and Nitro.

The current implementation includes course pages and a complete frontend authentication flow with automated E2E testing.

---

## Tech Stack

- React
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- TanStack Form
- Tailwind CSS
- shadcn/ui
- Valibot
- ParaglideJS
- Playwright
- Vite
- Nitro

---

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

## Production Build

Build the application for production:

```bash
npm run build
```

The production output is generated in:

```text
.output/
```

You can preview the build with:

```bash
npx vite preview
```

---

## Available Scripts

Start the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Build the project:

```bash
npm run build
```

Run the Playwright E2E tests:

```bash
npm run test:e2e
```

Format the project:

```bash
npm run format
```

Run the configured project checks:

```bash
npm run check
```

---

## Authentication

The current frontend authentication flow includes:

- Login
- Registration
- Email verification
- OTP verification
- Resend OTP
- Forgot password
- Reset password
- Logout
- Authentication state handling
- Protected routes
- Redirecting unauthorized users
- Redirecting authenticated users away from the login page
- Form validation
- Loading states
- Error states

Authentication logic currently uses a mock server-side service for development and testing.

Real backend API and JWT/session integration will be connected later.

---

## Authentication Architecture

The authentication implementation follows this flow:

```text
UI / Route
    ↓
TanStack Form
    ↓
Valibot Validation
    ↓
useServerFn
    ↓
createServerFn
    ↓
Auth Service
```

Main authentication files:

```text
src/schema/auth.ts
src/api/services/auth.service.ts
src/server/auth.ts
src/queries/auth.ts
```

Authentication routes:

```text
/login
/register
/verify-otp
/forgot-password
/reset-password
```

---

## Protected Routes

The `/courses` route is protected.

If an unauthenticated user tries to access:

```text
/courses
```

they are redirected to:

```text
/login
```

After a successful login, the user is allowed to access the courses area.

After logout, access to protected routes is blocked again.

---

## Courses

The project currently includes:

```text
/courses
/courses/new
```

The courses section currently uses mock course data.

---

## Validation

Valibot is used for authentication form validation.

Current validation includes:

- Valid email addresses
- Minimum password length
- Password confirmation
- OTP length
- Registration validation
- Password reset validation

Validation schemas are located in:

```text
src/schema/auth.ts
```

---

## E2E Testing

Playwright is used for end-to-end testing.

Run all E2E tests with:

```bash
npm run test:e2e
```

The authentication test suite currently covers 16 scenarios:

1. Unauthorized access to protected routes
2. Invalid login
3. Registration password validation
4. User registration
5. Invalid OTP
6. Resend OTP
7. Account verification
8. Login after verification
9. Logout
10. Protected route after logout
11. Forgot password flow
12. Reset password validation
13. Password reset
14. Login with the new password
15. Authenticated user redirect from login
16. Final logout flow

Current result:

```text
16 passed
```

The E2E tests are located in:

```text
tests/auth.spec.ts
```

Playwright configuration:

```text
playwright.config.ts
```

The authentication tests run serially because the current mock authentication service uses shared in-memory state.

---

## Internationalization

The project uses ParaglideJS for internationalization.

Supported languages currently include:

- English
- Arabic

Translation messages are stored in:

```text
messages/en.json
messages/ar.json
```

Generated Paraglide files are located in:

```text
src/paraglide/
```

Generated Paraglide files should not be edited manually.

---

## Styling

The project uses:

- Tailwind CSS
- shadcn/ui

Reusable UI components are located in:

```text
src/components/ui/
```

Generated shadcn components should generally not be edited unless customization is intentionally required.

---

## Routing

The project uses TanStack Router with file-based routing.

Routes are located in:

```text
src/routes/
```

The route tree is generated automatically.

Do not manually edit:

```text
src/routeTree.gen.ts
```

---

## Query Management

TanStack Query is used for server state and authentication state.

Authentication query configuration is located in:

```text
src/queries/auth.ts
```

---

## Server Functions

TanStack Start server functions are used between the frontend routes and the current authentication service.

Authentication server functions are located in:

```text
src/server/auth.ts
```

---

## Quality Checks

Before committing changes, run:

```bash
npm run lint
npm run build
npm run test:e2e
```

Current Week 2 status:

```text
Lint        Passed
Build       Passed
E2E Tests   16 Passed
```

---

## Generated Files

Do not manually edit generated files such as:

```text
src/routeTree.gen.ts
src/paraglide/
```

Test output directories are ignored by Git:

```text
test-results/
playwright-report/
blob-report/
```

---

## Current Development Status

Completed:

- Project setup
- Course routes
- Create course page
- Authentication UI
- Registration flow
- OTP verification
- OTP resend
- Forgot password
- Reset password
- Logout
- Route protection
- Form validation
- English and Arabic translations
- Authentication state handling
- E2E authentication testing
- Lint checks
- Production build

Still to be integrated:

- Real backend API
- Real JWT/session handling
- Persistent authentication
- Production authentication storage