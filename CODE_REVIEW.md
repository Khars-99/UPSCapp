# UPSC Mentor PWA - Code Review

## 1. Architectural Analysis
The project is a Progressive Web App (PWA) built with React, Vite, and Material UI. It uses `localforage` for client-side storage (IndexedDB).

### Strengths
- **Modular Component Structure:** Components are well-organized into logical folders (Dashboard, KnowledgeBase, etc.).
- **Theme Support:** Uses Material UI's ThemeProvider with a custom context for dark mode.
- **PWA Ready:** Configured with `vite-plugin-pwa`.
- **Type Safety:** Uses TypeScript, though some `any` types are present.

### Weaknesses
- **Logic in Components:** Significant business logic (like evaluation algorithms and test timers) is embedded directly within components. This should be extracted into hooks or utility functions.
- **Mock Implementations:** Several features (PDF extraction, syllabus progress) use hardcoded mocks or simulations.
- **Limited Error Handling:** Most async operations have basic `try-catch` blocks that just log to the console.

## 2. Security Vulnerabilities
- **XSS Risk:** `AnswerEvaluator.tsx` uses `dangerouslySetInnerHTML` to render highlighted text. While it's currently highlighting keywords it matched, if user input is not properly sanitized, this could be a risk.
- **No Input Validation:** Minimal validation on file uploads and text inputs.

## 3. Logic Flaws & Technical Debt
- **Evaluation Logic:** The answer evaluation in `AnswerEvaluator.tsx` is very primitive (simple keyword matching and word length check).
- **PDF Extraction:** `CurrentAffairs.tsx` and `FileUpload.tsx` don't actually parse PDFs; they use `FileReader.readAsText()` which won't work for binary PDF content, or they use hardcoded strings.
- **Linting Issues:** Multiple unused imports, unused variables, and missing hook dependencies.
- **Type Safety:** Use of `any` in `storage.ts` and `MCQTest.tsx` reduces the benefits of TypeScript.

## 4. Recommendations
1.  **Extract Logic:** Move evaluation logic and storage interactions into custom hooks.
2.  **Robust PDF Parsing:** Integrate a real PDF parsing library like `pdfjs-dist` (since `pdf-parse` is more for Node.js).
3.  **Sanitization:** Use a library like `dompurify` if `dangerouslySetInnerHTML` must be used.
4.  **Complete Lint Fixes:** Clean up the codebase to follow standard React/TypeScript practices.
