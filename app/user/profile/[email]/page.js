'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

export default function UserProfile() {
  const { email } = useParams();
  const { theme } = useDaisyTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [userCredentials, setUserCredentials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSignOut = () => {
    localStorage.removeItem('yuvaToken');
    localStorage.removeItem('yuvaUser');
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        setError('Invalid user email');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ✅ Remove encodeURIComponent
        const res = await fetch(`/api/profile/${email}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch user data');

        setUserProfile(data.userProfile);
        setUserCredentials(data.userCredentials);

        if (data.userCredentials?.userToken) {
          localStorage.setItem('userToken', data.userCredentials.userToken);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <div className="alert alert-error"><span>Error: {error}</span></div>
    </div>
  );

  if (!userProfile) return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <div className="alert alert-warning"><span>User profile not found</span></div>
    </div>
  );

  return (
    <div className="min-h-screen p-8" data-theme={theme}>
      <div className="max-w-3xl mx-auto bg-base-100 border border-base-300 rounded-lg shadow-sm p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{userProfile.fullName || 'User'}</h1>
            <p className="text-base-content/70">{userProfile.email}</p>
          </div>
          <button onClick={handleSignOut} className="btn btn-error btn-outline">
            Sign Out
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-base-200 p-4">
            <p className="text-sm text-base-content/60">Provider</p>
            <p className="font-semibold">{userCredentials?.provider || 'N/A'}</p>
          </div>
          <div className="rounded-lg bg-base-200 p-4">
            <p className="text-sm text-base-content/60">Verified</p>
            <p className="font-semibold">{userCredentials?.isVerified ? 'Yes' : 'No'}</p>
          </div>
          <div className="rounded-lg bg-base-200 p-4">
            <p className="text-sm text-base-content/60">Phone</p>
            <p className="font-semibold">{userProfile.phone || 'Not added'}</p>
          </div>
          <div className="rounded-lg bg-base-200 p-4">
            <p className="text-sm text-base-content/60">Age</p>
            <p className="font-semibold">{userProfile.age || 'Not added'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
