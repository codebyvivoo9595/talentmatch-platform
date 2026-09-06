# TalentMatch Platform — Project Overview

## What This Project Does

TalentMatch is an AI-powered resume-to-job-description matching platform.

**User flow:**
1. User uploads their resume (PDF) and pastes a job description
2. The API parses the resume text, sends both to an AI model (OpenRouter / LLaMA-3)
3. AI scores the match across 5 categories and identifies missing skills
4. A final percentage score is calculated and returned
5. The dashboard shows score, skill gaps, and AI suggestions

---

## Repository Structure

```
TalentMatch-Platform/
├── TalentMatch.Api/          ← .NET 8 Web API (backend)
│   └── TalentMatch.Api/
│       ├── Controllers/
│       ├── Domain/Entities/
│       ├── DTOs/Auth/
│       ├── Models/
│       ├── Services/
│       ├── Data/
│       ├── Migrations/
│       └── Program.cs
│
└── TalentMatch.Ui/           ← React + Vite (frontend)
    └── talentmatch-ui/
        └── src/
            ├── pages/
            ├── components/
            │   ├── analyze/
            │   ├── dashboard/
            │   └── common/
            ├── routes/
            ├── layouts/
            ├── animations/
            └── theme/
```

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 19, Vite, MUI v7, Framer Motion, React Router v7 |
| Backend   | .NET 8 Web API                    |
| Auth      | JWT Bearer tokens                 |
| AI        | OpenRouter API (LLaMA-3-8B)       |
| Database  | SQL Server (EF Core)              |
| PDF Parse | Resume parser service (PDF stream)|

---

## Current Status (as of analysis date: Sep 5, 2026)

- **API** — Fully implemented, all endpoints working
- **UI** — Pages and components built with **mock/hardcoded data**
- **Integration** — NOT YET DONE. Axios is not installed. No API calls exist in the UI.

---

## What Needs to Be Done

1. Install axios in the React project
2. Set up axios instance with base URL + JWT interceptor
3. Create auth service (login, register) connected to API
4. Create analyze service (POST multipart/form-data to `/api/analyze`)
5. Store JWT token and analysis result (Context API or localStorage)
6. Replace all mock data in dashboard components with real API data
7. Add login/register UI (or at minimum connect the existing Login button in Header)
8. Add CORS config to the .NET API to allow React dev server
9. Handle loading states and error states in the UI
