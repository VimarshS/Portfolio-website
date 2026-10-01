# Project Context

## Overview

This is a single-page portfolio for Vimarsh Srivastava, built with React, TypeScript, and Vite. The page presents profile information, skills, projects, experience, achievements, education, and contact details.

## Application flow

`index.html` loads `src/main.tsx`. The entry point mounts `src/App.tsx`, which composes the page from components in `src/components/`. Portfolio content and types are centralized in `src/data/portfolioData.ts`. Global styles and Tailwind CSS imports are in `src/index.css`.

Key interactions include section navigation, mobile navigation, project category filtering and case-study modals, resume modal/download, copy-email controls, and client-side contact-form validation. The custom cursor checks pointer capability and reduced-motion preference.

## Important current limitations

- `package.json` currently declares no app dependencies. Source imports `react`, `react-dom`, `lucide-react`, and Tailwind CSS. The current package lock also lacks those dependencies, so a clean install/build is not ready as-is.
- The contact form in `src/components/Contact.tsx` simulates a successful submission; no message is sent to a backend or provider.
- Resume actions point to `/resume.pdf`, but no such file is present in `public/`.
- `README.md` still contains AI Studio / Gemini API setup instructions. Confirm whether those apply before following them; the portfolio source currently uses static project data and a simulated contact submission.

## Local commands

The scripts declared in `package.json` are `npm run dev`, `npm run build`, and `npm run preview`. Resolve and declare the missing application dependencies before expecting these commands to run successfully from a clean checkout.
