import { useEffect, useRef, useState } from "react";

const PROFILE_URL = import.meta.env.VITE_PROFILE_URL;

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

      const response = await fetch(`${PROFILE_URL}/`, {
       credentials: "include",
  });
      const data = await response.json();

      if (!response.ok) {
       throw new Error(data.message || "Unable to load profile");
  }

      const profileData = {
        ...emptyProfile,
        ...data,
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

      const body = new FormData();

      body.append("name", formData.name || "");
      body.append("location", formData.location || "");
      body.append(
       "sustainabilityPreferences",
       JSON.stringify(formData.sustainabilityPreferences || [])
      );
      body.append(
       "environmentalInterests",
       JSON.stringify(formData.environmentalInterests || [])
     );
    body.append(
      "personalGoalPreferences",
      JSON.stringify(formData.personalGoalPreferences || [])
    );

    if (selectedPhoto) {
     body.append("profilePhoto", selectedPhoto);
    }

      const response = await fetch(`${PROFILE_URL}/`, {
       method: "PATCH",
       credentials: "include",
       body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      const updatedProfile = {
        ...emptyProfile,
        ...data,
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
      <div className="min-h-screen bg-[#f5f8f6] flex items-center justify-center animate-pulse">
        <div className="text-sm text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 animate-[fadeDown_0.6s_ease-out]">
          <h1 className="text-3xl font-bold text-[#173b2d] transition duration-300 hover:tracking-wide">
            Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 animate-[fadeDown_0.45s_ease-out]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-[fadeDown_0.45s_ease-out]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <div className="group rounded-2xl border border-[#dfe9e3] bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg animate-[fadeUp_0.65s_ease-out]">
            <div className="flex flex-col items-center text-center">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#e8f2ec] bg-[#edf5ef] shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:shadow-md">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#5b8f72] transition-transform duration-500 group-hover:scale-110">
                    {getInitial()}
                  </div>
                )}
              </div>

              <h2 className="mt-5 text-xl font-semibold text-[#173b2d] transition duration-300 group-hover:text-[#2f6f4e]">
                {profile.name || "Your Name"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {profile.email || "Your Email"}
              </p>

              {editing && (
                <div className="mt-6 w-full animate-[fadeUp_0.4s_ease-out]">
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
                    className="w-full rounded-xl bg-[#2f6f4e] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#255d40] hover:shadow-md active:translate-y-0"
                  >
                    Upload Photo
                  </button>

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={deletePhoto}
                      className="mt-3 w-full rounded-xl border border-[#d7e3db] px-4 py-3 text-sm font-semibold text-[#2f6f4e] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f3f8f4] hover:shadow-sm active:translate-y-0"
                    >
                      Delete Photo
                    </button>
                  )}

                  {selectedPhoto && (
                    <p className="mt-3 break-words text-xs text-gray-400 animate-[fadeIn_0.35s_ease-out]">
                      {selectedPhoto.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe9e3] bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md md:p-8 animate-[fadeUp_0.75s_ease-out]">
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
                  className="rounded-xl bg-[#2f6f4e] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#255d40] hover:shadow-md active:translate-y-0"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="animate-[fadeUp_0.7s_ease-out]">
                <label className="mb-2 block text-sm font-medium text-[#355445]">
                  Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d7e3db] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 focus:border-[#5b8f72] focus:ring-2 focus:ring-[#e8f2ec] focus:shadow-sm"
                  />
                ) : (
                  <div className="rounded-xl bg-[#f5f8f6] px-4 py-3 text-sm text-gray-800 transition-all duration-300 hover:bg-[#edf5ef]">
                    {formatValue(profile.name)}
                  </div>
                )}
              </div>

              <div className="animate-[fadeUp_0.8s_ease-out]">
                <label className="mb-2 block text-sm font-medium text-[#355445]">
                  Email
                </label>

                <div className="rounded-xl bg-[#f5f8f6] px-4 py-3 text-sm text-gray-800 transition-all duration-300 hover:bg-[#edf5ef]">
                  {formatValue(profile.email)}
                </div>
              </div>

              <div className="animate-[fadeUp_0.9s_ease-out]">
                <label className="mb-2 block text-sm font-medium text-[#355445]">
                  Location
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d7e3db] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 focus:border-[#5b8f72] focus:ring-2 focus:ring-[#e8f2ec] focus:shadow-sm"
                  />
                ) : (
                  <div className="rounded-xl bg-[#f5f8f6] px-4 py-3 text-sm text-gray-800 transition-all duration-300 hover:bg-[#edf5ef]">
                    {formatValue(profile.location)}
                  </div>
                )}
              </div>

              <div className="animate-[fadeUp_1s_ease-out]">
                <label className="mb-2 block text-sm font-medium text-[#355445]">
                  Your Role
                </label>

                <div className="flex items-center justify-between rounded-xl bg-[#f5f8f6] px-4 py-3 transition-all duration-300 hover:bg-[#edf5ef]">
                  <span className="text-sm text-gray-800">Member</span>
                  <span className="rounded-full bg-[#e3f0e7] px-3 py-1 text-xs font-semibold text-[#2f6f4e] transition-transform duration-300 hover:scale-105">
                    Account Role
                  </span>
                </div>
              </div>
            </div>

            {editing && (
              <div className="mt-8 flex justify-end gap-3 border-t border-[#edf1ee] pt-6 animate-[fadeUp_0.45s_ease-out]">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-xl border border-[#d7e3db] px-5 py-2.5 text-sm font-semibold text-[#355445] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f5f8f6] hover:shadow-sm active:translate-y-0 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-xl bg-[#2f6f4e] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#255d40] hover:shadow-md active:translate-y-0 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#dfe9e3] bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md md:p-8 animate-[fadeUp_0.9s_ease-out]">
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
            <div className="group rounded-xl border border-[#e5ece7] bg-[#f8faf9] p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[#cbded1] hover:bg-[#f3f8f4] hover:shadow-sm animate-[fadeUp_0.9s_ease-out]">
              <h3 className="text-sm font-semibold text-[#355445] transition-colors duration-300 group-hover:text-[#2f6f4e]">
                Sustainability Preferences
              </h3>
              <p className="mt-3 text-sm text-gray-500">
                {formatValue(profile.sustainabilityPreferences)}
              </p>
            </div>

            <div className="group rounded-xl border border-[#e5ece7] bg-[#f8faf9] p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[#cbded1] hover:bg-[#f3f8f4] hover:shadow-sm animate-[fadeUp_1s_ease-out]">
              <h3 className="text-sm font-semibold text-[#355445] transition-colors duration-300 group-hover:text-[#2f6f4e]">
                Environmental Interests
              </h3>
              <p className="mt-3 text-sm text-gray-500">
                {formatValue(profile.environmentalInterests)}
              </p>
            </div>

            <div className="group rounded-xl border border-[#e5ece7] bg-[#f8faf9] p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[#cbded1] hover:bg-[#f3f8f4] hover:shadow-sm animate-[fadeUp_1.1s_ease-out]">
              <h3 className="text-sm font-semibold text-[#355445] transition-colors duration-300 group-hover:text-[#2f6f4e]">
                Personal Goal Preferences
              </h3>
              <p className="mt-3 text-sm text-gray-500">
                {formatValue(profile.personalGoalPreferences)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}