# TalentMatch API — Endpoints Reference

**Base URL (dev):** `https://localhost:7180/api`
> From `launchSettings.json` — https profile port is 7180, http is 5170.

---

## Authentication

### POST `/api/auth/register`
Register a new user.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Responses:**
- `200 OK` — Registration successful (empty body)
- `400 Bad Request` — `"User already exists"`

---

### POST `/api/auth/login`
Login and receive a JWT token.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-09-05T16:47:00Z"
}
```

**Responses:**
- `200 OK` — Returns token + expiry
- `401 Unauthorized` — `"Invalid credentials"`

---

## Analysis

### POST `/api/analyze`
Analyze a resume PDF against a job description.

**Auth:** JWT Bearer token required (`Authorization: Bearer <token>`)
> NOTE: `[Authorize]` is currently commented out in the controller — works without auth for now.

**Request:** `multipart/form-data`
| Field            | Type   | Description                    |
|------------------|--------|--------------------------------|
| `resume`         | File   | PDF file, max 5MB              |
| `jobDescription` | string | Job description text (required)|

**Response (200 OK):**
```json
{
  "id": "guid",
  "finalPercentage": 72.5,
  "aiResponse": {
    "skills":     { "score": 4, "reason": "line1\nline2\nline3\nline4" },
    "techStack":  { "score": 3, "reason": "line1\nline2\nline3\nline4" },
    "projects":   { "score": 3, "reason": "line1\nline2\nline3\nline4" },
    "experience": { "score": 4, "reason": "line1\nline2\nline3\nline4" },
    "overall":    { "score": 4, "reason": "line1\nline2\nline3\nline4" },
    "missingSkills": ["Docker", "CI/CD", "Azure"]
  },
  "suggestions": [
    "suggestion text 1",
    "suggestion text 2"
  ],
  "missingSkills": ["Docker", "CI/CD", "Azure"]
}
```

**Error Responses:**
- `400 Bad Request` — Resume missing / not PDF / over 5MB / JD empty
- `401 Unauthorized` — No/invalid JWT (when auth is enabled)
- `500 Internal Server Error` — AI call failed

---

## Score Calculation Logic

Score is weighted across 5 categories (max 100%):

| Category    | Weight |
|-------------|--------|
| Skills      | 30%    |
| Tech Stack  | 30%    |
| Projects    | 20%    |
| Experience  | 10%    |
| Overall Fit | 10%    |

Each AI score is `0–5`, converted to percentage: `(score / 5) * weight`

---

## AI Model

- Provider: OpenRouter
- Model: `meta-llama/llama-3-8b-instruct`
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Temperature: 0.2
- API Key: stored in `appsettings.json` under `AISettings.ApiKey`
