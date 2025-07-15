# How to Build PassVault: A Brief Guide

This document provides a high-level overview of the steps to build the PassVault application.

### 1. Project Setup (Next.js)

The application is built with Next.js, a popular React framework.

- **Initialize Project**: Start with a new Next.js project.
  ```bash
  npx create-next-app@latest pass-vault --typescript --tailwind --eslint
  ```
- **Install Core Dependencies**: Add necessary packages for forms, icons, and Firebase.
  ```bash
  npm install firebase lucide-react react-hook-form @hookform/resolvers zod
  ```

### 2. Firebase Integration

Firebase is used for the backend services, including authentication and the database.

- **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
- **Enable Authentication**: In the Firebase project, go to the "Authentication" section and enable the "Email/Password" sign-in method.
- **Set up Firestore**: Go to the "Firestore Database" section and create a new database. Set up security rules to ensure users can only access their own data.
- **Configure Firebase in the App**: Copy the Firebase project configuration credentials into your application's environment variables (`.env`) and use them in a Firebase initialization file (like `src/lib/firebase.ts`).

### 3. UI and Styling (Tailwind CSS & ShadCN UI)

The user interface is built using a combination of Tailwind CSS for styling and ShadCN UI for pre-built components.

- **Initialize ShadCN UI**: Follow the ShadCN UI documentation to add it to your project. This will set up `globals.css` with CSS variables for theming and create a `components.json` file.
- **Apply Custom Theme**: Modify the HSL color variables in `src/app/globals.css` to match the PassVault style guide (Dark Charcoal background, Forest Green primary, Mint Green accent).
- **Use Components**: Add ShadCN components as needed (e.g., `Button`, `Card`, `Input`, `Dialog`). You can add new ones using the ShadCN CLI.
  ```bash
  npx shadcn-ui@latest add button card
  ```

### 4. Core Feature Implementation

- **Authentication Flow**:
  - Create Login (`/login`) and Signup (`/signup`) pages.
  - Use the `firebase/auth` SDK to handle user registration and sign-in.
  - Implement an `AuthContext` to manage the user's authentication state across the app.
  - Create an `AuthGuard` component to protect routes that require a logged-in user.

- **Password Management**:
  - Define a `PasswordEntry` type in `src/types/index.ts`.
  - Use Firestore's `collection`, `addDoc`, `updateDoc`, and `deleteDoc` functions to manage password entries.
  - Create a custom hook `usePasswords` to abstract the Firestore logic (add, update, delete, and listen for real-time updates).
  - Build the UI components:
    - `PasswordList`: Displays all password entries.
    - `PasswordListItem`: A single item in the list.
    - `AddPasswordDialog`: A popup form to add or edit entries.
    - `ViewPasswordDialog`: A popup to securely view and manage a saved password.

### 5. AI-Powered Features (Genkit)

Genkit is used to integrate generative AI for features like the Password Strength Analyzer.

- **Install Genkit**: Add Genkit and the Google AI plugin to the project.
  ```bash
  npm install genkit @genkit-ai/googleai
  ```
- **Create a Genkit Flow**:
  - Define a new flow file (e.g., `src/ai/flows/password-strength-analyzer.ts`).
  - Use `zod` to define the input and output schemas for the AI model.
  - Use `ai.definePrompt` to create a prompt that instructs the AI on how to analyze the password. The prompt should specify the desired JSON output structure.
  - Wrap the prompt in a flow using `ai.defineFlow`.
- **Integrate Flow in UI**: Create a component (`StrengthCheckerForm`) that calls the Genkit flow and displays the results.
