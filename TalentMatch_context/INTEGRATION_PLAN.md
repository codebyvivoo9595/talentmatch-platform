# TalentMatch — UI ↔ API Integration Plan

## Goal
Connect the React frontend to the .NET API using axios. Replace all mock data with real API responses.

---

## Step 1: Install Axios
```bash
cd talentmatch-ui
npm install axios
```

---

## Step 2: Add CORS to .NET API (Program.cs)
The React dev server runs on a different port. Add CORS before `app.UseHttpsRedirection()`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // Vite default port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// In middleware pipeline:
app.UseCors("AllowReactApp");
```

---

## Step 3: Create Axios Instance (src/api/axiosInstance.js)
```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:{API_PORT}/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## Step 4: Create Auth Service (src/api/authService.js)
```js
import api from './axiosInstance';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (email, password) =>
  api.post('/auth/register', { email, password });
```

---

## Step 5: Create Analyze Service (src/api/analyzeService.js)
```js
import api from './axiosInstance';

export const analyzeResume = (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);

  return api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
```

---

## Step 6: Create Auth Context (src/context/AuthContext.jsx)
Store JWT token + user state globally. Provide login/logout methods.

---

## Step 7: Create Analysis Context (src/context/AnalysisContext.jsx)
Store the analysis result after API call so DashboardPage can read it.

---

## Step 8: Wire AnalyzeModal to Real API
- On "Analyze" click, call `analyzeResume(resumeFile, jobDescription)`
- Show loading spinner
- On success: store result in AnalysisContext, navigate to `/dashboard`
- On error: show snackbar error message

---

## Step 9: Replace Mock Data in Dashboard

| Component          | Replace with                                       |
|--------------------|----------------------------------------------------|
| `MatchScoreCard`   | `result.finalPercentage`                           |
| `SkillsAnalysis`   | `result.missingSkills` + parse matched from aiResponse |
| `SuggestionsCard`  | `result.suggestions`                               |

---

## Step 10: Add Login/Register UI
Wire the "Login" button in Header to open a modal with login/register form.

---

## API Response Shape (for mapping to UI)

```json
{
  "id": "guid",
  "finalPercentage": 72.5,
  "aiResponse": {
    "skills":     { "score": 4, "reason": "..." },
    "techStack":  { "score": 3, "reason": "..." },
    "projects":   { "score": 3, "reason": "..." },
    "experience": { "score": 4, "reason": "..." },
    "overall":    { "score": 4, "reason": "..." },
    "missingSkills": ["Docker", "CI/CD", "Azure"]
  },
  "suggestions": ["Add Docker experience...", "..."],
  "missingSkills": ["Docker", "CI/CD", "Azure"]
}
```

**UI Mapping:**
- `finalPercentage` → MatchScoreCard circular progress value
- `missingSkills` → SkillsAnalysis "Missing Skills" chips
- `aiResponse.skills.reason`, `techStack.reason` etc. → parsed for SkillsAnalysis "Matched" section
- `suggestions` → SuggestionsCard list
- `aiResponse.*.score` → can be shown as individual category scores (optional enhancement)
