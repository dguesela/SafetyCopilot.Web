import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  getProfile,
  removeOpenAiApiKey,
  saveOpenAiApiKey,
  updateProfile,
} from "../api/profileApi";

import { useAuth } from "../contexts/AuthContext";

import type { Profile } from "../types/profile";

export default function ProfilePage() {
  const {
    user,
    updateStoredUser,
  } = useAuth();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [displayName, setDisplayName] =
    useState("");

  const [apiKey, setApiKey] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingApiKey, setSavingApiKey] =
    useState(false);

  const [removingApiKey, setRemovingApiKey] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result =
          await getProfile(user.id);

        setProfile(result);

        setDisplayName(
          result.displayName ?? ""
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      clearMessages();
      setSavingProfile(true);

      const updated =
        await updateProfile(
          user.id,
          {
            displayName:
              displayName.trim() ||
              null,
          }
        );

      setProfile(updated);

      updateStoredUser({
        id: updated.id,
        email: updated.email,
        displayName:
          updated.displayName,
      });

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleApiKeySubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const trimmedKey =
      apiKey.trim();

    if (!trimmedKey) {
      setError(
        "Enter an OpenAI API key."
      );

      return;
    }

    try {
      clearMessages();
      setSavingApiKey(true);

      await saveOpenAiApiKey(
        user.id,
        trimmedKey
      );

      setApiKey("");

      setProfile((current) =>
        current
          ? {
              ...current,
              hasOpenAiApiKey: true,
            }
          : current
      );

      setSuccess(
        "OpenAI API key saved successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to save the OpenAI API key."
      );
    } finally {
      setSavingApiKey(false);
    }
  }

  async function handleRemoveApiKey() {
    if (!user) {
      return;
    }

    const confirmed =
      window.confirm(
        "Remove your saved OpenAI API key?"
      );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();
      setRemovingApiKey(true);

      await removeOpenAiApiKey(
        user.id
      );

      setProfile((current) =>
        current
          ? {
              ...current,
              hasOpenAiApiKey: false,
            }
          : current
      );

      setApiKey("");

      setSuccess(
        "OpenAI API key removed."
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to remove the OpenAI API key."
      );
    } finally {
      setRemovingApiKey(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <p>
          You must log in to view your
          profile.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <h1>Profile</h1>

        <div className="alert alert-error">
          {error ??
            "Unable to load your profile."}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Profile</h1>

          <p className="page-subtitle">
            Manage your researcher profile
            and AI configuration.
          </p>
        </div>
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

      {/* Researcher Profile */}
      <section className="profile-card">
        <div className="profile-card-header">
          <div>
            <h2>
              Researcher Profile
            </h2>

            <p>
              Basic information associated
              with your SafetyCopilot
              account.
            </p>
          </div>
        </div>

        <form
          onSubmit={
            handleProfileSubmit
          }
        >
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
            />

            <small>
              Your email address is used
              for login.
            </small>
          </div>

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
              maxLength={200}
              placeholder="Your name"
              onChange={(event) =>
                setDisplayName(
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={savingProfile}
            >
              {savingProfile
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>
        </form>
      </section>

      {/* OpenAI Configuration */}
      <section className="profile-card">
        <div className="profile-card-header">
          <div>
            <h2>
              OpenAI Configuration
            </h2>

            <p>
              Configure the API key used
              when SafetyCopilot runs the
              independent AI hazard
              classification.
            </p>
          </div>
        </div>

        <div className="api-key-status">
          <span>
            API Key Status
          </span>

          {profile.hasOpenAiApiKey ? (
            <span className="status-badge status-configured">
              Configured
            </span>
          ) : (
            <span className="status-badge status-not-configured">
              Not Configured
            </span>
          )}
        </div>

        {profile.hasOpenAiApiKey && (
          <div className="api-key-notice">
            <strong>
              An API key is currently
              configured.
            </strong>

            <p>
              For security, the saved key
              is encrypted on the server
              and is never returned to the
              browser.
            </p>
          </div>
        )}

        <form
          onSubmit={
            handleApiKeySubmit
          }
        >
          <div className="form-group">
            <label htmlFor="apiKey">
              {profile.hasOpenAiApiKey
                ? "Replace API Key"
                : "OpenAI API Key"}
            </label>

            <input
              id="apiKey"
              type="password"
              value={apiKey}
              placeholder="Enter API key"
              autoComplete="off"
              onChange={(event) =>
                setApiKey(
                  event.target.value
                )
              }
            />

            <small>
              The key is sent to the
              SafetyCopilot backend and
              stored encrypted.
            </small>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={
                savingApiKey ||
                !apiKey.trim()
              }
            >
              {savingApiKey
                ? "Saving..."
                : profile.hasOpenAiApiKey
                  ? "Replace API Key"
                  : "Save API Key"}
            </button>

            {profile.hasOpenAiApiKey && (
              <button
                type="button"
                className="button button-danger"
                disabled={
                  removingApiKey
                }
                onClick={
                  handleRemoveApiKey
                }
              >
                {removingApiKey
                  ? "Removing..."
                  : "Remove API Key"}
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Research Protocol */}
      <section className="profile-card">
        <div className="profile-card-header">
          <div>
            <h2>
              AI Classification Protocol
            </h2>

            <p>
              SafetyCopilot keeps the human
              and AI classifications
              separate during the
              experiment.
            </p>
          </div>
        </div>

        <div className="protocol-grid">
          <div className="protocol-step">
            <div className="protocol-number">
              1
            </div>

            <div>
              <strong>
                Human Classification
              </strong>

              <p>
                You classify every
                requirement as Hazard or
                Not Hazard.
              </p>
            </div>
          </div>

          <div className="protocol-step">
            <div className="protocol-number">
              2
            </div>

            <div>
              <strong>
                AI Classification
              </strong>

              <p>
                After human classification
                is complete, the AI
                independently evaluates the
                same requirements.
              </p>
            </div>
          </div>

          <div className="protocol-step">
            <div className="protocol-number">
              3
            </div>

            <div>
              <strong>
                Comparison
              </strong>

              <p>
                The Analysis page compares
                agreement and disagreement
                between the human and AI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}