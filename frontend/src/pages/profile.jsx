import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const emptyProfile = {
  name: "",
  email: "",
  location: "",
  profilePhoto: "",
  sustainabilityPreferences: [],
  environmentalInterests: [],
  personalGoalPreferences: [],
};

const formatValue = (value) => {
  if (!value) return "Not provided";

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not selected";
  }

  return value;
};

export default function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [formData, setFormData] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/profile`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load profile");
      }

      const profileData = {
        ...emptyProfile,
        ...data.profile,
      };

      setProfile(profileData);
      setFormData(profileData);
      setPhotoPreview(profileData.profilePhoto || "");
    } catch (err) {
      setError(err.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be smaller than 5 MB.");
      return;
    }

    setError("");
    setSelectedPhoto(file);

    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
  };

  const deletePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview("");

    setFormData((current) => ({
      ...current,
      profilePhoto: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEditing = () => {
    setFormData(profile);
    setPhotoPreview(profile.profilePhoto || "");
    setSelectedPhoto(null);
    setMessage("");
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setFormData(profile);
    setPhotoPreview(profile.profilePhoto || "");
    setSelectedPhoto(null);
    setMessage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setEditing(false);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const body = {
        name: formData.name,
        location: formData.location,
        profilePhoto: formData.profilePhoto || "",
        sustainabilityPreferences: formData.sustainabilityPreferences || [],
        environmentalInterests: formData.environmentalInterests || [],
        personalGoalPreferences: formData.personalGoalPreferences || [],
      };

      const response = await fetch(`${API_URL}/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update profile");
      }

      const updatedProfile = {
        ...profile,
        ...formData,
        profilePhoto: formData.profilePhoto || "",
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setPhotoPreview(updatedProfile.profilePhoto || "");
      setSelectedPhoto(null);
      setEditing(false);
      setMessage("Profile updated successfully.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getInitial = () => {
    return profile.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-[#173b2d]">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <div className="rounded-2xl border border-[#dfe9e3] bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#e8f2ec] bg-[#edf5ef] shadow-sm">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#5b8f72]">
                    {getInitial()}
                  </div>
                )}
              </div>

              <h2 className="mt-5 text-xl font-semibold text-[#173b2d]">
                {profile.name || "Your Name"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {profile.email || "Your Email"}
              </p>

              {editing && (
                <div className="mt-6 w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl bg-[#2f6f4e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#255d40]"
                  >
                    Upload Photo
                  </button>

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={deletePhoto}
                      className="mt-3 w-full rounded-xl border border-[#d7e3db] px-4 py-3 text-sm font-semibold text-[#2f6f4e] transition hover:bg-[#f3f8f4]"
                    >
                      Delete Photo
                    </button>
                  )}

                  {selectedPhoto && (
                    <p className="mt-3 break-words text-xs text-gray-400">
                      {selectedPhoto.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe9e3] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#173b2d]">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your information connected to your EcoTrack account.
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="rounded-xl bg-[#2f6f4e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#255d40]"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#355445]">
                  Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d7e3db] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#5b8f72] focus:ring-2 focus:ring-[#e8f2ec]"
                  />
                ) : (
                  <div className="rounded-xl bg-[#f5f8f6] px-4 py-3 text-sm text-gray-800">
                    {formatValue(profile.name)}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#355445]">
                  Email
                </label>

                <div className="rounded-xl bg-[#f5f8f6] px-4 py-3 text-sm text-gray-800">
                  {formatValue(profile.email)}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#355445]">
                  Location
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d7e3db] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#5b8f72] focus:ring-2 focus:ring-[#e8f2ec]"
                  />
                ) : (
                  <div className="rounded-xl bg-[#f5f8f6] px-4 py-3 text-sm text-gray-800">
                    {formatValue(profile.location)}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#355445]">
                  Your Role
                </label>

                <div className="flex items-center justify-between rounded-xl bg-[#f5f8f6] px-4 py-3">
                  <span className="text-sm text-gray-800">Member</span>
                  <span className="rounded-full bg-[#e3f0e7] px-3 py-1 text-xs font-semibold text-[#2f6f4e]">
                    Account Role
                  </span>
                </div>
              </div>
            </div>

            {editing && (
              <div className="mt-8 flex justify-end gap-3 border-t border-[#edf1ee] pt-6">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-xl border border-[#d7e3db] px-5 py-2.5 text-sm font-semibold text-[#355445] transition hover:bg-[#f5f8f6] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-xl bg-[#2f6f4e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#255d40] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#dfe9e3] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#173b2d]">
              Preferences / Interests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your selected sustainability interests and personal goals will
              appear here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5ece7] bg-[#f8faf9] p-5">
              <h3 className="text-sm font-semibold text-[#355445]">
                Sustainability Preferences
              </h3>
              <p className="mt-3 text-sm text-gray-500">
                {formatValue(profile.sustainabilityPreferences)}
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ece7] bg-[#f8faf9] p-5">
              <h3 className="text-sm font-semibold text-[#355445]">
                Environmental Interests
              </h3>
              <p className="mt-3 text-sm text-gray-500">
                {formatValue(profile.environmentalInterests)}
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ece7] bg-[#f8faf9] p-5">
              <h3 className="text-sm font-semibold text-[#355445]">
                Personal Goal Preferences
              </h3>
              <p className="mt-3 text-sm text-gray-500">
                {formatValue(profile.personalGoalPreferences)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}