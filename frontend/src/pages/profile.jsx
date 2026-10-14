import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

const sustainabilityPreferenceOptions = [
  "small daily changes",
  "weekly challenges",
  "reduce emissions",
  "reduce wastes",
  "sustainable waste disposal",
  "sustainable travel",
  "sustainable efficient electricity",
];

const environmentalInterestOptions = [
  "transportation",
  "electricity",
  "waste management",
  "build sustainable habits",
];

const personalGoalPreferenceOptions = [
  "short term goals",
  "long term goals",
  "measurable progress",
  "emission reduction goals",
  "carbon saving goals",
];

const formatValue = (value) => {
  if (!value) return "Not provided";

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not selected";
  }

  return value;
};

const formatLabel = (value) => {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [formData, setFormData] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${PROFILE_URL}/`, {
        withCredentials: true,
      });

      const { success, message, profile: profileData } = data;

      if (success) {
        const updatedProfile = {
          ...emptyProfile,
          ...(profileData || {}),
        };

        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setPhotoPreview(updatedProfile.profilePhoto || "");
      } else {
        toast.error(message || "Unable to load profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load profile");
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

  const handlePreferenceChange = (field, value) => {
    setFormData((current) => {
      const selectedValues = current[field] || [];

      return {
        ...current,
        [field]: selectedValues.includes(value)
          ? selectedValues.filter((item) => item !== value)
          : [...selectedValues, value],
      };
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be smaller than 5 MB.");
      return;
    }

    setSelectedPhoto(file);

    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
  };

  const startEditing = () => {
    setFormData({
      ...profile,
      sustainabilityPreferences: [...(profile.sustainabilityPreferences || [])],
      environmentalInterests: [...(profile.environmentalInterests || [])],
      personalGoalPreferences: [...(profile.personalGoalPreferences || [])],
    });

    setPhotoPreview(profile.profilePhoto || "");
    setSelectedPhoto(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setFormData(profile);
    setPhotoPreview(profile.profilePhoto || "");
    setSelectedPhoto(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setEditing(false);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      const body = new FormData();

      body.append("name", formData.name || "");
      body.append("email", formData.email || "");
      body.append("location", formData.location || "");

      body.append(
        "sustainabilityPreferences",
        JSON.stringify(formData.sustainabilityPreferences || []),
      );

      body.append(
        "environmentalInterests",
        JSON.stringify(formData.environmentalInterests || []),
      );

      body.append(
        "personalGoalPreferences",
        JSON.stringify(formData.personalGoalPreferences || []),
      );

      if (selectedPhoto) {
        body.append("profilePhoto", selectedPhoto);
      }

      const { data } = await axios.patch(`${PROFILE_URL}/`, body, {
        withCredentials: true,
      });

      const { success, message } = data;

      if (success) {
        await loadProfile();

        setSelectedPhoto(null);
        setEditing(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.success(message || "Profile updated successfully.");
      } else {
        toast.error(message || "Unable to update profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getInitial = () => {
    return profile.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  };

  const renderPreferenceOptions = (field, options) => {
    return (
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = formData[field]?.includes(option);

          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-300 ${
                selected
                  ? "border-[#a9cbb5] bg-[#edf5ef] text-[#2f6f4e] shadow-sm"
                  : "border-[#e5ece7] bg-white text-gray-600 hover:border-[#cbded1] hover:bg-[#f8faf9]"
              }`}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => handlePreferenceChange(field, option)}
                className="h-4 w-4 accent-[#2f6f4e]"
              />

              <span>{formatLabel(option)}</span>
            </label>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] flex items-center justify-center animate-pulse">
        <div className="text-sm text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 animate-[fadeDown_0.6s_ease-out]">
          <h1 className="text-3xl font-bold text-[#173b2d] transition duration-300 hover:tracking-wide">
            Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

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

                <div className="flex cursor-not-allowed items-center rounded-xl border border-[#dfe9e3] bg-[#f5f8f6] px-4 py-3 text-sm text-gray-500">
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

                <div className="flex cursor-not-allowed items-center justify-between rounded-xl bg-[#f5f8f6] px-4 py-3 transition-all duration-300 hover:bg-[#edf5ef]">
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

              {editing ? (
                renderPreferenceOptions(
                  "sustainabilityPreferences",
                  sustainabilityPreferenceOptions,
                )
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  {formatValue(profile.sustainabilityPreferences)}
                </p>
              )}
            </div>

            <div className="group rounded-xl border border-[#e5ece7] bg-[#f8faf9] p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[#cbded1] hover:bg-[#f3f8f4] hover:shadow-sm animate-[fadeUp_1s_ease-out]">
              <h3 className="text-sm font-semibold text-[#355445] transition-colors duration-300 group-hover:text-[#2f6f4e]">
                Environmental Interests
              </h3>

              {editing ? (
                renderPreferenceOptions(
                  "environmentalInterests",
                  environmentalInterestOptions,
                )
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  {formatValue(profile.environmentalInterests)}
                </p>
              )}
            </div>

            <div className="group rounded-xl border border-[#e5ece7] bg-[#f8faf9] p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[#cbded1] hover:bg-[#f3f8f4] hover:shadow-sm animate-[fadeUp_1.1s_ease-out]">
              <h3 className="text-sm font-semibold text-[#355445] transition-colors duration-300 group-hover:text-[#2f6f4e]">
                Personal Goal Preferences
              </h3>

              {editing ? (
                renderPreferenceOptions(
                  "personalGoalPreferences",
                  personalGoalPreferenceOptions,
                )
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  {formatValue(profile.personalGoalPreferences)}
                </p>
              )}
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
