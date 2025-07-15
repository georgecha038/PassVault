# Prompting Guide: How to Build PassVault with an AI Assistant

This guide provides a detailed, step-by-step approach to building the PassVault application using prompts with an AI coding partner like the one in Firebase Studio. Each step includes the goal, a sample prompt, and an explanation of the key instructions.

---

### Step 1: Project Initialization and UI Foundation

**Goal:** Set up a new Next.js project with TypeScript, Tailwind CSS, and initialize ShadCN for our UI components.

**Sample Prompt:**
> "Initialize a new Next.js application named 'PassVault'. Configure it to use TypeScript, Tailwind CSS, and ESLint. Once the project is created, initialize ShadCN UI with the 'default' style and 'neutral' base color. Finally, create a basic dark-mode layout in `src/app/layout.tsx` that includes the Inter font from Google Fonts."

**Explanation:**
*   **Be Specific:** Mention the exact tools (`Next.js`, `TypeScript`, `Tailwind`, `ShadCN`).
*   **Provide Configuration Details:** Specify the style (`default`) and color (`neutral`) for ShadCN. This helps the AI make correct initial settings.
*   **Set the Scene:** Asking for a dark-mode layout and a specific font (`Inter`) establishes the basic look and feel from the start.

---

### Step 2: Firebase Integration and Authentication Context

**Goal:** Configure Firebase and set up a React Context to manage the user's authentication state throughout the application.

**Sample Prompt:**
> "Integrate Firebase into the project. Create a Firebase configuration file in `src/lib/firebase.ts`. Then, implement an `AuthContext` in `src/context/auth-context.tsx`. This context should provide the current user, a loading state, and functions for `signInWithEmail`, `signUpWithEmail`, and `logout`. Handle Firebase errors by providing user-friendly messages for common cases like 'auth/invalid-credential' and 'auth/email-already-in-use'."

**Explanation:**
*   **Break Down the Request:** The prompt clearly separates the tasks: create the config file, then create the auth context.
*   **Define the API:** Specifying the exact functions (`signInWithEmail`, `logout`, etc.) and states (`user`, `loading`) for the context ensures the AI builds what you need.
*   **Error Handling:** Explicitly asking for user-friendly error messages is crucial for a good user experience.

---

### Step 3: Building the Authentication UI (Login and Signup Pages)

**Goal:** Create the user interface for signing in and signing up, using ShadCN components.

**Sample Prompt:**
> "Create the login and signup pages.
> 1.  For the login page (`src/app/login/page.tsx`), build a form with email and password fields using ShadCN Card, Input, and Button components. It should call the `signInWithEmail` function from our `AuthContext`.
> 2.  For the signup page (`src/app/signup/page.tsx`), create a similar form that calls the `signUpWithEmail` function.
> 3.  Use `zod` and `react-hook-form` for form validation. The password on the signup form must be at least 6 characters.
> 4.  Add an `AuthGuard` component to protect routes, redirecting unauthenticated users to the login page."

**Explanation:**
*   **Component-Driven Instructions:** Mentioning specific ShadCN components (`Card`, `Input`, `Button`) guides the AI's UI choices.
*   **Connect to Logic:** Clearly state which auth functions (`signInWithEmail`, `signUpWithEmail`) each form should use.
*   **Specify Validation Rules:** Defining validation requirements (`zod`, `react-hook-form`, password length) leads to more robust code.
*   **Security First:** Requesting an `AuthGuard` component is a key part of building a secure application.

---

### Step 4: Core Feature - Password Management

**Goal:** Implement the main functionality: displaying, adding, editing, and deleting passwords using Firestore.

**Sample Prompt:**
> "Implement the password management functionality.
> 1.  Create a custom hook `usePasswords` in `src/hooks/use-passwords.ts` that listens to a 'passwords' collection in Firestore in real-time. It should only fetch passwords belonging to the currently logged-in user. This hook should expose the `passwords` array, a `loading` state, and functions to `addPassword`, `updatePassword`, and `deletePassword`.
> 2.  Create the main page (`src/app/page.tsx`) which uses a `PasswordList` component to display the passwords.
> 3.  Build the UI components: `PasswordListItem` for each entry, `AddPasswordDialog` to add/edit passwords, and `ViewPasswordDialog` to view the details and delete an entry. Use ShadCN Dialog, Button, and Input components."

**Explanation:**
*   **Abstracting Logic:** Asking for a custom hook (`usePasswords`) is a best practice. It cleanly separates the data logic from the UI.
*   **Data Security:** Specifying that the hook should only fetch the user's own passwords is a critical security instruction for the Firestore query.
*   **UI Decomposition:** Breaking down the UI into smaller, reusable components (`PasswordList`, `PasswordListItem`, `AddPasswordDialog`) results in a more organized and maintainable codebase.

---

### Step 5: AI Feature - Password Strength Checker

**Goal:** Integrate an AI-powered feature using Genkit to analyze password strength.

**Sample Prompt:**
> "Add an AI-powered 'Password Strength Checker' page.
> 1.  Create a new page at `/strength-checker`.
> 2.  Create a Genkit flow in `src/ai/flows/password-strength-analyzer.ts`. This flow should take a password as input.
> 3.  Define a prompt for the flow that instructs the AI to act as a security expert. The AI should analyze the password and return a JSON object with a 'strength' assessment (e.g., 'Weak', 'Moderate', 'Strong') and an array of 'suggestions' for improvement. Use `zod` to define the input and output schemas.
> 4.  On the strength checker page, create a form that calls this Genkit flow and displays the AI's analysis and suggestions in a visually appealing way."

**Explanation:**
*   **Specify the AI Tool:** Mentioning `Genkit` directs the AI to use the correct framework.
*   **Prompt Engineering:** Clearly defining the AI's persona ("security expert"), task, and desired output format (JSON with specific keys) is the most important part of this prompt.
*   **Schema Definition:** Requiring `zod` schemas for input and output ensures the data flowing to and from the AI is structured and predictable.
*   **Displaying Results:** Asking for the results to be displayed "in a visually appealing way" gives the AI creative license to build a nice-looking UI for the analysis.