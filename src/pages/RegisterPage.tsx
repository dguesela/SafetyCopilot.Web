import {
  
  useState,
} from "react";

import type {
  FormEvent,
  
} from "react";


import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  register,
} from "../api/authApi";

import {
  useAuth,
} from "../contexts/AuthContext";

export default function RegisterPage() {
  const navigate =
    useNavigate();

  const {
    isAuthenticated,
    initializing,
  } = useAuth();

  const [
    displayName,
    setDisplayName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    success,
    setSuccess,
  ] = useState<string | null>(null);

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

    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError(
        "Email is required."
      );

      return;
    }

    if (!password) {
      setError(
        "Password is required."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setSubmitting(true);

      await register({
        email: email.trim(),
        password,
        displayName:
          displayName.trim() ||
          null,
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      window.setTimeout(
        () => {
          navigate(
            "/login",
            {
              replace: true,
              state: {
                registered: true,
                email:
                  email.trim(),
              },
            }
          );
        },
        800
      );
    } catch (err: any) {
      console.error(err);

      if (
        err?.response?.status ===
        409
      ) {
        setError(
          err.response.data?.message ??
            "An account with this email already exists."
        );

        return;
      }

      setError(
        err?.response?.data?.message ??
          "Unable to create the account."
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
            Create your account
          </h2>

          <p>
            Create a researcher account
            to begin a human–AI hazard
            classification study.
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <div className="form-group">
            <label
              htmlFor="displayName"
            >
              Display Name
            </label>

            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value
                )
              }
              placeholder="Researcher name"
              maxLength={200}
              autoComplete="name"
            />
          </div>

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
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={
                confirmPassword
              }
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="button button-primary auth-submit"
            disabled={submitting}
          >
            {submitting
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}

          <Link to="/login">
            Sign in
          </Link>
        </div>

        <div className="auth-research-note">
          <strong>
            Research Prototype
          </strong>

          <p>
            This account identifies the
            researcher or participant
            performing human requirement
            classifications.
          </p>
        </div>
      </div>
    </div>
  );
}