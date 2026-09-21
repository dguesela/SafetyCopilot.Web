import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function AppLayout() {
  const navigate = useNavigate();

  const { user, logout } =
    useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            S
          </div>

          <div>
            <strong>
              SafetyCopilot
            </strong>

            <small>
              Safety Engineering AI
            </small>
          </div>
        </div>

        <nav>
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/projects">
            Projects
          </Link>

          <Link to="/requirements">
            Requirements
          </Link>

          <Link to="/hazards">
            Hazard Analysis
          </Link>

          <Link to="/failure-modes">
            Failure Modes
          </Link>

          <Link to="/constraints">
            Safety Constraints
          </Link>

          <Link to="/safety-cases">
            Safety Cases
          </Link>

          <Link to="/incidents">
            Incidents
          </Link>

          <Link to="/experiments">
            Experiments
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">
              {user?.firstName
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user?.firstName}{" "}
                {user?.lastName}
              </strong>

              <small>
                {user?.email}
              </small>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}