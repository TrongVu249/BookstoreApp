import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const Profile = () => {
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);

    // Profile form
    const [profileForm, setProfileForm] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
    });
    const [profileErrors, setProfileErrors] = useState({});

    // Password form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getProfile();
            setProfile(data);
            setProfileForm({
                fullName: data.fullName || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
        if (profileErrors[name]) {
            setProfileErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateProfileForm = () => {
        const errors = {};
        if (!profileForm.fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (profileForm.fullName.length > 100) {
            errors.fullName = 'Full name cannot exceed 100 characters';
        }
        if (profileForm.address && profileForm.address.length > 500) {
            errors.address = 'Address cannot exceed 500 characters';
        }
        setProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePasswordForm = () => {
        const errors = {};
        if (!passwordForm.currentPassword) {
            errors.currentPassword = 'Current password is required';
        }
        if (!passwordForm.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (passwordForm.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters';
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
            if (!passwordRegex.test(passwordForm.newPassword)) {
                errors.newPassword = 'Password must contain uppercase, lowercase, number, and special character';
            }
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!validateProfileForm()) return;

        setSaving(true);
        try {
            const updatedProfile = await userService.updateProfile(profileForm);
            setProfile(updatedProfile);
            alert('✅ Profile updated successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        setSaving(true);
        try {
            await userService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword,
            });
            alert('✅ Password changed successfully!');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-600 mt-2">Manage your account information and password</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Profile Picture */}
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3">
                                {profile?.fullName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <h3 className="font-semibold text-gray-900">{profile?.fullName}</h3>
                            <p className="text-sm text-gray-600">@{profile?.userName}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {profile?.role}
                            </span>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'account'
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                ℹ️ Account Details
                            </button>

                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile'
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                👤 Change Profile Information
                            </button>

                            <button
                                onClick={() => setActiveTab('password')}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'password'
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                🔒 Change Password
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'account' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Account Details</h2>
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-4">
                                    <label className="text-sm font-medium text-gray-600">Username</label>
                                    <p className="text-gray-900 font-medium">{profile?.userName}</p>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-gray-900 font-medium">{profile?.email}</p>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                                    <p className="text-gray-900 font-medium">{profile?.fullName}</p>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                                    <p className="text-gray-900 font-medium">{profile?.phoneNumber}</p>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <label className="text-sm font-medium text-gray-600">Address</label>
                                    <p className="text-gray-900 font-medium">{profile?.address}</p>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <label className="text-sm font-medium text-gray-600">Role</label>
                                    <p className="text-gray-900 font-medium">{profile?.role}</p>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <label className="text-sm font-medium text-gray-600">Account Status</label>
                                    <p className="text-gray-900 font-medium">
                                        {profile?.isActive ? (
                                            <span className="text-green-600">✓ Active</span>
                                        ) : (
                                            <span className="text-red-600">✗ Inactive</span>
                                        )}
                                    </p>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <label className="text-sm font-medium text-gray-600">Member Since</label>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(profile?.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {profile?.updatedAt && (
                                    <div className="border-b border-gray-200 pb-4">
                                        <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                        <p className="text-gray-900 font-medium">
                                            {new Date(profile?.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <strong>Note:</strong> Username and email cannot be changed. If you need to update these, please contact support.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Change Profile Information</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profileForm.fullName}
                                        onChange={handleProfileChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${profileErrors.fullName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="John Doe"
                                    />
                                    {profileErrors.fullName && (
                                        <p className="text-red-500 text-xs mt-1">{profileErrors.fullName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={profileForm.phoneNumber}
                                        onChange={handleProfileChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={profileForm.address}
                                        onChange={handleProfileChange}
                                        rows="4"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${profileErrors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="123 Main Street, City, Country"
                                    />
                                    {profileErrors.address && (
                                        <p className="text-red-500 text-xs mt-1">{profileErrors.address}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {saving ? 'Saving...' : '✅ Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    {passwordErrors.currentPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    {passwordErrors.newPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    {passwordErrors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {saving ? 'Changing Password...' : '🔒 Change Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;