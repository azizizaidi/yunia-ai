import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  logoutUser
} from "../services/api";

/**
 * Custom hook for profile management
 * @returns {Object} Profile state and handlers
 */
const useProfile = () => {
  const router = useRouter();
  
  // Main states
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Avatar upload states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        const userProfile = await getUserProfile();

        if (currentUser && userProfile) {
          setUser(currentUser);
          setProfile(userProfile);

          // Prioritize avatar from currentUser (main user object) over profile
          const avatarToUse = currentUser.avatar || userProfile.avatar || "";

          setPersonalInfo({
            name: userProfile.name || "",
            email: userProfile.email || "",
            avatar: avatarToUse
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Handle personal info update
  const handlePersonalInfoUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Include current avatar state in the update
      const updateData = {
        ...personalInfo,
        // Ensure avatar is included (either from current personalInfo or avatarPreview if there's a pending upload)
        avatar: avatarPreview || personalInfo.avatar
      };

      const updatedUser = await updateUserProfile(updateData);

      // Update all local states
      setUser(updatedUser);
      setProfile(updatedUser);
      setPersonalInfo(updateData);

      // Clear any pending avatar upload states since we've now saved everything
      if (avatarPreview) {
        setAvatarPreview(null);
        setAvatarFile(null);
      }

      setSuccess("Personal information and profile picture updated successfully!");
    } catch (error) {
      setError(error.message || "Failed to update personal information");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
      }

      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setSuccess("Password changed successfully!");
    } catch (error) {
      setError(error.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // Handle avatar file selection
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar upload (immediate save)
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    try {
      setUploadingAvatar(true);
      setError("");

      // Convert to base64 and save to localStorage immediately
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Avatar = e.target.result;
        const updatedPersonalInfo = {...personalInfo, avatar: base64Avatar};

        // Save to localStorage first
        try {
          const updatedUser = await updateUserProfile(updatedPersonalInfo);

          // Update local state after successful save
          setPersonalInfo(updatedPersonalInfo);

          // Update user state to reflect the change
          setUser(updatedUser);

          // Clear upload states
          setAvatarPreview(null);
          setAvatarFile(null);
          setSuccess("Profile picture updated and saved successfully!");
        } catch (saveError) {
          setError("Failed to save profile picture");
        }
      };
      reader.readAsDataURL(avatarFile);
    } catch (error) {
      setError("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Remove avatar
  const handleRemoveAvatar = async () => {
    try {
      const updatedPersonalInfo = {...personalInfo, avatar: ""};

      // Save to localStorage first
      const updatedUser = await updateUserProfile(updatedPersonalInfo);

      // Update local state after successful save
      setPersonalInfo(updatedPersonalInfo);
      setUser(updatedUser);
      setAvatarPreview(null);
      setAvatarFile(null);

      setSuccess("Profile picture removed and saved successfully!");
    } catch (error) {
      setError("Failed to remove profile picture");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    document.getElementById('delete_account_modal').showModal();
  };

  const confirmDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    logoutUser();
    router.push("/login");
  };

  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    // States
    user,
    profile,
    loading,
    saving,
    error,
    success,
    activeTab,
    personalInfo,
    passwordForm,
    avatarFile,
    avatarPreview,
    uploadingAvatar,
    
    // Setters
    setActiveTab,
    setPersonalInfo,
    setPasswordForm,
    setAvatarFile,
    setAvatarPreview,
    clearMessages,
    
    // Handlers
    handlePersonalInfoUpdate,
    handlePasswordChange,
    handleAvatarFileChange,
    handleAvatarUpload,
    handleRemoveAvatar,
    handleDeleteAccount,
    confirmDeleteAccount
  };
};

export default useProfile;
