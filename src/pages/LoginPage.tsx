import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";


import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    login,
    isAuthenticated,
    initializing,
  } = useAuth();

  const state =
    location.state as
      | {
          registered?: boolean;
          email?: string;
        }
      | null;

  const [
    email,
    setEmail,
  ] = useState(
    state?.email ?? ""
  );

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  if (initializing) {
    return (
      <div className="page-loading">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      await login({
        email: email.trim(),
        password,
      });

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (err: any) {
      console.error(err);

      if (
        err?.response?.status ===
        401
      ) {
        setError(
          "Invalid email or password."
        );

        return;
      }

      setError(
        err?.response?.data?.message ??
          "Unable to sign in."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="auth-brand-mark">
            SC
          </div>

          <div>
            <h1>
              SafetyCopilot
            </h1>

            <p>
              Human–AI Safety Analysis
            </p>
          </div>
        </div>

        <div className="auth-heading">
          <h2>
            Sign in
          </h2>

          <p>
            Sign in to continue your
            safety classification
            research.
          </p>
        </div>

        {state?.registered && (
          <div className="alert alert-success">
            Account created successfully.
            You can now sign in.
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <div className="form-group">
            <label
              htmlFor="email"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="researcher@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="password"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="button button-primary auth-submit"
            disabled={submitting}
          >
            {submitting
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}

          <Link to="/register">
            Create account
          </Link>
        </div>

        <div className="auth-research-note">
          <strong>
            Research Prototype
          </strong>

          <p>
            SafetyCopilot compares
            independent human and AI
            hazard classifications of
            software requirements.
          </p>
        </div>
      </div>
    </div>
  );
}