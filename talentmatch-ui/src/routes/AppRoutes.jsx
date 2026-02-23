import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;