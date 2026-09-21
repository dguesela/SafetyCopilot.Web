import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/AppLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import RequirementsPage from "./pages/RequirementsPage";
import AiClassificationResultsPage from "./pages/AiClassificationResultsPage";
import AnalysisPage from "./pages/AnalysisPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        element={<AppLayout />}
      >
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/projects"
          element={<ProjectsPage />}
        />

        <Route
          path="/projects/:projectId"
          element={<ProjectDetailsPage />}
        />

        <Route
          path="/projects/:projectId/upload"
          element={<UploadDocumentPage />}
        />

        <Route
          path="/projects/:projectId/requirements"
          element={<RequirementsPage />}
        />

        <Route
          path="/projects/:projectId/ai-results"
          element={<AiClassificationResultsPage />}
        />

        <Route
          path="/projects/:projectId/analysis"
          element={<AnalysisPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}