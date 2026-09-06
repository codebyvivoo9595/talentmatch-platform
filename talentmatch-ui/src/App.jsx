import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { AnalysisProvider } from "./context/AnalysisContext";

// Note: SnackbarProvider and ThemeProvider are in main.jsx — not duplicated here

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnalysisProvider>
          <AppRoutes />
        </AnalysisProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
