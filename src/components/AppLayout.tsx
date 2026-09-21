import {
  Navigate,
  Outlet,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayout() {
  const {
    isAuthenticated,
    initializing,
  } = useAuth();

  if (initializing) {
    return (
      <div className="application-loading">
        <div className="loading-card">
          <div className="loading-spinner" />

          <h2>SafetyCopilot</h2>

          <p>
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}