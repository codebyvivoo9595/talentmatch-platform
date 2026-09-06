# TalentMatch UI — Structure & Component Map

**Location:** `D:\Vivek\Project\TalentMatch-Platform\TalentMatch.Ui\talentmatch-ui`

**Stack:** React 19 + Vite + MUI v7 + React Router v7 + Framer Motion + notistack

---

## Folder Structure

```
src/
├── App.jsx                    ← Root: wraps BrowserRouter + AppRoutes
├── main.jsx                   ← Entry point
├── index.css                  ← Global styles
│
├── routes/
│   └── AppRoutes.jsx          ← Route definitions
│
├── layouts/
│   └── MainLayout.jsx         ← Shared layout (Header + Outlet + Footer)
│
├── pages/
│   ├── LandingPage.jsx        ← Hero, How It Works, opens AnalyzeModal
│   └── DashboardPage.jsx      ← Shows score + skills + suggestions (MOCK DATA)
│
├── components/
│   ├── Header.jsx             ← AppBar with Login button (not wired)
│   ├── Footer.jsx             ← Footer
│   │
│   ├── analyze/
│   │   ├── AnalyzeModal.jsx       ← 3-step stepper modal
│   │   ├── ResumeUploadStep.jsx   ← PDF drag & drop / file picker
│   │   ├── JobDescriptionStep.jsx ← Textarea for JD (100–3000 chars)
│   │   └── ReviewAnalyzeStep.jsx  ← Preview before submitting
│   │
│   ├── dashboard/
│   │   ├── MatchScoreCard.jsx     ← Circular progress score (MOCK: 72%)
│   │   ├── SkillsAnalysis.jsx     ← Matched/missing skills chips (MOCK)
│   │   └── SuggestionsCard.jsx    ← AI suggestions list (MOCK)
│   │
│   └── common/
│       └── PrimaryButton.jsx      ← Styled button component
│
├── animations/
│   └── motionVariants.js      ← Framer Motion variants (fadeUp, etc.)
│
└── theme/                     ← MUI theme configuration
```

---

## Current Routes

| Path         | Component       | Notes                          |
|--------------|-----------------|--------------------------------|
| `/`          | LandingPage     | Hero + How It Works            |
| `/dashboard` | DashboardPage   | Score/Skills/Suggestions       |

---

## Mock Data Locations (to be replaced with API data)

| File                     | Mock Data                          |
|--------------------------|------------------------------------|
| `MatchScoreCard.jsx`     | `const MATCH_SCORE = 72`           |
| `SkillsAnalysis.jsx`     | Hardcoded `matchedSkills` array and `missingSkills` array |
| `SuggestionsCard.jsx`    | Hardcoded `suggestions` array      |

---

## What AnalyzeModal Currently Does (No API)

1. Step 0: User selects PDF file → stored in `resumeFile` state
2. Step 1: User types JD → stored in `jobDescription` state
3. Step 2: Preview of file name + JD snippet
4. On "Analyze" click → calls `onComplete({ resumeFile, jobDescription })` — no API call
5. LandingPage receives the data via `onComplete`, logs it, and navigates to `/dashboard`
6. Dashboard shows hardcoded mock data — not the real result

---

## Missing From UI (Needs to be Added for Integration)

1. `axios` package (not installed)
2. `api/` folder with axios instance + interceptors
3. `context/` or state management to share analysis result between pages
4. Auth context (token storage, login/logout state)
5. Login/Register modal or page
6. Loading spinner during API call in AnalyzeModal
7. Error handling/display in AnalyzeModal
8. Dashboard components wired to real API response data
