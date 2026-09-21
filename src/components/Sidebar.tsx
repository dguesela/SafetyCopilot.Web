import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function getLinkClass({
    isActive,
  }: {
    isActive: boolean;
  }) {
    return isActive
      ? "sidebar-link sidebar-link-active"
      : "sidebar-link";
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          SC
        </div>

        <div>
          <h1>SafetyCopilot</h1>
          <p>Human–AI Safety Analysis</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={getLinkClass}
        >
          <span className="sidebar-icon">
            ◫
          </span>

          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={getLinkClass}
        >
          <span className="sidebar-icon">
            ▣
          </span>

          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={getLinkClass}
        >
          <span className="sidebar-icon">
            ●
          </span>

          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.displayName
              ? user.displayName
                  .charAt(0)
                  .toUpperCase()
              : user?.email
                ?.charAt(0)
                .toUpperCase() ?? "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>
              {user?.displayName ||
                "Researcher"}
            </strong>

            <span>
              {user?.email}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}